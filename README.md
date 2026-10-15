# RoadGuard AI — Intelligent Accident Detection & Emergency Response System

AI-powered accident detection system using computer vision and real-time monitoring to identify road accidents, track GPS locations, and coordinate emergency responses for improved road safety.

**RoadGuard AI** is a production-style, end-to-end intelligent road safety platform. It ingests video feeds and dashcam uploads, runs real-time object detection and multi-object trajectory tracking, evaluates temporal collision heuristics, generates reviewable evidence dossiers, and coordinates simulated emergency response workflows with human-in-the-loop verification.

---

## 🌟 Key Highlights & Engineering Features

- **Asynchronous Video Pipeline**: Upload road footage (MP4, AVI, MOV) with background job processing, frame sampling, and real-time progress broadcast over WebSockets.
- **Explainable Multi-Signal Collision Engine**:
  - Bounding box physical overlap (IoU)
  - Acute deceleration spikes ($\Delta v / \Delta t$)
  - Abrupt heading / trajectory deflection angles
  - Post-collision immobilization / stillness
  - Vulnerable Road User (VRU) factor weighting (pedestrians, motorcycles)
  - Missing signals explainability breakdown
- **Human-in-the-Loop Triage**: AI outputs probabilistic candidate scores; operators verify incidents, mark false positives, or record severity overrides with audit logs.
- **Safety Standard Guardrails**:
  - Never fabricates GPS coordinates (cleanly displays *"Location unavailable"* when missing).
  - Operates in simulated emergency response sandbox by default to protect real emergency services.
  - Non-repudiation audit logging for all operator actions.
- **Interactive GIS Map**: Leaflet & OpenStreetMap integration with severity color coding (Red, Amber, Blue) and popup dossiers.
- **Empirical Model Evaluation**: Confusion matrix, Precision, Recall, F1 score, and CSV data export generated from verified database records.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (Node 20 recommended)
- Python 3.11+
- Git

### 1. Launch the Backend API & AI Engine
```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (seeds realistic demo incidents automatically)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- **Backend API**: `http://127.0.0.1:8000`
- **Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/api/health`

### 2. Launch the Frontend Command Center
In a new terminal window at the project root:
```bash
npm install --legacy-peer-deps
npm run dev -- --host 0.0.0.0 --port 5173
```
- **Frontend Dashboard**: `http://localhost:5173/`

### 3. Run Automated Tests
```bash
cd backend
pytest tests -v
```
All 6 test suites covering Health, Auth, Incidents Lifecycle, Temporal Collision AI, Analytics, and CSV Export pass with 100% success.

---

## 🐳 Docker Deployment

To launch all services with Docker Compose:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 🔑 Default Credentials for Demo Mode

- **Operator Account**: `operator@roadguard.ai` / `operator123`
- **Admin Supervisor**: `admin@roadguard.ai` / `admin123`
- *Note: 1-click login buttons are also provided on the login page for instant judge access.*

---

## 📁 Project Directory Structure

```
roadguard-ai/
├── backend/
│   ├── app/
│   │   ├── api/             # REST endpoints (auth, incidents, videos, cameras, analytics, etc.)
│   │   ├── core/            # Config, security, JWT
│   │   ├── database/        # Session, engine, SQLite/PostgreSQL, demo seeder
│   │   ├── models/          # SQLAlchemy ORM models (Incident, Evidence, ResponseAction, etc.)
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/
│   │       ├── ai/          # Object detector, multi-object tracker, temporal collision analyzer
│   │       └── notifications/ # WebSocket dispatcher and alert broadcaster
│   ├── tests/               # Pytest automated test suite
│   ├── uploads/             # Safe video storage
│   ├── evidence/            # Extracted visual HUD snapshots
│   ├── requirements.txt
│   └── Dockerfile
├── src/
│   ├── api/                 # API client
│   ├── components/          # Reusable UI, badges, Leaflet map, Navbar, Sidebar
│   ├── context/             # AuthContext, WebSocketContext
│   ├── pages/               # Dashboard, Monitoring, VideoAnalysis, Detail, Map, Response, Analytics
│   ├── App.jsx              # Routing hierarchy
│   ├── main.jsx             # React entrypoint
│   └── index.css            # Emergency-operations styling
├── docs/
│   ├── demo_guide.md        # 5-minute hackathon demo script
│   └── architecture.md
├── docker-compose.yml
├── .env.example
└── README.md
```
