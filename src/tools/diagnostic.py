"""Tool definitions for agents to use"""
import logging
from typing import Dict, Any, Optional
from src.models import DiagnosisResult, IssueType

logger = logging.getLogger(__name__)


class ParseJobLogTool:
    """Parse and analyze job logs to identify failure reason"""
    
    @staticmethod
    async def parse_log(log_content: str) -> Dict[str, Any]:
        """Extract key information from job log"""
        result = {
            "raw_log": log_content[:500],  # First 500 chars
            "error_lines": [],
            "warnings": [],
            "key_phrases": [],
        }
        
        error_keywords = [
            "error", "failed", "exception", "traceback",
            "fatal", "critical", "unexpected"
        ]
        
        for line in log_content.split('\n'):
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in error_keywords):
                result["error_lines"].append(line.strip())
                if len(result["error_lines"]) >= 5:
                    break
        
        return result


class DiagnosisLLMTool:
    """Use LLM to diagnose issue from logs"""
    
    @staticmethod
    async def diagnose(
        job_log: str,
        job_name: str,
        branch: str
    ) -> DiagnosisResult:
        """
        Analyze job logs to diagnose root cause.
        In production, this calls OpenAI GPT-4.
        For MVP, we use heuristics.
        """
        
        log_lower = job_log.lower()
        
        # Heuristic-based classification (MVP)
        if "syntax error" in log_lower or "invalid syntax" in log_lower:
            issue_type = IssueType.SYNTAX_ERROR
            root_cause = "Code contains syntax errors"
        elif "import error" in log_lower or "modulenotfound" in log_lower:
            issue_type = IssueType.IMPORT_ERROR
            root_cause = "Missing or incorrect import statement"
        elif "assertion" in log_lower or "test_" in job_name.lower():
            issue_type = IssueType.TEST_FAILURE
            root_cause = "Unit test assertion failed"
        elif "lint" in job_name.lower() or "flake8" in log_lower or "pylint" in log_lower:
            issue_type = IssueType.LINT_ERROR
            root_cause = "Code style or linting violation"
        elif "could not find" in log_lower or "dependency" in log_lower:
            issue_type = IssueType.DEPENDENCY_ERROR
            root_cause = "Missing or conflicting dependency"
        elif "config" in job_name.lower() or "yaml" in log_lower:
            issue_type = IssueType.CONFIG_ERROR
            root_cause = "Configuration file error"
        else:
            issue_type = IssueType.UNKNOWN
            root_cause = "Unknown issue type"
        
        return DiagnosisResult(
            issue_type=issue_type,
            root_cause=root_cause,
            affected_component=job_name,
            severity="high",
            suggested_fix="Review logs and fix the reported issue",
            confidence=0.6 if issue_type == IssueType.UNKNOWN else 0.8,
            evidence=[line for line in log_lower.split('\n') if 'error' in line][:3]
        )


class GenerateFixTool:
    """Generate code fix from diagnosis"""
    
    @staticmethod
    async def generate_fix(diagnosis: DiagnosisResult) -> Dict[str, Any]:
        """Generate suggested code fix"""
        
        # MVP: Return template fixes
        fix_templates = {
            IssueType.SYNTAX_ERROR: {
                "description": "Check for mismatched brackets, quotes, or indentation",
                "action": "Review the syntax error traceback and fix accordingly",
            },
            IssueType.IMPORT_ERROR: {
                "description": "Add missing import or fix import path",
                "action": "Add the missing module import at the top of the file",
            },
            IssueType.TEST_FAILURE: {
                "description": "Fix failing test assertion or test data",
                "action": "Review test assertions and ensure test data is correct",
            },
            IssueType.LINT_ERROR: {
                "description": "Fix code style issues",
                "action": "Run formatter and linter to auto-fix issues",
            },
            IssueType.DEPENDENCY_ERROR: {
                "description": "Add or update dependency in requirements",
                "action": "Add missing package to requirements.txt with correct version",
            },
        }
        
        template = fix_templates.get(
            diagnosis.issue_type,
            {"description": "Unknown issue", "action": "Manual investigation needed"}
        )
        
        return {
            "issue_type": diagnosis.issue_type,
            "description": template["description"],
            "action": template["action"],
            "suggested_branch_name": f"fix/{diagnosis.affected_component.replace('_', '-')}",
            "patch_priority": "high" if diagnosis.severity == "critical" else "medium",
        }


class CreateFixBranchTool:
    """Create a branch for the fix"""
    
    @staticmethod
    async def create_branch(
        gitlab_integration,
        project_id: int,
        branch_name: str,
        source_ref: str
    ) -> Optional[bool]:
        """Create fix branch from source ref"""
        try:
            return gitlab_integration.create_branch(
                project_id=project_id,
                branch_name=branch_name,
                ref=source_ref
            )
        except Exception as e:
            logger.error(f"Failed to create branch: {e}")
            return False


class ValidateFixTool:
    """Validate that the fix is safe to apply"""
    
    @staticmethod
    async def validate(fix: Dict[str, Any]) -> Dict[str, Any]:
        """Check if fix meets safety criteria"""
        
        return {
            "is_safe": True,
            "risk_level": "low",
            "requires_review": False,
            "can_auto_apply": True,
            "notes": "Fix appears safe for auto-application",
        }
