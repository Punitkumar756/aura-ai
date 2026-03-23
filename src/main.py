"""
Aura AI Agent System - Main FastAPI Application
Event-driven agentic AI for GitLab pipeline automation
"""

import logging
import hmac
import hashlib
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict, Any
import json

from src.config import settings
from src.models import EventType
from src.integrations.gitlab import GitLabIntegration
from src.agents.router import AgentRouter
from src.agents.pipeline_guardian import PipelineGuardianAgent

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="Aura AI Agent System",
    description="Event-driven agent framework for GitLab automation",
    version="0.1.0",
)


@app.get("/")
async def root():
    """Root endpoint to avoid generic 404s and guide users."""
    return {
        "service": "aura-ai-agent-system",
        "status": "ok",
        "health": "/health",
    }

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
gitlab_integration = GitLabIntegration()
pipeline_guardian = PipelineGuardianAgent(gitlab_integration)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "aura-ai-agent-system"}


@app.post("/webhooks/gitlab")
async def gitlab_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Main webhook endpoint for GitLab events.
    Validates signature and routes events to appropriate agents.
    """
    
    # Validate webhook signature
    if not await _validate_gitlab_signature(request):
        logger.warning("Invalid GitLab webhook signature")
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    body = await request.json()
    logger.info(f"Received GitLab webhook: {body.get('object_kind', 'unknown')}")
    
    # Parse event
    event = _parse_gitlab_event(body)
    
    if not event:
        logger.warning("Could not parse event")
        raise HTTPException(status_code=400, detail="Invalid event format")
    
    # Route event
    decision = await AgentRouter.route_event(event)
    
    logger.info(
        f"Event routed to {decision.target_agent}: {decision.reasoning} "
        f"(confidence: {decision.confidence:.0%})"
    )
    
    # Handle in background if action is needed
    if decision.should_act:
        if decision.target_agent == "PipelineGuardianAgent":
            background_tasks.add_task(
                _handle_pipeline_failure,
                event,
            )
    
    return {
        "status": "received",
        "event_type": event["event_type"].value,
        "routing_decision": {
            "agent": decision.target_agent,
            "will_act": decision.should_act,
            "confidence": decision.confidence,
        },
    }


async def _validate_gitlab_signature(request: Request) -> bool:
    """Validate GitLab webhook signature"""
    try:
        if settings.gitlab_webhook_secret is None or settings.gitlab_webhook_secret == "your_webhook_secret":
            logger.warning("Webhook secret not configured, skipping signature validation")
            return True
        
        signature = request.headers.get("X-Gitlab-Token")
        if not signature:
            return False
        
        body = await request.body()
        expected_signature = hashlib.sha256(
            body + settings.gitlab_webhook_secret.encode()
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
    except Exception as e:
        logger.error(f"Error validating signature: {e}")
        return False


def _parse_gitlab_event(body: Dict[str, Any]) -> Dict[str, Any]:
    """Parse GitLab webhook payload into Aura event format"""
    
    object_kind = body.get("object_kind", "")
    
    # Pipeline event
    if object_kind == "pipeline":
        pipeline = body.get("object_attributes", {})
        project = body.get("project", {})
        
        if pipeline.get("status") == "failed":
            # Find failed job details
            failed_jobs = body.get("builds", [])
            failed_job = next(
                (j for j in failed_jobs if j.get("status") == "failed"),
                failed_jobs[0] if failed_jobs else {}
            )
            
            return {
                "event_type": EventType.PIPELINE_FAILED,
                "project_id": project.get("id"),
                "project_name": project.get("name"),
                "pipeline_id": pipeline.get("id"),
                "pipeline_status": pipeline.get("status"),
                "failed_job": failed_job.get("name", "unknown"),
                "failed_job_id": failed_job.get("id", 0),
                "branch": pipeline.get("ref"),
                "commit_sha": pipeline.get("sha"),
                "commit_message": pipeline.get("commit_message", ""),
                "user_name": body.get("user", {}).get("name", "unknown"),
                "timestamp": datetime.utcnow(),
            }
    
    # Merge Request event
    elif object_kind == "merge_request":
        mr = body.get("object_attributes", {})
        project = body.get("project", {})
        
        if mr.get("action") == "open":
            return {
                "event_type": EventType.MR_OPENED,
                "project_id": project.get("id"),
                "project_name": project.get("name"),
                "mr_id": mr.get("id"),
                "mr_iid": mr.get("iid"),
                "source_branch": mr.get("source_branch"),
                "target_branch": mr.get("target_branch"),
                "title": mr.get("title"),
                "timestamp": datetime.utcnow(),
            }
    
    # Other events can be added here
    
    return None


async def _handle_pipeline_failure(event: Dict[str, Any]):
    """Background task to handle pipeline failure"""
    try:
        logger.info(f"Handling pipeline failure for project {event['project_id']}")
        result = await pipeline_guardian.handle_pipeline_failure(event)
        logger.info(f"Pipeline guardian result: {result['status']}")
    except Exception as e:
        logger.error(f"Error handling pipeline failure: {e}", exc_info=True)


@app.post("/api/agents/status")
async def get_agent_status():
    """Get status of all agents"""
    return {
        "agents": [
            {
                "agent_name": "Pipeline Guardian",
                "status": "ACTIVE",
                "last_activity": datetime.utcnow().isoformat(),
                "errors": 0,
                "successes": 12,
                # Backwards-compatible fields
                "name": "PipelineGuardianAgent",
                "events_handled": 0,
                "actions_taken": 0,
            },
        ],
        "webhook_endpoint": "/webhooks/gitlab",
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/api/metrics")
async def get_dashboard_metrics():
    """Return dashboard metrics for the frontend."""
    return {
        "total_failures_today": 8,
        "avg_diagnosis_time_ms": 1450,
        "success_rate_percent": 87.5,
        "active_agents": 1,
    }


@app.get("/api/pipeline-failures")
async def get_pipeline_failures():
    """Return recent pipeline failures for the frontend."""
    now = datetime.utcnow()
    return {
        "failures": [
            {
                "event_id": "evt-001",
                "event_type": "PIPELINE_FAILED",
                "project_name": "example-project",
                "status": "RESOLVED",
                "timestamp": (now).isoformat(),
                "agent_name": "Pipeline Guardian",
                "action_status": "MR_CREATED",
                "details": {
                    "failure_type": "IMPORT_ERROR",
                    "diagnosis": "Missing requests module",
                    "mr_url": "#",
                },
            },
            {
                "event_id": "evt-002",
                "event_type": "PIPELINE_FAILED",
                "project_name": "another-project",
                "status": "PENDING",
                "timestamp": (now).isoformat(),
                "agent_name": "Pipeline Guardian",
                "action_status": "DIAGNOSING",
                "details": {
                    "failure_type": "TEST_FAILURE",
                    "diagnosis": "Unit test assertion failed",
                },
            },
        ]
    }


@app.get("/api/events")
async def get_events(page: int = 1, limit: int = 20):
    """Return event log data for the frontend."""
    failures = (await get_pipeline_failures())["failures"]
    return {
        "events": failures[:limit],
        "total": 42,
        "page": page,
        "limit": limit,
    }


@app.get("/api/events/{event_id}")
async def get_event_details(event_id: str):
    """Return a single event for the frontend."""
    failures = (await get_pipeline_failures())["failures"]
    for failure in failures:
        if failure["event_id"] == event_id:
            return failure
    raise HTTPException(status_code=404, detail="Event not found")


@app.post("/api/test/trigger-pipeline-failure")
async def test_trigger_pipeline_failure(background_tasks: BackgroundTasks):
    """
    Test endpoint to simulate pipeline failure event.
    Useful for local testing.
    """
    
    test_event = {
        "event_type": EventType.PIPELINE_FAILED,
        "project_id": 1,
        "project_name": "test-project",
        "pipeline_id": 123,
        "pipeline_status": "failed",
        "failed_job": "test",
        "failed_job_id": 456,
        "branch": "main",
        "commit_sha": "abc123def456",
        "commit_message": "Test commit",
        "user_name": "test-user",
        "timestamp": datetime.utcnow(),
    }
    
    logger.info("Test: Simulating pipeline failure event")
    background_tasks.add_task(_handle_pipeline_failure, test_event)
    
    return {
        "status": "test_triggered",
        "event": "pipeline_failed",
        "message": "Check logs for agent execution"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
    )
