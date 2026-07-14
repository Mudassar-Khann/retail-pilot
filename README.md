# RetailPilot

![RetailPilot Hero Interface](assets/screenshots/1_hero_dark.png)

RetailPilot is an ultra-premium, modern digital fashion editorial salon and retail web platform. It integrates a deterministic, agentic AI Shopping Assistant powered by the Google Agent Development Kit (ADK) 2.0 and FastAPI with a highly interactive glassmorphic React frontend, complete with an interactive mannequin drape simulator.

Designed for high-end digital shopping, RetailPilot showcases clean typography, rich animations, and structured styling recommendations spanning three curated aesthetics: **Old Money**, **Streetwear**, and **Minimalist Techwear**.

---

## Features

### AI Stylist
An agentic fashion concierge that answers styling questions, designs custom looks, and provides fashion critiques. The stylist operates as an ADK-orchestrated agent that reasons about style and catalog queries.

### Product Discovery
Full catalog search and category filtering of our curated inventory, styled and structured for luxury shopping.

### Outfit Recommendations
Automatically builds complete outfits (Tops, Bottoms, Outerwear, Shoes, and Accessories) matching selected styles, ensuring color harmony and structured fit constraints.

### Fashion Knowledge
Contextual explanations of styles, aesthetics, historical trends, and care instructions, keeping the shopper informed.

### Security
A robust, multi-layered security pipeline including:
* **Input Guardrails**: Prevents prompt injection, jailbreak attempts, system instruction extraction, XSS payloads, SQL injection, and buffer overflow attacks.
* **Planner Validation**: Programmatically validates execution plans and parameter ranges before execution.
* **Tool Permission Boundaries**: Declares intent mapping and required services per tool, blocking unauthorized tool invocation.
* **Output Validation**: Sanitizes and verifies all product IDs, prices, and stock statuses against the source of truth database before rendering to prevent LLM hallucinations.

### Recommendation Engine
A deterministic, rule-based matching engine that filters, ranks, and combines garments based on style tags, sizing, and categories.

### Planner
An automated execution planner that decomposes user query intents (QueryNormalizer → IntentClassifier → QuerySegmenter → ConfidenceScorer → ExecutionPlanner → ExecutionValidator) into structured execution plans.

### Architecture
An asynchronous, service-oriented design decoupling the LLM explanation layer from the core business logic. The LLM acts solely as a natural language synthesizer while inventory, pricing, availability, and routing remain completely deterministic.

### Responsive Design
A mobile-optimized, fluid layout adjusting gracefully across all viewports (from ultra-wide monitors to mobile grids) with native accessibility, focus state support, and high-contrast color choices.

---

## Architecture

```
        ┌────────────────────────────────────────────────────────┐
        │                    Frontend Client                     │
        │                 (React / Next.js / HUD)                │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼ POST /api/chat/stylist
        ┌────────────────────────────────────────────────────────┐
        │                     FastAPI Server                     │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼ (check_query)
        ┌────────────────────────────────────────────────────────┐
        │                    Security Pipeline                   │
        │             (Input Guardrails / Jailbreak)             │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼ (plan)
        ┌────────────────────────────────────────────────────────┐
        │                 Planner & Classifier                   │
        │           (Decomposes query into intents)              │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼ (validate_plan_permissions)
        ┌────────────────────────────────────────────────────────┐
        │                  Capability Registry                   │
        │            (Dependency-Injected Services)              │
        └──────┬───────────────────┬──────────────────────┬──────┘
               │                   │                      │
               ▼                   ▼                      ▼
        ┌──────────────┐    ┌──────────────┐       ┌──────────────┐
        │   Catalog    │    │  Inventory   │       │    Outfit    │
        │   Service    │    │   Service    │       │    Builder   │
        └──────┬───────┘    └──────┬───────┘       └──────┬───────┘
               │                   │                      │
               └─────────────────┐ │ ┌────────────────────┘
                                 ▼ ▼ ▼
        ┌────────────────────────────────────────────────────────┐
        │                       Tool Layer                       │
        │            (Validates and routes requests)             │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼ (run)
        ┌────────────────────────────────────────────────────────┐
        │                    ADK Agent Graph                     │
        │                  (Gemini explanation)                  │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼ (validate_and_sanitize)
        ┌────────────────────────────────────────────────────────┐
        │                   Output Guardrails                    │
        │             ( Hallucination Prevention )               │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼
        ┌────────────────────────────────────────────────────────┐
        │                   Response Composer                    │
        │              (Enriched Stylist JSON)                   │
        └──────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼ 200 OK
        ┌────────────────────────────────────────────────────────┐
        │                    Rendered Bubbles                    │
        └────────────────────────────────────────────────────────┘
```

* **Frontend**: Next.js (App Router), React, TailwindCSS, Lucide icons, and Framer Motion choreographies.
* **Backend**: FastAPI web routing, Python 3.12, Uvicorn ASGI server.
* **Planner**: Python segmenters and classifiers compiling user inputs into deterministic `ExecutionPlan` structures.
* **Services**: SQLite-backed repositories (`shopping_assistant.db`) managing products, inventory, and order status.
* **Security Pipeline**: Regex-based input sanitation combined with static validation chains.
* **ADK Agent**: Google Agent Development Kit 2.0 orchestration runner directing Gemini 2.5 Flash for conversational styling narratives.

---

## Setup & Installation

### Prerequisites
* Git
* Node.js v20+ & npm
* Python 3.12+
* `uv` package manager (recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/retail-pilot.git
cd retail-pilot
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/shopping-assistant
   ```
2. Install Python dependencies and create a virtual environment:
   ```bash
   uv sync
   ```
3. Create your local environment file:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and set your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY=AIzaSy... # Your Google AI Studio Key
   ```
5. Start the FastAPI server:
   ```bash
   uv run python -m app.fast_api_app
   ```
   The backend will start on `http://localhost:8000`.

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

### 4. Running Tests
To run the full suite of unit and integration tests:
```bash
cd backend/shopping-assistant
uv run pytest
```

---

## Technical Stack

* **Frontend**: React 19, Next.js 16 (App Router), TailwindCSS, Framer Motion, Playwright (E2E testing).
* **Backend**: Python 3.12, FastAPI, Uvicorn, SQLite3, Pydantic v2.
* **AI Orchestration**: Google Agent Development Kit (ADK) 2.0, Google GenAI SDK.
* **Linter/Formatter**: ESLint, Biome, Pytest, Black, Flake8.

---

## Repository Structure

```text
retail-pilot/
│
├── assets/
│   └── screenshots/           # Walkthrough screenshots for documentation
│
├── backend/
│   └── shopping-assistant/    # Backend codebase
│       ├── app/               # Agent application logic
│       │   ├── agents/        # Stylist ADK workflow graph definitions
│       │   ├── knowledge/     # Fashion trends domain services
│       │   ├── outfits/       # Outfit combination engine
│       │   ├── planner/       # Intent classification and routing compiler
│       │   ├── products/      # SQLite repository and catalog database
│       │   ├── security/      # Input/Output validation pipelines
│       │   ├── services/      # Injected catalog/memory services
│       │   └── tools/         # Capability registry tool interfaces
│       │
│       ├── tests/             # Pytest unit and e2e suite
│       ├── pyproject.toml     # uv package configuration
│       └── .env.example       # Backend environment template
│
└── frontend/                  # Next.js App Router codebase
    ├── app/                   # App Router views (home and detail)
    ├── components/            # UI, Admin, Catalog, Mannequin components
    ├── design-system/         # Standardized design tokens and animations
    ├── public/                # Static assets (Hero video, catalog images)
    ├── styles/                # Global layout configuration
    └── package.json           # Frontend scripts and modules
```

---

## Security Model

RetailPilot implements a secure styling architecture:
* **Zero-Hallucination Output**: Output guardrails intercept every LLM recommendation and verify all product details (SKU, brand, price, stock) directly against the SQLite database. Halucinated links or out-of-stock items are automatically purged.
* **Deterministic Logic Boundary**: The ADK agent handles natural language synthesis only. Business rules, pricing calculations, item matching, and order status transitions are handled by deterministic backend services.
* **Jailbreak Defusal**: High-priority input filters block role overrides, system instruction extractions, direct tool execution attempts, SQL injections, and XSS scripts at the HTTP gateway level before invoking the agent.
* **Graceful Degradation**: If the external Gemini API is rate-limited or unavailable, the **Safe Fallback Engine** takes over, ensuring catalog searches and outfit recommendations degrade gracefully with custom-formatted local assets.

---

## Screenshots

### Main Interface & Mannequin HUD
The landing page showcases a premium editorial look, featuring the mannequin drape status panel, available garment colors, and recommendation cards.
![Mannequin HUD & Homepage](assets/screenshots/1_hero_dark.png)

### Light Mode UI
Fully responsive, accessibility-audited light mode layout.
![Homepage Light Mode](assets/screenshots/3_showcase_light.png)

### Product Showcase
Scroll-choreographed grids displaying current catalog offerings.
![Product Showcase](assets/screenshots/2_showcase_dark.png)

### Detail Page
Deep detail view of catalog pieces with inventory status and related recommendations.
![Product Detail View](assets/screenshots/4_product_detail.png)

### AI Stylist Greeting
Initial chat salon session greeting prompting for style curation.
![AI Stylist Hello](assets/screenshots/1_hello.png)

### Old Money Aesthetic Inquiry
Detailed fashion trend explanation returned by the styling assistant.
![Old Money Response](assets/screenshots/2_what_is_old_money.png)

### Quiet Luxury Styling Recommendation
Complete outfit curation showing structured tops, bottoms, and outerwear recommendations.
![Quiet Luxury Curation](assets/screenshots/5_quiet_luxury.png)

### Jacket Product Curation
Filtered catalog search for jackets with direct mannequin try-on hooks.
![Jacket Recommendations](assets/screenshots/3_show_me_jackets.png)

### Baggy Jeans Curation (Graceful Fallback)
Deterministic fallback engine output for baggy jeans under Gemini API rate-limits.
![Baggy Jeans Curation](assets/screenshots/4_baggy_jeans.png)

### Prompt Injection Block
Security pipeline refusing a jailbreak attempt and keeping the chat secure.
![Jailbreak Attempt Blocked](assets/screenshots/6_reveal_system_prompt.png)

### Old Money Outfit under $500 Curation
Outfits compiled strictly within a budget constraints check.
![Under $500 Curation](assets/screenshots/7_old_money_under_500.png)

---

## Walkthrough Demo Videos

The repository includes pre-recorded walkthough videos of the entire application.

* **Dark Mode Walkthrough**: Located at `D:\Screen-Recording\RetailPilot-Dark.mp4`.
  Demonstrates smooth scroll, product transitions, styling conversations, mannequin draping, and layout responsiveness.
* **Light Mode Walkthrough**: Located at `D:\Screen-Recording\RetailPilot-Light.mp4`.
  Demonstrates the same comprehensive user flow in light mode.

---

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
