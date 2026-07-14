from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import time
import logging

logger = logging.getLogger("retail_pilot.observability")

class ObservabilityMiddleware(BaseHTTPMiddleware):
    """
    Lightweight observability layer for logging, timing, and diagnostics.
    Useful for inspecting AI response times, recommendation latency, and API performance.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        # Log incoming request
        logger.info(f"--> [{request.method}] {request.url.path}")

        response = await call_next(request)

        process_time_ms = (time.time() - start_time) * 1000

        # Log response and execution time
        logger.info(f"<-- [{request.method}] {request.url.path} - {response.status_code} ({process_time_ms:.2f}ms)")

        # Append server-timing header for Chrome DevTools / frontend diagnostics
        response.headers["Server-Timing"] = f"total;dur={process_time_ms:.2f}"

        return response
