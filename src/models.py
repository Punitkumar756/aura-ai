from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum


class EventType(str, Enum):
    PIPELINE_FAILED = "pipeline_failed"
    MR_OPENED = "mr_opened"
    SECURITY_SCAN_COMPLETE = "security_scan_complete"
    DEPLOYMENT_FAILED = "deployment_failed"


class IssueType(str, Enum):
    LINT_ERROR = "lint_error"
    TEST_FAILURE = "test_failure"
    IMPORT_ERROR = "import_error"
    CONFIG_ERROR = "config_error"
    DEPENDENCY_ERROR = "dependency_error"
    SYNTAX_ERROR = "syntax_error"
    UNKNOWN = "unknown"


class ActionResult(str, Enum):
    SUCCESS = "success"
    FAILURE = "failure"
    PARTIAL = "partial"
    ESCALATED = "escalated"


# GitLab Webhook Events
class PipelineFailedEvent(BaseModel):
    project_id: int
    project_name: str
    pipeline_id: int
    pipeline_status: str
    failed_job: str
    failed_job_id: int
    branch: str
    commit_sha: str
    commit_message: str
    user_name: str
    timestamp: datetime


class AgentAction(BaseModel):
    """Action taken by an agent"""
    agent_name: str
    action_type: str
    target: str  # MR, Issue, etc.
    description: str
    payload: Dict[str, Any]
    result: ActionResult
    confidence: float
    timestamp: datetime


class DiagnosisResult(BaseModel):
    """Result of agent diagnosis"""
    issue_type: IssueType
    root_cause: str
    affected_component: str
    severity: str  # critical, high, medium, low
    suggested_fix: str
    confidence: float
    evidence: List[str]


class AgentDecision(BaseModel):
    """Decision made by an agent"""
    event_type: EventType
    should_act: bool
    action_type: Optional[str] = None
    target_agent: Optional[str] = None
    reasoning: str
    confidence: float
    timestamp: datetime


class EventLog(BaseModel):
    """Log entry for an event"""
    event_id: str
    event_type: EventType
    project_id: int
    timestamp: datetime
    payload: Dict[str, Any]
    agent_decisions: List[AgentDecision]
    actions: List[AgentAction]
    outcome: str
