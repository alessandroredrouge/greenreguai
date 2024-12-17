"""
Background task scheduler for periodic operations.
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from ..services.supabase import supabase_service
import logging

class BackgroundTaskManager:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        
    def start(self):
        """Start the background task scheduler"""
        # Add document sync job - runs every 5 minutes
        self.scheduler.add_job(
            supabase_service.sync_unprocessed_documents,
            trigger=IntervalTrigger(minutes=5),
            id='document_sync',
            name='Document Sync Job',
            replace_existing=True
        )
        
        # Start the scheduler
        self.scheduler.start()
        logging.info("Background task scheduler started")
        
    def shutdown(self):
        """Shutdown the scheduler"""
        self.scheduler.shutdown()
        logging.info("Background task scheduler shutdown")

# Create singleton instance
background_task_manager = BackgroundTaskManager() 