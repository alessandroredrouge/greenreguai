from fastapi import Request, HTTPException
from datetime import datetime, timedelta
from collections import defaultdict
import time
from src.core.config import settings

class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)  # {user_id: [timestamp1, timestamp2, ...]}
        
    def _clean_old_requests(self, user_id: str):
        """Remove requests older than 1 minute"""
        now = time.time()
        minute_ago = now - 60
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id] 
            if req_time > minute_ago
        ]
    
    async def check_rate_limit(self, request: Request):
        # Get user ID from auth header or IP for unauthenticated requests
        user_id = request.headers.get("Authorization", request.client.host)
        
        # Clean old requests
        self._clean_old_requests(user_id)
        
        # Check number of requests in the last minute
        if len(self.requests[user_id]) >= settings.RATE_LIMIT_PER_MINUTE:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again in a minute."
            )
        
        # Add current request
        self.requests[user_id].append(time.time())
        
        return True

rate_limiter = RateLimiter() 