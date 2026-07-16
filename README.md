# ML Experiment Tracker

A production-quality full-stack SaaS application to manage, track, and compare machine learning experiments. It functions as a lightweight alternative to MLflow or Weights & Biases.

## Features

- **Dashboard**: High-level analytics and visualizations (Recharts) summarizing your experiments.
- **Experiment Tracking**: Create, read, update, and delete experiments with dynamically adjustable metrics, parameters, and tags.
- **Search & Filter**: Server-side instant searching and filtering using TanStack Query.
- **Advanced Data Table**: Highly interactive experiments table built with TanStack Table.
- **Compare Experiments**: Side-by-side metric comparison to identify the best performing models.
- **Modern UI**: Polished, responsive, dark-mode ready interface built with Tailwind CSS and shadcn/ui.
- **Robust API**: RESTful backend built with FastAPI, Pydantic, and SQLAlchemy.

## Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, TanStack Query, Recharts.
- **Backend**: FastAPI, SQLAlchemy, Alembic, PostgreSQL (Supabase), Pydantic.
- **Infrastructure**: Docker & Docker Compose.

```
Router -> Service -> Repository -> Database
```

## Folder Structure

```
ml-experiment-tracker/
├── frontend/             # Next.js Application
│   ├── src/
│   │   ├── app/          # Next.js Pages & Routing
│   │   ├── components/   # UI & Shared Components
│   │   ├── hooks/        # Custom React Hooks
│   │   ├── lib/          # Utilities & Axios Config
│   │   └── services/     # API Service Layer
│   └── Dockerfile
├── backend/              # FastAPI Application
│   ├── app/
│   │   ├── models/       # SQLAlchemy Domain Models
│   │   ├── repositories/ # Database Access Layer
│   │   ├── routers/      # API Endpoints
│   │   ├── schemas.py    # Pydantic Schemas
│   │   ├── services/     # Business Logic Layer
│   │   ├── config.py     # Environment Settings
│   │   └── main.py       # FastAPI Entrypoint
│   ├── alembic/          # Database Migrations
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Database Schema

- `experiments`: Core entity.
- `metrics`: One-to-many with experiments.
- `parameters`: One-to-many with experiments.
- `notes`: One-to-one with experiments (Markdown support).
- `tags` / `experiment_tag`: Many-to-many relationship.

## Installation & Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker (optional, for containerized run)
- A Supabase PostgreSQL database URL.

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
```

Run database migrations:
```bash
alembic upgrade head
```

Start the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:3000`.

## Docker Setup

You can run the entire stack using Docker Compose:

```bash
docker compose up --build
```
*Note: Ensure `DATABASE_URL` is set in your environment or passed to docker-compose.*

## Future Improvements

- User authentication & authorization.
- Real-time logging via WebSockets.
- Artifact (file/model weight) uploading to cloud storage.
