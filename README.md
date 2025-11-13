# StaffAlloc: AI-Powered Staffing Management Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **AI-Driven Software Engineering Capstone Project**  
> Team: AINavigators  
> Course ID: 220372-AG-AISOFTDEV-Team-1

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Development Workflow](#development-workflow)
- [AI Integration](#ai-integration)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Support](#support)

> **📝 Note:** For a complete list of all fixes, improvements, and changes, see [CHANGELOG.md](CHANGELOG.md)

---

## 🎯 Overview

**StaffAlloc** is an intelligent, AI-powered staffing management application designed to replace cumbersome and error-prone spreadsheets. It provides project managers with a centralized platform to create projects, allocate employee hours, track budgets, and optimize resource utilization across their teams.

### 🔒 Manager-Specific Data Isolation

StaffAlloc enforces **strict data isolation** where each manager (PM) has their own isolated workspace:
- ✅ Managers see **only their own projects**
- ✅ Managers see **only their own employees**
- ✅ Managers create **their own roles and LCATs**
- ✅ **Complete data privacy** between different managers

### Purpose

StaffAlloc solves critical business challenges in manual resource planning by:
- **Automating calculations** for FTE (Full-Time Equivalent) and resource allocation
- **Providing real-time validation** to prevent over-allocation and budget overruns
- **Offering AI-driven insights** for optimal staffing recommendations
- **Enabling data-driven decisions** through comprehensive dashboards and reports

### Vision

Transform resource management from a reactive, administrative chore into a proactive, strategic function, becoming the single source of truth for "who is working on what, when, and for how long."

---

## ✨ Features

### Core Functionality

- **📊 Interactive Allocation Grid**: Spreadsheet-like interface for managing employee hours across projects
- **👥 Employee Management**: Centralized employee database with role and LCAT (Labor Category) assignments
- **📈 Project Planning**: Create and manage projects with sprint-based timelines
- **⚠️ Real-time Validation**: Automatic detection of over-allocations and budget overruns
- **🎨 Visual Heatmaps**: Color-coded FTE visualization for at-a-glance utilization insights

### Advanced Features

- **🤖 AI-Powered Recommendations**: Intelligent staffing suggestions based on availability and skills
- **📊 Manager Dashboard**: Manager-specific allocation rollup grid with date range selector
- **📅 Timeline Views**: Sprint-based and monthly allocation timelines
- **📑 Comprehensive Reports**: Export capabilities and executive summaries
- **🔍 Employee Timeline**: Cross-project view of individual resource commitments
- **💬 Project-Scoped AI Chat**: Ask availability questions directly on project pages

### AI Capabilities (V1.3+)

- **💬 RAG Chat Interface**: Natural language queries about staffing and allocations (manager-scoped)
- **🎯 Auto-Running Conflict Monitor**: Automatically detects over-allocations on page load
- **🔧 AI Conflict Resolution**: Automatically suggests solutions when conflicts are detected
- **📈 Predictive Forecasting**: Future hiring needs based on project pipeline
- **⚖️ Workload Balancing**: Recommendations to prevent burnout and optimize efficiency
- **🔍 Availability Search**: "Who is free to work 200 hours from Mar-Oct 2026?" queries

---

## 🏗️ Architecture

StaffAlloc follows a modern three-tier architecture:

```
┌─────────────────────────────────────────────────┐
│            Frontend (React + Vite)              │
│   - TypeScript, TailwindCSS, React Router      │
│   - Real-time updates, Interactive grids       │
└─────────────────┬───────────────────────────────┘
                  │ REST API
┌─────────────────▼───────────────────────────────┐
│          Backend (FastAPI + Python)             │
│   - RESTful API, Pydantic validation           │
│   - Business logic, RBAC, Authentication        │
└─────────────────┬───────────────────────────────┘
                  │ SQLAlchemy ORM
┌─────────────────▼───────────────────────────────┐
│          Database (SQLite / PostgreSQL)         │
│   - Relational data model                       │
│   - Projects, Employees, Allocations            │
└─────────────────────────────────────────────────┘
```

### Key Design Principles

- **Local-First Development**: Fully functional on a single developer machine
- **API-Driven**: Clear separation between frontend and backend
- **Cloud-Ready**: Designed with a migration path to production cloud infrastructure
- **Modular**: Pluggable AI adapters and integration points

For detailed architecture information, see [`Artifacts/Documentation/architecture.md`](Artifacts/Documentation/architecture.md).

---

## 🛠️ Technology Stack

### Backend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Python** | Core language | 3.10+ |
| **FastAPI** | Web framework | 0.109+ |
| **SQLAlchemy** | ORM | 2.0+ |
| **Pydantic** | Data validation | 2.0+ |
| **SQLite** | Database (dev) | 3.x |
| **Uvicorn** | ASGI server | 0.27+ |
| **Pytest** | Testing framework | 7.4+ |

### Frontend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework | 18.2 |
| **TypeScript** | Type safety | 5.3 |
| **Vite** | Build tool | 5.0 |
| **TailwindCSS** | Styling | 3.4 |
| **React Router** | Navigation | 6.21 |
| **React Hook Form** | Form management | 7.49 |
| **TanStack Query** | Data fetching | 5.17 |

### AI & ML

- **Anthropic Claude**: Claude 3.5 Sonnet for RAG features
- **Sentence Transformers**: Text embeddings (all-MiniLM-L6-v2)
- **ChromaDB**: Vector database for RAG (optional)
- **Ollama** or **LM Studio**: Local LLM inference (optional)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10 or higher** ([Download](https://www.python.org/downloads/))
- **Node.js 18.x or newer** ([Download](https://nodejs.org/))
- **npm 9.x or newer** (bundled with Node.js)
- **Git** ([Download](https://git-scm.com/downloads))
- **SQLite 3** (usually pre-installed on most systems)

### Verify Installations

```bash
# Check Python version
python --version  # or python3 --version

# Check Node.js and npm
node -v
npm -v

# Check SQLite
sqlite3 --version
```

---

### Quick Start

Follow these steps to get StaffAlloc running on your local machine:

#### 1. Clone the Repository

```bash
git clone https://github.com/your-org/220372-AG-AISOFTDEV-Team-1-AINavigators.git
cd 220372-AG-AISOFTDEV-Team-1-AINavigators
```

#### 2. Set Up the Backend

```bash
# Navigate to backend directory
cd Artifacts/backend

# Create and activate virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings python-jose[cryptography] passlib[bcrypt] structlog httpx ujson

# Create data directory
mkdir -p data

# Initialize database
python -c "from app.db.session import create_db_and_tables; create_db_and_tables()"

# Load seed data with multiple managers (recommended)
python seed_multiple_managers.py

# OR run migration on existing database
python migrate_remove_director.py

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

#### 3. Set Up the Frontend

Open a **new terminal window** (keep the backend running):

```bash
# Navigate to frontend directory (from project root)
cd reactapp

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/health

#### 5. Login with Test Credentials

After running `seed_multiple_managers.py`:

**Manager Accounts:**
- Email: `sarah.martinez@staffalloc.com` / Password: `manager123`
- Email: `james.wilson@staffalloc.com` / Password: `manager123`
- Email: `aisha.patel@staffalloc.com` / Password: `manager123`

**Admin Account:**
- Email: `admin@staffalloc.com` / Password: `admin123`

Each manager has their own isolated workspace with projects, employees, roles, and LCATs.

---

### Backend Setup

For detailed backend setup instructions, see [`Artifacts/backend/QUICKSTART.md`](Artifacts/backend/QUICKSTART.md).

**Quick Commands:**

```bash
cd Artifacts/backend

# Install all dependencies from requirements.txt
pip install -r ../../requirements.txt

# Or install core dependencies only
pip install fastapi uvicorn sqlalchemy pydantic

# Initialize database
python -c "from app.db.session import create_db_and_tables; create_db_and_tables()"

# Run server
uvicorn app.main:app --reload --port 8000
```

**Environment Configuration:**

Create a `.env` file in `Artifacts/backend/` (optional):

```bash
# Database
DATABASE_URL=sqlite:///./data/staffalloc.db

# API Configuration
API_V1_PREFIX=/api/v1
SECRET_KEY=your-secret-key-here
DEBUG=True

# Anthropic Claude API (required for AI features)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Note:** For detailed AI setup instructions, see [ANTHROPIC_SETUP.md](ANTHROPIC_SETUP.md)

---

### Frontend Setup

For detailed frontend setup instructions, see [`reactapp/README.md`](reactapp/README.md).

**Quick Commands:**

```bash
cd reactapp

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

**Environment Configuration:**

Create a `.env` file in `reactapp/` (optional):

```bash
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
220372-AG-AISOFTDEV-Team-1-AINavigators/
│
├── Artifacts/                          # Project artifacts and deliverables
│   ├── Architecture/                   # Architecture diagrams (PlantUML)
│   ├── backend/                        # FastAPI backend application
│   │   ├── app/
│   │   │   ├── api/                    # API routers (projects, employees, etc.)
│   │   │   ├── core/                   # Core utilities (config, security)
│   │   │   ├── db/                     # Database session management
│   │   │   ├── main.py                 # FastAPI app entry point
│   │   │   ├── models.py               # SQLAlchemy ORM models
│   │   │   ├── schemas.py              # Pydantic schemas
│   │   │   └── crud.py                 # Database operations
│   │   ├── data/                       # SQLite database and reports
│   │   ├── tests/                      # Backend tests
│   │   ├── QUICKSTART.md               # Backend setup guide
│   │   ├── BACKEND_REVIEW.md           # Code review and audit
│   │   └── FIXES_APPLIED.md            # Security and bug fixes
│   ├── Documentation/                  # Project documentation
│   │   ├── prd.md                      # Product Requirements Document
│   │   ├── architecture.md             # Architecture documentation
│   │   ├── adrs.md                     # Architecture Decision Records
│   │   ├── testing_report.md           # QA and testing report
│   │   └── user_stories.json           # User stories and acceptance criteria
│   ├── Frontend/                       # Frontend component artifacts
│   │   ├── *_refactored.jsx/tsx        # Refactored React components
│   │   └── *_monolithic.jsx/tsx        # Original AI-generated components
│   ├── schema.sql                      # Database schema with seed data
│   └── screens/                        # UI mockups and screenshots
│
├── reactapp/                           # React + Vite frontend
│   ├── src/
│   │   ├── api/                        # API client functions
│   │   ├── components/                 # React components
│   │   │   ├── layout/                 # Layout components
│   │   │   └── projects/               # Project-related components
│   │   ├── pages/                      # Page components (routes)
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── types/                      # TypeScript type definitions
│   │   ├── utils/                      # Utility functions
│   │   ├── styles/                     # Global styles
│   │   ├── App.tsx                     # Main app component
│   │   └── main.tsx                    # Entry point
│   ├── package.json                    # Frontend dependencies
│   ├── vite.config.ts                  # Vite configuration
│   ├── tailwind.config.ts              # Tailwind CSS configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   └── README.md                       # Frontend documentation
│
├── Python Notebooks/                   # Jupyter notebooks for AI workflows
│   ├── Capstone_Phase1_Requirements_and_PRD.ipynb
│   ├── Capstone_Phase2_Architecture_and_Data.ipynb
│   ├── Capstone_Phase3_Backend_Development.ipynb
│   ├── Capstone_Phase4_Testing_and_Security.ipynb
│   └── Capstone_Phase5_Frontend.ipynb
│
├── tests/                              # Integration and E2E tests
│   ├── test_api_happy_path.py          # Happy path tests
│   ├── test_edge_cases.py              # Edge case tests
│   ├── test_security.py                # Security tests
│   └── TESTING_SECURITY_OVERVIEW.md    # Testing documentation
│
├── utils/                              # Shared utilities and helpers
│   ├── llm.py                          # LLM integration utilities
│   ├── providers/                      # LLM provider adapters
│   └── artifacts.py                    # Artifact generation helpers
│
├── requirements.txt                    # Python dependencies
├── instructor_readme.md                # Capstone project instructions
├── INTEGRATION_GUIDE.md                # Integration documentation
└── README.md                           # This file
```

---

## 📚 API Documentation

Once the backend is running, interactive API documentation is available at:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Key Endpoints

**⚠️ Important**: All endpoints require manager context for data isolation.

#### Projects (`/api/v1/projects`)
- `POST /` - Create a new project
- `GET /?manager_id={id}` - List manager's projects (**required parameter**)
- `GET /{id}` - Get project details with allocations
- `PUT /{id}` - Update project
- `DELETE /{id}` - Delete project

#### Employees (`/api/v1/employees`)
- `POST /` - Create employee (automatically assigned to manager)
- `GET /?manager_id={id}` - List manager's employees (**required parameter**)
- `GET /{id}` - Get employee with assignments
- `PUT /{id}` - Update employee
- `DELETE /{id}` - Delete employee

#### Allocations (`/api/v1/allocations`)
- `POST /assignments` - Assign employee to project
- `POST /` - Create allocation (monthly hours)
- `PUT /{id}` - Update allocation
- `DELETE /{id}` - Delete allocation
- `GET /users/{id}/summary` - Get user's FTE summary

#### Reports (`/api/v1/reports`)
- `GET /portfolio-dashboard` - Organization-wide dashboard
- `GET /project-dashboard/{id}` - Project-specific metrics
- `GET /employee-timeline/{id}` - Employee allocation timeline

#### Admin (`/api/v1/admin`)
- `POST /roles/` - Create role (scoped to manager)
- `GET /roles/?owner_id={id}` - List manager's roles (**required parameter**)
- `POST /lcats/` - Create LCAT (scoped to manager)
- `GET /lcats/?owner_id={id}` - List manager's LCATs (**required parameter**)

#### AI (`/api/v1/ai`)
- `POST /chat` - Chat with AI assistant (requires `manager_id`)
- `POST /recommend-staff` - Get staffing recommendations (requires `manager_id`)
- `GET /conflicts` - Detect allocation conflicts (manager-scoped)
- `GET /forecast` - Generate capacity forecast (manager-scoped)
- `GET /balance-suggestions` - Get workload balancing tips (manager-scoped)

#### New: Manager Allocations
- `GET /reports/manager-allocations` - Dashboard rollup grid
  - Required: `manager_id`, `start_year`, `start_month`, `end_year`, `end_month`
  - Returns: All employees with monthly allocation totals across all projects

---

## 🧪 Testing

### Backend Tests

StaffAlloc includes a comprehensive test suite covering:
- **Happy path tests**: Core functionality validation
- **Edge case tests**: Boundary conditions and error handling
- **Security tests**: Authentication, authorization, and vulnerability checks
- **Integration tests**: End-to-end API workflows

**Run tests:**

```bash
cd Artifacts/backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_projects_allocations.py

# Run with verbose output
pytest -v
```

### Frontend Tests

```bash
cd reactapp

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

For detailed testing documentation, see [`tests/TESTING_SECURITY_OVERVIEW.md`](tests/TESTING_SECURITY_OVERVIEW.md).

---

## 🔧 Development Workflow

### Backend Development

1. **Activate virtual environment**:
   ```bash
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   ```

2. **Run backend server with hot reload**:
   ```bash
   uvicorn app.main:app --reload
   ```

3. **Make changes** to files in `Artifacts/backend/app/`

4. **Test your changes**:
   ```bash
   pytest tests/
   ```

### Frontend Development

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Make changes** to files in `reactapp/src/`

3. **Changes auto-reload** in the browser (Vite HMR)

4. **Build for production**:
   ```bash
   npm run build
   ```

### Database Migrations

**Manager-Specific Isolation Migration:**

```bash
cd Artifacts/backend

# Backup existing database
cp data/staffalloc.db data/staffalloc.db.backup

# Run migration to remove Director role and ensure data isolation
python migrate_remove_director.py

# OR create fresh test data with multiple managers
python seed_multiple_managers.py

# Verify data
python verify_seed.py
```

For schema exploration:

```bash
# Connect to SQLite database
sqlite3 Artifacts/backend/data/staffalloc.db

# Run SQL commands
.schema              # View schema
.tables              # List tables
SELECT * FROM projects;  # Query data
```

For production, consider using **Alembic** for database migrations.

---

## 🤖 AI Integration

StaffAlloc leverages Generative AI throughout the Software Development Lifecycle:

### Phase 1: Requirements (PRD Generation)
- AI-generated Product Requirements Document
- User persona development
- User story creation with acceptance criteria

**Artifact**: [`Artifacts/Documentation/prd.md`](Artifacts/Documentation/prd.md)

### Phase 2: Architecture (System Design)
- AI-generated architecture documentation
- PlantUML diagrams from natural language descriptions
- Database schema design

**Artifacts**: 
- [`Artifacts/Documentation/architecture.md`](Artifacts/Documentation/architecture.md)
- [`Artifacts/schema.sql`](Artifacts/schema.sql)

### Phase 3: Backend Development (Code Generation)
- FastAPI boilerplate generation
- SQLAlchemy model generation
- Pydantic schema generation
- API endpoint implementation

**Artifact**: [`Artifacts/backend/`](Artifacts/backend/)

### Phase 4: Testing & Security (QA)
- Pytest test suite generation
- Security vulnerability analysis
- Code review and refactoring

**Artifacts**:
- [`tests/`](tests/)
- [`Artifacts/backend/BACKEND_REVIEW.md`](Artifacts/backend/BACKEND_REVIEW.md)

### Phase 5: Frontend (UI Generation)
- React component generation from screenshots
- TypeScript type definitions
- Form validation logic

**Artifacts**: 
- [`reactapp/src/components/`](reactapp/src/components/)
- [`Artifacts/Frontend/`](Artifacts/Frontend/)

### AI-Powered Features (Production-Ready)

The platform includes advanced AI features powered by Claude 3.5 Sonnet:
- **RAG Chat Interface**: Natural language querying of staffing data
- **Staffing Recommendations**: AI-driven employee suggestions
- **Conflict Detection**: Automatic over-allocation identification with remediation suggestions
- **Predictive Forecasting**: Future hiring needs prediction based on project pipeline
- **Workload Balancing**: Intelligent recommendations for redistributing work
- **Smart Import**: AI-powered spreadsheet header mapping

> **Setup Required:** Configure `ANTHROPIC_API_KEY` in your `.env` file. See [ANTHROPIC_SETUP.md](ANTHROPIC_SETUP.md) for details.

---

## 📖 Documentation

Comprehensive documentation is available in the `Artifacts/Documentation/` directory:

| Document | Description |
|----------|-------------|
| [`prd.md`](Artifacts/Documentation/prd.md) | Product Requirements Document |
| [`architecture.md`](Artifacts/Documentation/architecture.md) | Technical Architecture |
| [`adrs.md`](Artifacts/Documentation/adrs.md) | Architecture Decision Records |
| [`testing_report.md`](Artifacts/Documentation/testing_report.md) | QA Testing Report |
| [`user_stories.json`](Artifacts/Documentation/user_stories.json) | User Stories & Acceptance Criteria |

Additional resources:
- [**Changelog**](CHANGELOG.md) - **Complete list of fixes, improvements, and changes**
- [**Anthropic Setup Guide**](ANTHROPIC_SETUP.md) - **Claude API configuration for AI features**
- [Backend Quick Start Guide](Artifacts/backend/QUICKSTART.md)
- [Backend Review Report](Artifacts/backend/BACKEND_REVIEW.md)
- [Frontend Setup Guide](reactapp/README.md)
- [Integration Guide](INTEGRATION_GUIDE.md)
- [Testing Overview](tests/TESTING_SECURITY_OVERVIEW.md)
- [**Migration Guide**](MIGRATION_GUIDE.md) - **Manager-specific data isolation changes**

---

## 👥 Contributing

This is a capstone project for the AI-Driven Software Engineering Program. While the primary development is complete, contributions for improvements are welcome.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pytest` for backend, `npm run lint` for frontend)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards

- **Python**: Follow PEP 8, use type hints
- **TypeScript**: Follow ESLint configuration, use strict types
- **Testing**: Maintain 80%+ code coverage
- **Documentation**: Update relevant docs with changes

---

## 🆘 Support

### Common Issues

#### "ModuleNotFoundError" (Backend)
```bash
# Solution: Install all dependencies
pip install -r requirements.txt
```

#### "Failed to resolve import" (Frontend)
```bash
# Solution: Reinstall dependencies
cd reactapp
rm -rf node_modules package-lock.json
npm install
```

#### "Port already in use"
```bash
# Backend: Use different port
uvicorn app.main:app --reload --port 8001

# Frontend: Use different port
npm run dev -- --port 5174
```

#### Database Issues
```bash
# Reset database and create test data
cd Artifacts/backend
rm data/staffalloc.db data/staffalloc.db-shm data/staffalloc.db-wal
python seed_multiple_managers.py
```

#### Manager Data Isolation Issues
```bash
# Verify each manager's data is isolated
cd Artifacts/backend
python verify_seed.py

# Should show separate data for each manager
```

#### Migration Issues
See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed troubleshooting and rollback procedures.

### Getting Help

- **Check documentation**: Review the docs in `Artifacts/Documentation/`
- **Review backend guide**: See `Artifacts/backend/QUICKSTART.md`
- **Check API docs**: Visit http://localhost:8000/api/docs
- **Review test examples**: See `tests/` directory

---

## 🎓 Project Information

### Course Details

- **Course**: AI-Driven Software Engineering Capstone
- **Team**: AINavigators
- **Project ID**: 220372-AG-AISOFTDEV-Team-1
- **Duration**: 2 days (Build Day + Demo Day)
- **Instructor Resources**: [`instructor_readme.md`](instructor_readme.md)

### Deliverables

✅ **Product Requirements Document (PRD)**  
✅ **Architecture Document with UML Diagrams**  
✅ **Architecture Decision Records (ADRs)**  
✅ **Backend Application (Python + FastAPI)**  
✅ **Database Schema with Seed Data**  
✅ **Unit Test Suite (Pytest)**  
✅ **Security Vulnerability Analysis**  
✅ **Frontend Application (React + TypeScript)**  
✅ **AI-Generated Components from Screenshots**  
✅ **Jupyter Notebooks for AI Workflows**  
✅ **Final Presentation Materials**  

### AI Usage Throughout SDLC

This project demonstrates AI integration across all phases:
1. ✅ **Product Management**: PRD generation, user story creation
2. ✅ **Architecture**: System design, diagram generation
3. ✅ **Backend Development**: Code generation, API implementation
4. ✅ **QA & Testing**: Test generation, security analysis
5. ✅ **Frontend Development**: Component generation from screenshots

---

## 📝 License

This project is part of an educational program. All rights reserved.

---

## 🙏 Acknowledgments

- **Course Instructors**: For guidance and support throughout the capstone
- **AI Tools Used**: OpenAI GPT, Anthropic Claude, Google Gemini
- **Open Source Community**: For the amazing tools and frameworks

---

## 🚀 Next Steps

After getting the application running:

1. **Explore the UI**: Navigate through projects, employees, and allocations
2. **Test the API**: Use the Swagger UI to interact with endpoints
3. **Review the Code**: Examine the AI-generated components and backend logic
4. **Run the Tests**: Execute the test suite to see comprehensive coverage
5. **Read the Documentation**: Dive deeper into the architecture and design decisions

---

**Built with ❤️ using AI-Driven Software Engineering principles**

