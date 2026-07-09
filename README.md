# RetailPilot

RetailPilot is a modern retail web application with an integrated AI Shopping Assistant. This repository contains the backend AI agent scaffolded using Google Agent Development Kit (ADK) 2.0, along with the necessary configuration for development tooling and static web resources.

## Project Architecture

The application is structured as follows:

- **Frontend**: A modern web user interface (to be implemented).
- **Backend (shopping-assistant)**: A FastAPI service built with Google ADK 2.0 that hosts the AI shopping assistant agent.
- **Database**: SQLite is configured for local data persistence and structured query execution.

## Repository Structure

```text
retail-pilot/
│
├── frontend/                  # Web user interface files (HTML/JS/CSS)
│
├── backend/                   # FastAPI backend services
│   └── shopping-assistant/    # Google ADK 2.0 Agent project
│       ├── app/               # Agent application logic (agent, tools, API app)
│       ├── tests/             # Backend test suite
│       ├── pyproject.toml     # Python dependencies and tool configs
│       └── .env.example       # Backend environment template
│
├── docs/                      # Project documentation and specifications
│
├── .gitignore                 # Global repository gitignore
├── README.md                  # This overview and guide
└── LICENSE                    # Apache-2.0 License file
```

## Technology Stack

- **Core Framework**: Python 3.12+
- **Agent Framework**: Google Agent Development Kit (ADK) 2.0
- **Web Server**: FastAPI & Uvicorn
- **Package Manager**: [uv](https://github.com/astral-sh/uv) (high-performance Python packaging tool)
- **Database**: SQLite
- **Static Analysis & Formatting**: Ruff, Codespell
- **Security Scanner**: Semgrep
- **Git Hook Framework**: pre-commit

---

## Local Setup Instructions

### Prerequisites
Ensure you have the following installed on your system:
- Git
- Python 3.12+
- `uv` (Fast and lightweight package manager)
  - Installation instructions: `curl -LsSf https://astral.sh/uv/install.sh | sh` (Unix) or `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"` (Windows)

### 1. Clone and Initialize Repository
```bash
git clone <repository_url> retail-pilot
cd retail-pilot
```

### 2. Create the Virtual Environment & Install Dependencies
Run the following commands inside `backend/shopping-assistant/` to create the virtual environment and install all dependencies:
```bash
cd backend/shopping-assistant/
uv sync
```
This command automatically creates a virtual environment in `.venv/` and installs the production, evaluation, linting, and development dependencies.

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```
Ensure you set your Google Cloud project credentials or Gemini API key.

### 4. Running the Backend locally
You can start the FastAPI application locally by running:
```bash
uv run python app/fast_api_app.py
```
Or use the ADK CLI runner:
```bash
uv run agents-cli playground
```
The FastAPI app will be available at `http://localhost:8000`.

### 5. Running pre-commit hooks
We use `pre-commit` to maintain code quality. The git hooks are already configured. You can manually run them on all files with:
```bash
# Run from repository root
.\backend\shopping-assistant\.venv\Scripts\pre-commit run --all-files
```

### 6. Running Tests
To run unit and integration tests:
```bash
uv run pytest
```
*(Placeholder for tests; custom tests will be added in subsequent phases).*
