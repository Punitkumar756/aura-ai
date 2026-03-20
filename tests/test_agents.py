"""Tests for Aura AI agents"""
import pytest
from datetime import datetime
from src.models import EventType, IssueType, DiagnosisResult
from src.agents.router import AgentRouter
from src.tools.diagnostic import DiagnosisLLMTool


@pytest.mark.asyncio
async def test_router_pipeline_failed():
    """Test that pipeline failure events route to Pipeline Guardian"""
    
    event = {
        "event_type": EventType.PIPELINE_FAILED,
        "failed_job": "test",
        "pipeline_status": "failed",
    }
    
    decision = await AgentRouter.route_event(event)
    
    assert decision.should_act is True
    assert decision.target_agent == "PipelineGuardianAgent"
    assert decision.confidence > 0.8


@pytest.mark.asyncio
async def test_router_skips_prod_failures():
    """Test that prod deployment failures are not auto-acted"""
    
    event = {
        "event_type": EventType.PIPELINE_FAILED,
        "failed_job": "deploy_prod",
        "pipeline_status": "failed",
    }
    
    decision = await AgentRouter.route_event(event)
    
    assert decision.should_act is False


@pytest.mark.asyncio
async def test_diagnosis_syntax_error():
    """Test that syntax errors are correctly diagnosed"""
    
    log = """
    File "test.py", line 5
    def broken(
    ^
    SyntaxError: unexpected EOF while parsing
    """
    
    diagnosis = await DiagnosisLLMTool.diagnose(
        job_log=log,
        job_name="test",
        branch="main",
    )
    
    assert diagnosis.issue_type == IssueType.SYNTAX_ERROR


@pytest.mark.asyncio
async def test_diagnosis_test_failure():
    """Test that test failures are correctly diagnosed"""
    
    log = """
    test_calculate_total FAILED
    assert result == 100
    AssertionError: assert 50 == 100
    """
    
    diagnosis = await DiagnosisLLMTool.diagnose(
        job_log=log,
        job_name="test_unit",
        branch="main",
    )
    
    assert diagnosis.issue_type == IssueType.TEST_FAILURE


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
