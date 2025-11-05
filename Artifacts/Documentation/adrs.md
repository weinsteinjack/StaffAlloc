### ADR-001: SQLite + SQLAlchemy for Local Persistence

**Status:** Accepted
**Date:** 2025-11-05
**Context:**
The StaffAlloc local-first prototype requires a relational database to store core entities such as projects, employees, and allocations. The primary goal is rapid development and validation on a single developer machine, prioritizing simplicity and minimizing setup overhead. The architecture narrative explicitly calls for a self-contained application without external service dependencies.

The key forces at play are the need for a structured, queryable data store versus the constraint of a zero-configuration, portable development environment. The database must be sufficient to support the complex queries required for the allocation grid and reporting dashboards (e.g., calculating an employee's total FTE across all projects for a given month) while being trivial to set up and tear down.

**Decision:**
We will use SQLite as the database engine for the prototype. The database will be a single file (`staffalloc.db`) configured to run in Write-Ahead Logging (WAL) mode to improve concurrency for the highly interactive frontend. We will use the SQLAlchemy Core & ORM library as the data access layer, providing a robust, type-safe interface that integrates seamlessly with FastAPI and Pydantic. All database schema changes will be managed through version-controlled migration scripts using Alembic. This stack provides a powerful, production-grade toolset against a simple, file-based database, perfectly aligning with the prototype's goals.

**Consequences:**
- ✅ **Zero Configuration:** The database is a single file in the project directory, requiring no installation, network configuration, or user management.
- ✅ **Rapid Development:** SQLAlchemy's ORM and Alembic's migration tools accelerate development by abstracting SQL and providing a clear path for schema evolution.
- ✅ **Portability:** The entire application state can be shared by simply copying the project folder, making collaboration and testing straightforward.
- ⚠️ **Limited Write Concurrency:** While WAL mode helps, SQLite is not designed for high-concurrency write operations and can become a bottleneck under load, unlike server-based databases.
- ⚠️ **Reduced Feature Set:** Lacks advanced features of PostgreSQL, such as materialized views, sophisticated user roles, and specialized data types, which may be needed in the future.

**Alternatives Considered:**
- **PostgreSQL:** Rejected as it introduces significant setup overhead (installation, server management) for a local-first prototype.
- **In-memory Only Database:** Rejected because it does not provide data persistence between application restarts, which is essential for a functional prototype.

**Follow-up Actions:**
- Document the process for switching the SQLAlchemy connection string and dialect from `sqlite+aiosqlite` to `postgresql+asyncpg`.
- Create a placeholder "Phase 1: Cloud Migration" plan that outlines the steps to provision and migrate to a managed PostgreSQL instance (e.g., AWS RDS).

---

### ADR-002: Local AI/RAG with Open-Source Models

**Status:** Accepted
**Date:** 2025-11-05
**Context:**
The StaffAlloc PRD heavily emphasizes AI-powered features, including a Retrieval-Augmented Generation (RAG) chat for querying staffing data (Epic 4) and an AI agent for recommendations (Epic 5). A core constraint of the prototype, as defined in the architecture narrative, is the complete avoidance of paid cloud services to enable cost-free, offline development and iteration. This presents a direct conflict: delivering advanced AI functionality without relying on market-leading cloud APIs.

The challenge is to build a fully functional AI pipeline—from data embedding to language model inference—that runs entirely on a developer's laptop. This system must be capable of answering questions like "Show me all Cyber Analysts with less than 50% FTE in November" by retrieving data from the application's database and synthesizing a natural language response.

**Decision:**
We will implement the AI features using a stack of locally-hosted, open-source tools. We will use a local LLM runner like **Ollama** to serve open-source models (e.g., Llama 3, Phi-3) via a local API endpoint. For the RAG pipeline's vector storage, we will use **ChromaDB**, a lightweight vector database that can persist its index to the local filesystem. The RAG process will involve periodically converting data from the SQLite database into text documents, embedding them with a local sentence-transformer model, and storing them in ChromaDB for fast retrieval. This approach allows us to validate the end-to-end AI user experience without any external dependencies or costs.

**Consequences:**
- ✅ **Zero Cost:** Eliminates all API costs associated with AI model inference and embedding, allowing for unlimited experimentation.
- ✅ **Offline Capability:** The entire application, including its AI features, can run without an internet connection, which is ideal for a portable prototype.
- ✅ **Data Privacy:** All data, including prompts and database content, remains on the local machine, mitigating privacy concerns during development.
- ⚠️ **Lower Quality & Higher Latency:** Local open-source models may provide lower-quality responses and have higher inference latency compared to state-of-the-art cloud APIs like GPT-4 or Claude 3.
- ⚠️ **Hardware Dependency:** Running LLMs and vector databases locally requires significant developer machine resources (RAM, VRAM), potentially creating a barrier for some contributors.

**Alternatives Considered:**
- **OpenAI / Google Gemini APIs:** Rejected as they violate the core "no cloud costs" constraint for the prototype.
- **No AI Features:** Rejected as this would fail to validate a primary value proposition outlined in the PRD.

**Follow-up Actions:**
- Create an `AIService` adapter interface to abstract the LLM and embedding logic, allowing for a future swap-in of cloud-based providers.
- Establish a small set of "golden questions" to benchmark the quality of local model responses and inform the prompt engineering process.
- Document the minimum hardware recommendations for developers to run the full application stack.

---

### ADR-003: FastAPI Monolith with APScheduler

**Status:** Accepted
**Date:** 2025-11-05
**Context:**
The application requires the ability to run background tasks that should not block the main API server. Key examples from the architecture narrative include periodically re-indexing data from the SQLite database into the ChromaDB vector store for the RAG feature, or generating large reports asynchronously. For the local-first prototype, the solution must be simple, lightweight, and integrated directly into the main application process to avoid operational complexity.

The primary force is the need for asynchronous job execution versus the desire to maintain a simple, single-process architecture. Introducing a distributed task queue system like Celery would add significant dependencies (e.g., Redis, RabbitMQ) and complexity, which is contrary to the prototype's goals of simplicity and ease of setup. We need a "good enough" solution for background processing within a monolithic structure.

**Decision:**
We will use the **APScheduler** library integrated directly within the single FastAPI application process. By leveraging the `AsyncIOScheduler`, we can schedule and run asynchronous jobs on the same asyncio event loop as the web server without blocking API requests. This allows us to define periodic tasks (e.g., `run_rag_indexing` every 5 minutes) directly in our Python codebase. This approach provides the necessary background processing capability for the prototype's needs while adding zero external infrastructure dependencies.

**Consequences:**
- ✅ **Simplicity:** Implementation is trivial, requiring only the addition of a Python library and a few lines of code in the application startup logic.
- ✅ **No External Dependencies:** Avoids the need to install, configure, and run a separate message broker like Redis or RabbitMQ.
- ✅ **Shared Context:** Background jobs run in the same process and can easily access the application's configuration, database connections, and services without complex serialization.
- ⚠️ **Limited Scalability & Reliability:** The scheduler runs within the single API process; if the application crashes, all scheduled or running tasks are lost. It does not scale beyond a single node.
- ⚠️ **No Persistence or Retries:** Lacks the robust features of a dedicated task queue, such as job persistence, automatic retries, and a dedicated monitoring interface.

**Alternatives Considered:**
- **Celery + Redis:** Rejected as it introduces too much operational complexity and external dependencies for a local-first prototype.
- **Separate Worker Process:** Rejected because it would require setting up inter-process communication and managing a second process, adding unnecessary complexity for the prototype stage.

**Follow-up Actions:**
- Define and document specific triggers for when the project should migrate to a more robust solution like Celery.
- Triggers should include: the need for guaranteed job execution, job execution times impacting API performance, or the need to scale workers independently of the API server.