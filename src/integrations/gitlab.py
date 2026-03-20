import gitlab
import httpx
from typing import Optional, List, Dict, Any
from src.config import settings
import logging

logger = logging.getLogger(__name__)


class GitLabIntegration:
    """GitLab API integration for agent actions"""
    
    def __init__(self):
        self.gl = gitlab.Gitlab(settings.gitlab_url, private_token=settings.gitlab_token)
        self.client = httpx.AsyncClient()
    
    def get_project(self, project_id: int):
        """Get project by ID"""
        try:
            return self.gl.projects.get(project_id)
        except Exception as e:
            logger.error(f"Failed to get project {project_id}: {e}")
            return None
    
    def get_pipeline(self, project_id: int, pipeline_id: int):
        """Get pipeline details"""
        try:
            project = self.get_project(project_id)
            return project.pipelines.get(pipeline_id)
        except Exception as e:
            logger.error(f"Failed to get pipeline {pipeline_id}: {e}")
            return None
    
    def get_job_log(self, project_id: int, job_id: int) -> str:
        """Get job log content"""
        try:
            project = self.get_project(project_id)
            job = project.jobs.get(job_id)
            return job.log()
        except Exception as e:
            logger.error(f"Failed to get job log {job_id}: {e}")
            return ""
    
    def create_merge_request(
        self,
        project_id: int,
        source_branch: str,
        target_branch: str,
        title: str,
        description: str
    ) -> Optional[Dict[str, Any]]:
        """Create a merge request"""
        try:
            project = self.get_project(project_id)
            mr = project.mergerequests.create({
                "source_branch": source_branch,
                "target_branch": target_branch,
                "title": title,
                "description": description,
            })
            return {
                "id": mr.id,
                "web_url": mr.web_url,
                "iid": mr.iid,
            }
        except Exception as e:
            logger.error(f"Failed to create MR: {e}")
            return None
    
    def add_mr_comment(self, project_id: int, mr_iid: int, comment: str) -> bool:
        """Add comment to merge request"""
        try:
            project = self.get_project(project_id)
            mr = project.mergerequests.get(mr_iid, lazy=True)
            mr.notes.create({"body": comment})
            return True
        except Exception as e:
            logger.error(f"Failed to add MR comment: {e}")
            return False
    
    def create_issue(
        self,
        project_id: int,
        title: str,
        description: str,
        labels: Optional[List[str]] = None
    ) -> Optional[Dict[str, Any]]:
        """Create an issue"""
        try:
            project = self.get_project(project_id)
            issue = project.issues.create({
                "title": title,
                "description": description,
                "labels": labels or [],
            })
            return {
                "id": issue.id,
                "web_url": issue.web_url,
                "iid": issue.iid,
            }
        except Exception as e:
            logger.error(f"Failed to create issue: {e}")
            return None
    
    def create_commit(
        self,
        project_id: int,
        branch: str,
        message: str,
        actions: List[Dict[str, Any]]
    ) -> Optional[str]:
        """Create a commit with file changes"""
        try:
            project = self.get_project(project_id)
            commit_data = {
                "branch": branch,
                "commit_message": message,
                "actions": actions,
            }
            commit = project.commits.create(commit_data)
            return commit.id
        except Exception as e:
            logger.error(f"Failed to create commit: {e}")
            return None
    
    def create_branch(
        self,
        project_id: int,
        branch_name: str,
        ref: str
    ) -> bool:
        """Create a new branch"""
        try:
            project = self.get_project(project_id)
            project.branches.create({
                "branch": branch_name,
                "ref": ref,
            })
            return True
        except Exception as e:
            logger.error(f"Failed to create branch: {e}")
            return False
    
    def update_pipeline_status(
        self,
        project_id: int,
        commit_sha: str,
        status: str,
        description: str,
        context: str = "aura-ai/agent"
    ) -> bool:
        """Update commit status/check"""
        try:
            project = self.get_project(project_id)
            project.statuses.create({
                "sha": commit_sha,
                "state": status,
                "description": description,
                "context": context,
            })
            return True
        except Exception as e:
            logger.error(f"Failed to update status: {e}")
            return False
