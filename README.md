# Aura AI Agent System

Event-driven agentic AI framework for GitLab automation. Built for hackathons.

## Quick Start

### 1. Setup

```bash
# Clone and install
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env with your GitLab token and Webhook secret
```

### 2. Run Server

```bash
python -m src.main
```

Server runs on `http://localhost:8000`

### 3. Test Locally

```bash
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure
```

Check logs for agent execution.

## Architecture Overview

```
GitLab Webhook Event
    ↓
Flask Server (receive + validate signature)
    ↓
Event Parser (normalize to Aura model)
    ↓
Agent Router (classify + route)
    ↓
Specialist Agent (Pipeline Guardian, Compliance, Test Orchestrator)
    ↓
Tools (diagnose, generate fix, create MR, update status)
    ↓
GitLab API (actions: MR, issue, commit, status)
```

## Current Agents

### 1. Pipeline Guardian Agent ✅ (MVP)

**Triggered by:** Pipeline failure event

**Actions:**
- Fetch failed job log
- Diagnose root cause (syntax, lint, test, import, dependency, config errors)
- Generate fix suggestion
- Create fix branch
- Open merge request with diagnosis
- Update commit status

**Example:** Job fails due to missing import → Agent creates branch + MR with fix

### 2. Compliance Agent (Stub)

**Triggered by:** Security scan complete, MR opened

**Planned Actions:**
- Check for secrets exposure
- Validate license compliance
- Scan for PII patterns
- Check CVE database
- Generate audit report
- Block merge if critical policy fails

### 3. Test Orchestrator Agent (Stub)

**Triggered by:** MR opened

**Planned Actions:**
- Analyze changed files
- Select high-impact test suite
- Generate missing unit/integration tests
- Trigger test pipeline
- Compare flakiness trends
- Open MR with generated tests

## Project Structure

```
aura-ai/
├── src/
│   ├── main.py                 # FastAPI app + webhook handler
│   ├── config.py               # Settings from .env
│   ├── models.py               # Pydantic models (events, decisions, actions)
│   ├── agents/
│   │   ├── router.py           # Event routing logic
│   │   ├── pipeline_guardian.py # Main agent (MVP)
│   │   ├── compliance.py       # Stub
│   │   └── test_orchestrator.py # Stub
│   ├── integrations/
│   │   └── gitlab.py           # GitLab API wrapper
│   ├── tools/
│   │   ├── diagnostic.py       # Parse logs, diagnose, generate fixes
│   │   ├── compliance.py       # Stub
│   │   └── testing.py          # Stub
│   └── models/                 # Future: database models
├── tests/
│   └── test_agents.py          # Unit/integration tests
├── requirements.txt            # Dependencies
├── .env.example                # Config template
└── README.md
```

## GitLab Setup

### 1. Create Personal Access Token

- Settings → Access Tokens
- Scopes: `api`, `read_api`, `write_repository`
- Copy token to `.env` as `GITLAB_TOKEN`

### 2. Add Webhook to Project

- Project → Settings → Webhooks
- URL: `https://your-server/webhooks/gitlab`
- Trigger: Pipeline events, Merge request events
- Secret: Generate random string, add to `.env` as `GITLAB_WEBHOOK_SECRET`

### 3. Test Webhook

- Trigger pipeline failure in your repo
- Check server logs for event receipt and agent execution

## Hackathon Demo Script

1. **Setup:** Show running server
   ```bash
   python -m src.main
   ```

2. **Simulate Failure:** Push commit that breaks tests/lint
   ```bash
   git push origin test-branch
   ```

3. **Show Webhook:** Display webhook event in server logs
   ```
   INFO:src.agents.pipeline_guardian:Processing pipeline failure
   INFO:src.agents.pipeline_guardian:Diagnosis: test_failure - Unit test assertion failed
   ```

4. **Show Results:**
   - Refresh GitLab project
   - Show auto-created branch `fix/test` 
   - Show MR with diagnosis and fix suggestion
   - Show commit status update

5. **Explain Impact:**
   - **MTTR reduced:** Agent acts within seconds vs. waiting for human
   - **No lost context:** Diagnosis included in MR
   - **Scalable:** Works on any failure type
   - **Safe:** Confidence scores and validation gates

## Next Steps (Post-MVP)

- [ ] Real LLM integration (currently heuristic-based)
- [ ] Database logging + dashboard
- [ ] Compliance agent (secrets, CVE, PII detection)
- [ ] Test generator agent
- [ ] Multi-project support
- [ ] Webhook signature validation (skip for now in dev)
- [ ] Approval workflows + human-in-the-loop gates
- [ ] Metrics: MTTR, fix acceptance rate, false positives

## Testing

```bash
# Unit tests (future)
pytest tests/

# Manual webhook test
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure

# Health check
curl http://localhost:8000/health
```

## Troubleshooting

**"Invalid signature" error:**
- Uncomment signature validation skip in `main.py` for dev
- Add webhook secret to GitLab and `.env`

**Agent not executing:**
- Check `GITLAB_TOKEN` is valid
- Check project exists and token has `api` scope
- Check server logs for errors

**MR not created:**
- Verify source and target branches exist
- Check GitLab token permissions
- See logs for API error

