# RetailPilot Brand & Design Manifesto

> *“Fashion is the statement. Technology is the quiet medium.”*

RetailPilot is not an administrative tool, a generic ecommerce store, or a ChatGPT wrapper. It is a luxury digital fashion platform enhanced by quiet, intelligent styling.

This document defines the core product philosophy, visual principles, and emotional goals that govern the RetailPilot user experience. It explains **why** we make visual choices.

---

## 1. Product Philosophy

Technology should elevate the clothing, not overshadow it. Our product exists to:
- Inspire curated exploration.
- Minimize transactional friction in favor of aesthetic discovery.
- Frame garments as physical pieces of art rather than rows of grid tiles.

---

## 2. Brand Philosophy

RetailPilot stands at the intersection of luxury fashion and precise engineering. Our brand identity is built on:
- **Quiet Luxury**: Subtle details, high-end typography, and premium borders instead of loud colors and badges.
- **Intelligent Restraint**: Only display what is necessary. Avoid unnecessary features, redundant cards, and loud animations.
- **Curated Confidence**: We do not sell items; we curate style aesthetics.

---

## 3. Emotional Design Principles

Every screen, hover state, and text node should evoke these specific user emotions:
- **Calm**: A sanctuary from the loud, discount-heavy aesthetics of traditional ecommerce.
- **Inspiration**: Spurred by beautiful, spacious imagery and typography pairings.
- **Confidence**: Guided by clear, elegant personal stylist recommendations.

---

## 4. Experience Principles

- **Discovery Over Exhaustion**: The homepage is an exhibit, not a warehouse. We prioritize *curated discovery before exhaustive browsing*. The full catalog is accessed deliberately, never dumped at the entrance.
- **Tactile Materiality**: Borders feel fine and intentional. Transitions are smooth and physical. Surfaces have quiet weight.
- **Cohesion**: A single unified design voice from the first landing fold to the styling viewport controls.

---

## 5. Motion Philosophy

Motion should convey confidence and physical weight.
- **Rhythm**: Animations should feel deliberate and smooth, mimicking the motion of premium hardware and luxury editorial reveals.
- **Easing**: We utilize a custom luxury bezier easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`) for all interface transitions.
- **Restraint**: If an animation does not serve to guide focus or simulate garment layering, it is removed. We reject constant pulsing, sliding loops, and bounce curves.

---

## 6. Whitespace Philosophy

Whitespace is a first-class design material, not empty space.
- **Breathing Room**: Generous padding allows the user's eye to rest on the typography and clothing forms.
- **Visual Cadence**: We establish an intentional rhythm of breathing room, utilizing whitespace to isolate and frame editorial content sections.

---

## 7. AI Philosophy

Artificial Intelligence is the invisible stylist.
- **The Invisible Hand**: The AI does not present itself as a chatbot widget or a glowing neon brain icon. It is integrated seamlessly as a **Personal Stylist** that communicates in plain, refined fashion copy.
- **Aesthetic Context**: The AI suggests cohesive looks, scores outfit compatibility, and organizes catalog items by aesthetic principles rather than keyword algorithms.

---

## 8. Fashion Philosophy

We respect the garments.
- **Aesthetics First**: Clothes are categorized and filtered by styles (*Old Money, Streetwear, Korean Fashion, Minimalist, Techwear*) to match the customer's personal aesthetic statement.
- **Garment Weight**: Visual presentations (like the Virtual Model) showcase clothing layers in relation to each other, respecting fabric drapes, lengths, and fits.

---

## 9. Architectural Governance & State Hand-off

This section documents the engineering architecture powering the RetailPilot platform.

### 9.1 Multi-Layer Absolute Coordinate Layout System

The Virtual Model (`VirtualModel.tsx`) uses a stacked absolute-positioning system within an `aspect-[9/16]` container. Each garment occupies a distinct z-index layer:

| Layer | Z-Index | Content | CSS Class |
| :--- | :---: | :--- | :--- |
| Background Accent | `z-0` | `neon_accent.png` asymmetric neon stripe | `mix-blend-screen opacity-20` |
| Base Mannequin | `z-0` | `male_base.png` / `female_base.png` | `object-cover opacity-80` |
| Bottoms | `z-10` | SVG garment path (Jeans, Cargo, Chinos) | `will-change-transform` |
| Shoes | `z-15` | SVG shoe pair paths | `will-change-transform` |
| Tops | `z-20` | SVG top garment path (Shirts, T-Shirts) | `will-change-transform` |
| Outerwear | `z-25` | SVG outer jacket/hoodie path | `will-change-transform` |
| Calibration Overlay | `z-30` | `mesh_flow.png` diagnostic HUD | `animate-pulse pointer-events-none` |
| UI Controls | `z-40` | Gender toggle buttons, telemetry text | Interactive layer |

Each garment's position is driven by `overlay_top_percent`, `overlay_left_percent`, and `overlay_width_percent` stored per-product in the SQLite database. Framer Motion spring transitions (`stiffness: 220, damping: 22, mass: 0.9`) animate garment additions and removals.

### 9.2 ADK 2.0 Graph Routing Architecture

The backend uses Google ADK 2.0 for multi-agent orchestration. The routing graph is defined in `stylist_workflow.py`:

```
┌─────────────────────────────────────────────────────────┐
│                    Node A: analyze_query                │
│  Parses user input to classify intent:                  │
│  • Fashion/styling keywords → StylistAgent              │
│  • Order/return/refund keywords → OrderSupportAgent     │
└───────────────┬────────────────────────┬────────────────┘
                │                        │
                ▼                        ▼
    ┌───────────────────┐    ┌──────────────────────────┐
    │   StylistAgent    │    │   OrderSupportAgent      │
    │                   │    │                          │
    │  • Aesthetic      │    │  • query_order_status()  │
    │    advice         │    │  • flag_order_return()   │
    │  • Outfit         │    │  • SQLite order lookups  │
    │    pairing        │    │  • Return ticket         │
    │  • Drape coords   │    │    generation            │
    └───────────────────┘    └──────────────────────────┘
```

A robust local fallback parser is also implemented in `fast_api_app.py` to handle Gemini API outages gracefully. If the ADK runner throws any exception, the fallback regex parser can still process return/refund requests and update order statuses.

### 9.3 Human-In-The-Loop (HITL) State Suspend Parameters

The HITL system governs the order return lifecycle with explicit state transitions:

| State | Value | Trigger | Effect |
| :--- | :--- | :--- | :--- |
| **Purchased** | `purchased` | Checkout completion | Default post-purchase state |
| **Awaiting Approval** | `awaiting_return_approval` | Customer return request via chat | Chat input disabled; monospaced indicator rendered: `[ STATE: SUSPENDED // AWAITING STAFF APPROVAL ]` |
| **Returned** | `returned` | Staff approval on Curation Desk | Chat re-enabled; refund confirmation displayed |
| **Rejected** | `purchased` (reset) | Staff rejection on Curation Desk | Chat re-enabled; order reverts to purchased |

**State Lock Mechanics**:
- When `order_status === 'awaiting_return_approval'`, the `StylistChat` component polls the backend every 3 seconds.
- The chat input field is disabled and replaced with the diagnostic status indicator.
- Upon status change (approval or rejection), the poller detects the new status and re-enables the chat interface.

**Curation Desk** (`CurationDesk.tsx`):
- Staff-only dashboard accessible via the utility top bar route switcher.
- Displays all pending return requests in a monospaced ledger table.
- Provides `APPROVE` and `REJECT` action buttons that call `POST /api/orders/{id}/approve-return` and `POST /api/orders/{id}/reject-return` respectively.

### 9.4 Security Governance

| Layer | Control | Implementation |
| :--- | :--- | :--- |
| **SQL Injection** | Parameterized queries | All SQLite operations use `?` placeholder binding in `repository.py` |
| **Input Validation** | Pydantic `Field` validators | `total_price: Field(gt=0)`, `order_status` validated against `OrderStatusEnum`, IDs use `ge=1` |
| **Error Sanitization** | Global exception handler | `@app.exception_handler(Exception)` returns sanitized JSON; no stack traces leak to clients |
| **HTTP Status Codes** | Proper REST semantics | `404` for missing orders, `400` for invalid state transitions, `422` for validation failures, `500` for unhandled errors |

---

## 10. Asset Transparency & Product Image Specifications

To maintain the high-end virtual try-on experience and ensure perfect alignment of garments on the light mannequin body, all uploaded clothing assets must conform to the following asset guidelines:

### 10.1 File Path Registry
All product transparent overlays are loaded by ID and must be saved exactly at:
- `frontend/public/images/products/[productId].png` (e.g., `2001.png` through `2009.png`).

### 10.2 Image Requirements & Transparency
- **Format**: 32-bit PNG (`RGBA`) with a true alpha channel (transparent background).
- **Background**: Complete background erasure is mandatory. There must be no white halo pixels, color fringes, or outer borders.
- **Cropping & Spacing**: Crop images tight to the outer edges of the garment to ensure that the relative coordinate percentages (`overlay_top_percent`, `overlay_left_percent`, `overlay_width_percent`) map accurately without invisible whitespace padding.
- **Lighting & Contrast**: Align contrast to match the muted light environment of the base mannequins. Avoid harsh directional shadows or overexposure.

### 10.3 Fallback Mechanism
If a product image asset does not exist at `/images/products/[productId].png`, the frontend image rendering engine automatically triggers an `onError` event, seamlessly falling back to thin wireframe vector silhouettes to prevent broken UI layouts.


