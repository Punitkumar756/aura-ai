"""Event router - decides which agent handles each event"""
import logging
from datetime import datetime
from src.models import (
    PipelineFailedEvent,
    EventType,
    AgentDecision,
)

logger = logging.getLogger(__name__)


class AgentRouter:
    """Routes events to appropriate agents"""
    
    @staticmethod
    async def route_event(event: dict) -> AgentDecision:
        """
        Analyze event and decide which agent should handle it.
        Returns the routing decision.
        """
        
        event_type = event.get("event_type")
        
        if event_type == EventType.PIPELINE_FAILED:
            return AgentRouter._route_pipeline_failed(event)
        elif event_type == EventType.MR_OPENED:
            return AgentRouter._route_mr_opened(event)
        elif event_type == EventType.SECURITY_SCAN_COMPLETE:
            return AgentRouter._route_security_scan(event)
        else:
            return AgentDecision(
                event_type=event_type,
                should_act=False,
                reasoning="Event type not recognized",
                confidence=0.0,
                timestamp=datetime.utcnow(),
            )
    
    @staticmethod
    def _route_pipeline_failed(event: dict) -> AgentDecision:
        """Route pipeline failure to Pipeline Guardian Agent"""
        
        # Analyze if we should act
        failed_job = event.get("failed_job", "")
        pipeline_status = event.get("pipeline_status", "")
        
        should_act = (
            pipeline_status == "failed" and
            failed_job not in ["manual_approval", "deploy_prod"]
        )
        
        return AgentDecision(
            event_type=EventType.PIPELINE_FAILED,
            should_act=should_act,
            action_type="diagnose_and_fix",
            target_agent="PipelineGuardianAgent",
            reasoning="Pipeline failed in non-prod environment, attempting auto-diagnosis",
            confidence=0.85 if should_act else 0.0,
            timestamp=datetime.utcnow(),
        )
    
    @staticmethod
    def _route_mr_opened(event: dict) -> AgentDecision:
        """Route MR to Test Orchestrator Agent"""
        return AgentDecision(
            event_type=EventType.MR_OPENED,
            should_act=True,
            action_type="analyze_and_test",
            target_agent="TestOrchestratorAgent",
            reasoning="MR opened, analyzing for test coverage gaps",
            confidence=0.75,
            timestamp=datetime.utcnow(),
        )
    
    @staticmethod
    def _route_security_scan(event: dict) -> AgentDecision:
        """Route security scan to Compliance Agent"""
        return AgentDecision(
            event_type=EventType.SECURITY_SCAN_COMPLETE,
            should_act=True,
            action_type="validate_compliance",
            target_agent="ComplianceAgent",
            reasoning="Security scan completed, validating against compliance policies",
            confidence=0.8,
            timestamp=datetime.utcnow(),
        )
