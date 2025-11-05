"""
Database session management for the StaffAlloc application.

This module sets up the SQLAlchemy async engine and session factory for the
SQLite database. It includes configuration for enabling Write-Ahead Logging (WAL)
mode to improve concurrency, which is crucial for a responsive local-first
application.

Key components:
- `engine`: The core SQLAlchemy async engine connected to the database.
- `AsyncSessionLocal`: A factory for creating new database sessions.
- `get_db`: A FastAPI dependency to provide a database session to API endpoints,
  ensuring the session is properly closed after the request is handled.
- `create_db_and_tables`: A utility function to initialize the database schema,
  useful for initial setup or testing.
"""
import os
from typing import AsyncGenerator

from sqlalchemy import event
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from .config import settings
from .models.base import Base  # Assuming a central Base class in models/base.py

# The DATABASE_URL is taken from the central settings configuration.
# The `+aiosqlite` dialect indicates that we are using the async `aiosqlite` driver.
DATABASE_URL = settings.DATABASE_URL

# Create the SQLAlchemy async engine.
# `echo=True` can be useful for debugging SQL queries during development.
engine = create_async_engine(DATABASE_URL, echo=False)


# This event listener ensures that WAL (Write-Ahead Logging) mode is enabled
# every time a new connection is made to the SQLite database. WAL mode allows
# for concurrent reads and writes, which is essential for a responsive API
# and UI, especially when background jobs might be writing to the DB while
# the user is reading data.
@event.listens_for(engine.sync_engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """
    Enables WAL mode for SQLite connections to improve concurrency.
    """
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA busy_timeout = 5000") # 5 seconds
        cursor.execute("PRAGMA foreign_keys=ON")
    finally:
        cursor.close()


# Create a configured "AsyncSession" class.
# `autocommit=False` and `autoflush=False` are standard settings for using
# SQLAlchemy sessions with FastAPI.
# `expire_on_commit=False` is important for async contexts to prevent objects
# from being expired from the session after a commit.
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides an SQLAlchemy database session.

    This function is a generator that yields a single database session
    per request. It uses a try/finally block to ensure that the session
    is always closed, even if an error occurs during the request.

    Yields:
        AsyncSession: The SQLAlchemy asynchronous session object.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_db_and_tables():
    """
    Utility function to create all database tables defined by the SQLAlchemy models.

    This function should be called once at application startup or via a CLI
    command. For production environments with existing data, Alembic migrations
    are the recommended approach for schema management.
    """
    # Ensure the directory for the database file exists
    db_path = DATABASE_URL.split("///")[-1]
    db_dir = os.path.dirname(db_path)
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)

    async with engine.begin() as conn:
        # This will create all tables that inherit from the Base declarative class.
        await conn.run_sync(Base.metadata.create_all)