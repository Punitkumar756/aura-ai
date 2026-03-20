# Aura AI - Setup & Deployment Guide

## Local Development (5 minutes)

### 1. Install Dependencies

```bash
cd d:\My project\aura-ai
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure

```bash
cp .env.example .env
```

Edit `.env`:
```
GITLAB_URL=https://gitlab.com
GITLAB_TOKEN=glpat-XXXXXXXXXXXXX
GITLAB_WEBHOOK_SECRET=your-secret-here
OPENAI_API_KEY=sk-XXXXXXXXXXXXX
```

### 3. Run

```bash
python -m src.main
```

You should see:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 4. Test

In another terminal:
```bash
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure
```

Check logs for:
```
INFO - Handling pipeline failure for project 1
INFO - [PipelineGuardianAgent] Processing pipeline failure
```

---

## GitLab Configuration

### Step 1: Create Personal Access Token

1. Go to GitLab → Settings → Access Tokens
2. Create token with scopes:
   - ✅ `api`
   - ✅ `read_api`
   - ✅ `write_repository`
3. Copy token

### Step 2: Add Webhook to Project

1. Go to your project → Settings → Webhooks
2. Add webhook:
   - **URL:** `https://your-server:8000/webhooks/gitlab`
   - **Secret:** Generate random string (e.g., `openssl rand -hex 32`)
   - **Trigger events:** ✅ Pipeline events, ✅ Merge request events
3. Save

### Step 3: Test Webhook Configuration

Choose from:

**Option A: Trigger Real Pipeline Failure**
```bash
git push origin test-branch
# Then break the pipeline: syntax error, failed test, etc.
```

**Option B: Use Test Endpoint**
```bash
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure
```

Check project for auto-created branch and MR!

---

## Deployment Options

### Option 1: Docker + Cloud Run

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src/ ./src/
CMD ["python", "-m", "src.main"]
```

```bash
# Build and deploy to Cloud Run
docker build -t aura-ai .
docker tag aura-ai gcr.io/YOUR-PROJECT/aura-ai
docker push gcr.io/YOUR-PROJECT/aura-ai

gcloud run deploy aura-ai \
  --image gcr.io/YOUR-PROJECT/aura-ai \
  --set-env-vars GITLAB_TOKEN=xxx,OPENAI_API_KEY=xxx
```

### Option 2: Heroku

```bash
heroku login
heroku create aura-ai
heroku config:set GITLAB_TOKEN=xxx OPENAI_API_KEY=xxx
git push heroku main
```

### Option 3: Self-Hosted (VM/EC2)

```bash
# Ubuntu 22.04
sudo apt update && sudo apt install python3.11 python3.11-venv
cd /opt/aura-ai
python3.11 -m venv venv
venv/bin/pip install -r requirements.txt
nohup venv/bin/python -m src.main &
```

Add systemd service for auto-restart:
```ini
[Unit]
Description=Aura AI
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/aura-ai
ExecStart=/opt/aura-ai/venv/bin/python -m src.main
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

---

## Monitoring & Logging

### View Logs

```bash
# Local
tail -f ~/.aura_ai.log

# Cloud Run
gcloud run logs read aura-ai --limit 50

# Heroku
heroku logs --tail
```

### Agent Status Endpoint

```bash
curl http://localhost:8000/api/agents/status
```

Response:
```json
{
  "agents": [
    {
      "name": "PipelineGuardianAgent",
      "status": "active",
      "events_handled": 5,
      "actions_taken": 5
    }
  ],
  "webhook_endpoint": "/webhooks/gitlab"
}
```

### Health Check

```bash
curl http://localhost:8000/health
```

---

## Extending the System

### Add a New Agent

1. Create file in `src/agents/my_agent.py`

```python
class MyAgent:
    def __init__(self):
        self.name = "MyAgent"
    
    async def handle_event(self, event):
        # Your logic
        return outcome
```

2. Update router in `src/agents/router.py`

```python
async def route_event(event):
    if event["event_type"] == EventType.MY_EVENT:
        return AgentDecision(
            should_act=True,
            target_agent="MyAgent",
        )
```

3. Register in `src/main.py`

```python
from src.agents.my_agent import MyAgent

my_agent = MyAgent()

@app.post("/webhooks/gitlab")
async def gitlab_webhook(request, background_tasks):
    # ... routing ...
    if decision.target_agent == "MyAgent":
        background_tasks.add_task(my_agent.handle_event, event)
```

### Add a New Tool

1. Create in `src/tools/my_tool.py`

```python
class MyTool:
    @staticmethod
    async def execute(input_data):
        # Process
        return result
```

2. Use in agent

```python
from src.tools.my_tool import MyTool

result = await MyTool.execute(data)
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid signature" | Set `GITLAB_WEBHOOK_SECRET` in `.env` and GitLab |
| Agent not running | Check logs: `tail -f ~/.aura_ai.log` |
| MR not created | Verify GitLab token has `write_repository` scope |
| No diagnosis | Check job log isn't empty; add print statements to `DiagnosisLLMTool` |
| Port 8000 in use | `lsof -i :8000` then kill process, or change `PORT` in `.env` |

---

## Quick Wins for Improvement

After MVP works, add:

1. **Dashboard:** Track agent runs & fixes
2. **Database:** Store events for analysis
3. **Real LLM:** Integrate GPT-4 for better diagnosis
4. **Approval Gate:** Require human OK before merge
5. **Metrics:** MTTR, fix acceptance rate, false positives
6. **Slack Alerts:** Notify on major actions
7. **Rate Limiting:** Prevent webhook spam
8. **Multi-Project:** Handle events from multiple projects

---

## For Hackathon Judges

### Quick Demo Script

```bash
# 1. Show server running
python -m src.main

# 2. Trigger test failure
# In another terminal:
curl -X POST http://localhost:8000/api/test/trigger-pipeline-failure

# 3. Check auto-diagnosis
# Show logs: agent processed event

# 4. Real GitLab test:
# - Push commit with syntax error
# - Watch agent create fix branch + MR

# 5. Show impact:
# - Before: developer waits 5 min for pipeline to fail + manually diagnoses
# - After: agent diagnoses in 2 seconds + creates MR with fix suggestion
```

### Key Talking Points

- ✅ **Event-driven:** Reacts in realtime to GitLab events
- ✅ **Action-taking:** Not a chatbot — creates branches, MRs, issues
- ✅ **Scalable:** Router pattern allows unlimited agents
- ✅ **Production-ready:** Logging, error handling, validation
- ✅ **Extensible:** Add agents/tools in minutes

Good luck! 🚀
