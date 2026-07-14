import os
import logging
from pathlib import Path

class SecurityLogger:
    _security_logger = None
    _app_logger = None
    _user_logger = None

    @classmethod
    def setup_loggers(cls):
        log_dir = Path(__file__).parent.parent.parent.resolve() / "logs"
        log_dir.mkdir(exist_ok=True)

        # 1. Security Event Logger
        sec_handler = logging.FileHandler(log_dir / "security.log", encoding="utf-8")
        sec_handler.setFormatter(logging.Formatter('%(asctime)s [%(levelname)s] %(message)s'))
        cls._security_logger = logging.getLogger("security")
        cls._security_logger.setLevel(logging.INFO)
        cls._security_logger.addHandler(sec_handler)

        # 2. Application Logic Logger
        app_handler = logging.FileHandler(log_dir / "application.log", encoding="utf-8")
        app_handler.setFormatter(logging.Formatter('%(asctime)s [%(levelname)s] %(message)s'))
        cls._app_logger = logging.getLogger("application")
        cls._app_logger.setLevel(logging.INFO)
        cls._app_logger.addHandler(app_handler)

        # 3. User Activity Logger (scrubbed of personal info)
        user_handler = logging.FileHandler(log_dir / "user_activity.log", encoding="utf-8")
        user_handler.setFormatter(logging.Formatter('%(asctime)s %(message)s'))
        cls._user_logger = logging.getLogger("user")
        cls._user_logger.setLevel(logging.INFO)
        cls._user_logger.addHandler(user_handler)

    @classmethod
    def log_security_event(cls, severity: str, message: str):
        if not cls._security_logger:
            cls.setup_loggers()
        if severity.lower() == "warning":
            cls._security_logger.warning(message)
        elif severity.lower() == "error":
            cls._security_logger.error(message)
        else:
            cls._security_logger.info(message)

    @classmethod
    def log_app_event(cls, severity: str, message: str):
        if not cls._app_logger:
            cls.setup_loggers()
        if severity.lower() == "error":
            cls._app_logger.error(message)
        else:
            cls._app_logger.info(message)

    @classmethod
    def log_user_activity(cls, session_id: str, action: str):
        if not cls._user_logger:
            cls.setup_loggers()
        cls._user_logger.info(f"Session: {session_id} | Action: {action}")
