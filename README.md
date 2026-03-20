# 🤖 Aura AI - Event-Driven Agent System for GitLab

> **Autonomous agent framework that detects GitLab events and intelligently responds with automated fixes, compliance checks, and test generation.**

Aura AI is a hackathon-ready, production-grade system that runs specialized agents in response to GitLab pipeline failures, security events, and merge requests. Each agent diagnoses issues and takes autonomous action via the GitLab API.

## ✨ Key Features

- **Event-Driven Architecture** - Responds to GitLab webhooks in real-time
- **Pipeline Guardian Agent** - Auto-diagnoses pipeline failures and creates fix branches with merge requests
- **Extensible Agent Framework** - Built-in support for Compliance, Test Orchestrator, and custom agents
- **Fast Diagnosis** - Issue classification and fix suggestions in under 2 seconds
- **Type-Safe** - Full Pydantic models and type hints throughout
- **Production Ready** - Async task processing, proper logging, signature validation

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Python 3.9+
- GitLab account with API access token
- OpenAI API key (for LLM-powered diagnosis)

### 1. Setup

```bash
# Clone and install
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Configure
cp .env.example .env
```

Edit `.env` with:
```env
GITLAB_URL=https://gitlab.com
GITLAB_TOKEN=glpat-XXXXXXXXXXXXX
GITLAB_WEBHOOK_SECRET=your-secret-here
OPENAI_API_KEY=sk-XXXXXXXXXXXXX
```

### 2. Run Server

```bash
python -m src.main
```

Server runs on `http://localhost:8000` ✅

### 3. Test Locally

```bash
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure
```

Watch the logs for agent execution. See [SETUP.md](SETUP.md) for detailed configuration.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────┐
│   GitLab Webhook Event              │  (pipeline failure, MR opened, etc.)
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   FastAPI Server + Validation       │  (signature verification, async)
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   Event Parser                      │  (normalize to domain models)
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   Agent Router                      │  (classify event → dispatch agent)
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   Specialist Agents                 │  (Guardian, Compliance, Orchestrator)
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   Diagnostic Tools                  │  (parse logs, classify errors)
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   GitLab API Integration            │  (create MR, update status, etc.)
└─────────────────────────────────────┘
```

## 🤖 Agents

### Pipeline Guardian Agent ✅ (MVP - Complete)

**Triggered by:** Pipeline failure events

**Capabilities:**
- 🔍 Fetches and analyzes failed job logs
- 🎯 Classifies root cause (syntax, lint, test, import, dependency, config errors)
- 💡 Generates fix suggestions using LLM analysis
- 🔀 Creates fix branch automatically
- 📝 Opens merge request with diagnosis and fix
- ✓ Updates commit status with results

**Example:** 
```
Push → Pipeline fails on missing import → 
Agent creates fix branch → Opens MR with fix → Dev merges
```

### Compliance Agent 📋 (Stub - Ready to Extend)

**Triggered by:** Security scan complete, MR opened

**Planned Capabilities:**
- 🔐 Detect secrets exposure
- 📜 Validate license compliance  
- 🚨 Scan for PII patterns
- 🐛 Check CVE database
- 📊 Generate audit reports
- 🛑 Block merge on critical policy violations

### Test Orchestrator Agent 📋 (Stub - Ready to Extend)

**Triggered by:** MR opened

**Planned Capabilities:**
- 📂 Analyze changed files
- ⚡ Select high-impact test suites
- 🧪 Generate missing unit/integration tests
- ▶️ Trigger test pipelines
- 📈 Compare flakiness trends
- 📝 Create MR with generated tests

## 📁 Project Structure

```
aura-ai/
├── src/
│   ├── main.py                      # FastAPI app + webhook handler
│   ├── config.py                    # Environment configuration
│   ├── models.py                    # Pydantic domain models
│   ├── agents/
│   │   ├── router.py                # Event → Agent routing logic
│   │   ├── pipeline_guardian.py     # Pipeline failure diagnosis & fix
│   │   ├── compliance.py            # Security & compliance checks (stub)
│   │   └── test_orchestrator.py     # Test generation & orchestration (stub)
│   ├── integrations/
│   │   └── gitlab.py                # GitLab API client
│   └── tools/
│       └── diagnostic.py            # Log parsing & error classification
├── tests/
│   ├── test_agents.py               # Agent tests
│   └── __init__.py
├── requirements.txt                 # Python dependencies
├── .env.example                     # Environment template
├── README.md                        # This file
├── SETUP.md                         # Detailed setup guide
├── START_HERE.md                    # Getting started guide
└── run.sh / run.bat                 # Quick start scripts
```

## 🔧 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | FastAPI (Python) |
| **Server** | Uvicorn (ASGI) |
| **Validation** | Pydantic + Python typing |
| **Job Queue** | Background tasks (async) |
| **AI/LLM** | OpenAI API (gpt-4 or gpt-3.5-turbo) |
| **API Integration** | GitLab REST API |
| **Testing** | pytest |

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup, configuration, and deployment guide
- **[START_HERE.md](START_HERE.md)** - Overview of what's built and what's next
- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference and common tasks
- **Code Comments** - Every major function is documented inline

## 🔐 GitLab Configuration

### 1. Create Personal Access Token

- Navigate to Settings → Access Tokens
- Required Scopes: `api`, `read_api`, `write_repository`
- Copy token to `.env` file as `GITLAB_TOKEN`

### 2. Add Webhook to Project

- Go to Project → Settings → Webhooks
- URL: `https://your-server/webhooks/gitlab`
- Trigger Events: Pipeline events, Merge request events
- Secret Token: Generate a random string, add to `.env` as `GITLAB_WEBHOOK_SECRET`
- Create webhook

### 3. Test the Connection

- Trigger a pipeline failure in your repository
- Check server logs to confirm webhook receipt and agent execution

## 🎬 Demo Script (5 minutes)

### Step 1: Start the Server
```bash
python -m src.main
```

### Step 2: Trigger a Failure
```bash
git push origin test-branch
```
(The branch should have code that fails tests/lint checks)

### Step 3: Monitor Agent Response

Check logs for:
```
INFO:src.agents.pipeline_guardian:Processing pipeline failure
INFO:src.agents.pipeline_guardian:Diagnosis: test_failure - Unit test assertion failed
```

### Step 4: Verify Results

- Refresh GitLab project
- See auto-created branch `fix/test`
- Check MR with diagnosis and fix suggestion
- Commit status updated with results

### Key Talking Points
- ⚡ **Speed:** Agent diagnoses and creates MR in under 2 seconds
- 🎯 **Context:** Full diagnosis included in MR description
- 📈 **Scale:** Works on any pipeline failure type
- 🛡️ **Safety:** Confidence scores and validation checks included

## 🧪 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/api/test/trigger-pipeline-failure` | POST | Trigger demo pipeline failure event |
| `/webhooks/gitlab` | POST | GitLab webhook receiver (auto) |

## 📋 Testing

```bash
# Run unit tests
pytest tests/

# Trigger demo webhook
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure

# Health check
curl http://localhost:8000/health
```

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Invalid signature" error** | Ensure webhook secret is added to `.env` and GitLab webhook settings |
| **Agent not executing** | Verify `GITLAB_TOKEN` is valid, check project permissions, review server logs |
| **MR not created** | Verify target branch exists, check token has `write_repository` scope |
| **Connection timeout** | Ensure server URL is publicly accessible and firewall allows inbound traffic |

## 🚀 Next Steps

- [ ] Extend Compliance Agent with secrets/CVE detection
- [ ] Implement Test Orchestrator for auto test generation
- [ ] Add database logging and dashboard
- [ ] Multi-project support
- [ ] Human approval workflows
- [ ] Metrics tracking (MTTR, acceptance rate, false positives)

## 🤝 Contributing

Fork the repository and submit pull requests. Follow the existing code patterns and add tests for new features.

## 📝 License

Built for hackathons. Use freely for learning and experimentation.

