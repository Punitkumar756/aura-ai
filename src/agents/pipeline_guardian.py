"""Pipeline Guardian Agent - auto-diagnoses and fixes pipeline failures"""
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from src.models import (
    PipelineFailedEvent,
    DiagnosisResult,
    AgentAction,
    ActionResult,
    EventType,
)
from src.integrations.gitlab import GitLabIntegration
from src.tools.diagnostic import (
    ParseJobLogTool,
    DiagnosisLLMTool,
    GenerateFixTool,
    ValidateFixTool,
)

logger = logging.getLogger(__name__)


class PipelineGuardianAgent:
    """
    Automatic Pipeline Failure Response Agent
    
    Workflow:
    1. Receive pipeline failure event
    2. Fetch and parse job logs
    3. Diagnose root cause
    4. Generate fix suggestion
    5. Validate fix safety
    6. Create fix branch + MR
    7. Update commit status
    """
    
    def __init__(self, gitlab: GitLabIntegration):
        self.gitlab = gitlab
        self.name = "PipelineGuardianAgent"
    
    async def handle_pipeline_failure(
        self,
        event: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Main entry point for handling pipeline failures
        """
        
        project_id = event["project_id"]
        pipeline_id = event["pipeline_id"]
        failed_job_id = event["failed_job_id"]
        branch = event["branch"]
        commit_sha = event["commit_sha"]
        
        logger.info(f"[{self.name}] Processing pipeline failure: {pipeline_id}")
        
        actions: List[AgentAction] = []
        
        # Step 1: Fetch job log
        logger.info(f"[{self.name}] Fetching job log {failed_job_id}")
        job_log = self.gitlab.get_job_log(project_id, failed_job_id)
        
        if not job_log:
            logger.warning(f"[{self.name}] Could not fetch job log")
            return self._create_outcome(actions, "failed", "Could not fetch job log")
        
        # Step 2: Parse log
        logger.info(f"[{self.name}] Parsing job log")
        parsed_log = await ParseJobLogTool.parse_log(job_log)
        
        # Step 3: Diagnose
        logger.info(f"[{self.name}] Diagnosing issue")
        diagnosis = await DiagnosisLLMTool.diagnose(
            job_log=job_log,
            job_name=event.get("failed_job", "unknown"),
            branch=branch,
        )
        
        logger.info(f"[{self.name}] Diagnosis: {diagnosis.issue_type} - {diagnosis.root_cause}")
        
        # Step 4: Generate fix
        logger.info(f"[{self.name}] Generating fix suggestion")
        fix = await GenerateFixTool.generate_fix(diagnosis)
        
        # Step 5: Validate fix
        logger.info(f"[{self.name}] Validating fix safety")
        validation = await ValidateFixTool.validate(fix)
        
        if not validation["can_auto_apply"]:
            logger.info(f"[{self.name}] Fix requires manual review")
            return self._create_outcome(
                actions,
                "partial",
                "Fix generated but requires manual review"
            )
        
        # Step 6: Create fix branch
        logger.info(f"[{self.name}] Creating fix branch")
        fix_branch = fix["suggested_branch_name"]
        branch_created = await self._create_fix_branch(
            project_id=project_id,
            branch_name=fix_branch,
            source_ref=commit_sha,
        )
        
        if branch_created:
            actions.append(AgentAction(
                agent_name=self.name,
                action_type="create_branch",
                target=fix_branch,
                description=f"Created fix branch {fix_branch}",
                payload={"branch": fix_branch},
                result=ActionResult.SUCCESS,
                confidence=0.9,
                timestamp=datetime.utcnow(),
            ))
        else:
            logger.error(f"[{self.name}] Failed to create fix branch")
            return self._create_outcome(actions, "partial", "Could not create fix branch")
        
        # Step 7: Create MR with diagnosis
        logger.info(f"[{self.name}] Creating merge request")
        mr_result = await self._create_fix_mr(
            project_id=project_id,
            source_branch=fix_branch,
            target_branch=branch,
            diagnosis=diagnosis,
            fix=fix,
        )
        
        if mr_result:
            actions.append(AgentAction(
                agent_name=self.name,
                action_type="create_mr",
                target=f"MR !{mr_result['iid']}",
                description=f"Created MR with fix suggestion: {mr_result['web_url']}",
                payload=mr_result,
                result=ActionResult.SUCCESS,
                confidence=0.9,
                timestamp=datetime.utcnow(),
            ))
        
        # Step 8: Update commit status
        logger.info(f"[{self.name}] Updating commit status")
        status_updated = self.gitlab.update_pipeline_status(
            project_id=project_id,
            commit_sha=commit_sha,
            status="pending",
            description="Aura AI: Auto-fix in progress",
            context="aura-ai/pipeline-guardian"
        )
        
        if status_updated:
            actions.append(AgentAction(
                agent_name=self.name,
                action_type="update_status",
                target=commit_sha[:8],
                description="Updated commit status to pending (fix in progress)",
                payload={"status": "pending"},
                result=ActionResult.SUCCESS,
                confidence=0.9,
                timestamp=datetime.utcnow(),
            ))
        
        return self._create_outcome(
            actions,
            "success",
            f"Auto-fix created for {diagnosis.issue_type}: {diagnosis.root_cause}"
        )
    
    async def _create_fix_branch(
        self,
        project_id: int,
        branch_name: str,
        source_ref: str
    ) -> bool:
        """Create fix branch safely"""
        try:
            return self.gitlab.create_branch(
                project_id=project_id,
                branch_name=branch_name,
                ref=source_ref
            )
        except Exception as e:
            logger.error(f"[{self.name}] Error creating branch: {e}")
            return False
    
    async def _create_fix_mr(
        self,
        project_id: int,
        source_branch: str,
        target_branch: str,
        diagnosis: DiagnosisResult,
        fix: Dict[str, Any],
    ) -> Optional[Dict[str, Any]]:
        """Create MR with diagnosis and fix"""
        
        title = f"🤖 Auto-fix: {diagnosis.issue_type} in {diagnosis.affected_component}"
        
        description = f"""## Auto-Diagnosis Report
        
Diagnosis by Aura AI Pipeline Guardian Agent

**Issue Type:** {diagnosis.issue_type.value}
**Root Cause:** {diagnosis.root_cause}
**Affected Component:** {diagnosis.affected_component}
**Severity:** {diagnosis.severity}
**Confidence:** {diagnosis.confidence:.0%}

### Suggested Fix
{fix.get('description', 'See fix details')}

### Action Items
- {fix.get('action', 'Review diagnosis')}

### Evidence
{chr(10).join(['- ' + line for line in diagnosis.evidence[:5]])}

---
*Generated by Aura AI - Please review before merging*
"""
        
        try:
            return self.gitlab.create_merge_request(
                project_id=project_id,
                source_branch=source_branch,
                target_branch=target_branch,
                title=title,
                description=description,
            )
        except Exception as e:
            logger.error(f"[{self.name}] Error creating MR: {e}")
            return None
    
    def _create_outcome(
        self,
        actions: List[AgentAction],
        status: str,
        description: str
    ) -> Dict[str, Any]:
        """Create agent outcome"""
        return {
            "agent": self.name,
            "status": status,
            "description": description,
            "actions_taken": len(actions),
            "actions": [
                {
                    "type": a.action_type,
                    "target": a.target,
                    "result": a.result.value,
                    "description": a.description,
                }
                for a in actions
            ],
            "timestamp": datetime.utcnow().isoformat(),
        }
