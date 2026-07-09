# RetailPilot

RetailPilot is a modern retail web application with an integrated AI Shopping Assistant. This repository contains the backend AI agent built using Google Agent Development Kit (ADK) 2.0 and FastAPI, along with a self-seeding SQLite product catalog.

## Project Architecture

The application is structured as follows:

- **Frontend**: A modern fashion web user interface (planned).
- **Backend (shopping-assistant)**: A FastAPI service built with Google ADK 2.0 that hosts the AI shopping assistant agent.
- **Product Catalog Domain**: A modular SQLite-backed data layer containing the fashion database, product search business service, and AI tools.
- **Database**: SQLite is used for local data persistence and structured query execution.

```text
Google ADK Agent
        │
        ▼
AI Tool (app/tools/product_search.py)
        │
        ▼
Product Service (app/products/service.py)
        │
        ▼
SQLite Repository (app/products/repository.py)
        │
        ▼
Products Database (shopping_assistant.db)
```

## Repository Structure

```text
retail-pilot/
│
├── frontend/                  # Web user interface files (HTML/JS/CSS)
│
├── backend/                   # FastAPI backend services
│   └── shopping-assistant/    # Google ADK 2.0 Agent project
│       ├── app/               # Agent application logic
│       │   ├── config.py      # Centralized environment-based settings
│       │   ├── agent.py       # Root agent and model definitions
│       │   ├── products/      # Product catalog domain (models, repo, service, seed)
│       │   └── tools/         # Modular AI tools (product_search.py)
│       │
│       ├── tests/             # Backend test suite
│       ├── pyproject.toml     # Python dependencies and tool configs
│       ├── .env.example       # Environment template
│       └── .env               # Local configuration file (git-ignored)
│
├── docs/                      # Project documentation and specifications
│
├── .gitignore                 # Global repository gitignore
├── README.md                  # This overview and guide
└── LICENSE                    # Apache-2.0 License file
```

---

## Local Development Setup

### Prerequisites
Ensure you have the following installed on your system:
- Git
- Python 3.12+
- `uv` (High-performance Python package manager)
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
This command automatically creates a virtual environment in `.venv/` and installs all dependencies.

### 3. Configure Local Settings
A local `.env` file is generated inside the `backend/shopping-assistant/` directory.

1. Open `backend/shopping-assistant/.env` in your editor.
2. Locate the `GEMINI_API_KEY` setting:
   ```env
   GEMINI_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY
   ```
3. Replace `YOUR_GOOGLE_AI_STUDIO_API_KEY` with a valid Google AI Studio API key. (You can obtain a key from [Google AI Studio](https://aistudio.google.com/)).

*Note: `.env` contains local secrets and is configured in `.gitignore` to never be committed to Git. `.env.example` serves as the template.*

### 4. Running the Backend
When the application starts for the first time, the `ProductRepository` will automatically create the SQLite database schema and seed it with 30+ realistic clothing products representing multiple aesthetics (Old Money, Streetwear, Minimalist, Korean Fashion, Techwear).

Start the FastAPI application:
```bash
uv run python app/fast_api_app.py
```
The FastAPI app will be available at `http://localhost:8000`.

### 5. Running the ADK Playground
To interact with the AI assistant through a graphical web interface:
```bash
uv run agents-cli playground
```

### 6. Running pre-commit hooks
We use `pre-commit` to maintain code quality. To manually run the hooks on all files:
```bash
# Run from repository root
.\backend\shopping-assistant\.venv\Scripts\pre-commit run --all-files
```

### 7. Running Tests
To run unit and integration tests:
```bash
uv run pytest
```
