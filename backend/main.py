from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import uvicorn
import datetime
import os
from typing import Optional
from loguru import logger
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.decorator import cache
from contextlib import asynccontextmanager


conn_pool: Optional[asyncpg.Pool] = None


async def init_postgres() -> None:
    """
    Initialize the PostgreSQL connection pool and create the products table if it doesn't exist.

    This function is meant to be called at the startup of the FastAPI app to
    initialize a connection pool to PostgreSQL and ensure that the required
    database schema is in place.
    """
    global conn_pool
    try:
        logger.info("Initializing PostgreSQL connection pool...")
        DATABASE_URL = f"postgresql://{os.getenv('NEON_DB_USER')}:{os.getenv('NEON_DB_PASSWORD')}@{os.getenv('NEON_DB_HOST')}:5432/{os.getenv('NEON_DB_NAME')}"
        conn_pool = await asyncpg.create_pool(
            dsn=DATABASE_URL, min_size=1, max_size=10
        )
        logger.info("PostgreSQL connection pool created successfully.")

    except Exception as e:
        logger.error(f"Error initializing PostgreSQL connection pool: {e}")
        raise


async def get_postgres() -> asyncpg.Pool:
    """
    Return the PostgreSQL connection pool.

    This function returns the connection pool object, from which individual
    connections can be acquired as needed for database operations. The caller
    is responsible for acquiring and releasing connections from the pool.

    Returns
    -------
    asyncpg.Pool
        The connection pool object to the PostgreSQL database.

    Raises
    ------
    ConnectionError
        Raised if the connection pool is not initialized.
    """
    global conn_pool
    if conn_pool is None:
        logger.error("Connection pool is not initialized.")
        raise ConnectionError("PostgreSQL connection pool is not initialized.")
    try:
        return conn_pool
    except Exception as e:
        logger.error(f"Failed to return PostgreSQL connection pool: {e}")
        raise


async def close_postgres() -> None:
    """
    Close the PostgreSQL connection pool.

    This function should be called during the shutdown of the FastAPI app
    to properly close all connections in the pool and release resources.
    """
    global conn_pool
    if conn_pool is not None:
        try:
            logger.info("Closing PostgreSQL connection pool...")
            await conn_pool.close()
            logger.info("PostgreSQL connection pool closed successfully.")
        except Exception as e:
            logger.error(f"Error closing PostgreSQL connection pool: {e}")
            raise
    else:
        logger.warning("PostgreSQL connection pool was not initialized.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize connections and resources before the application starts."""
    await init_postgres()
    # Initialize cache backend (InMemory or Redis for production)
    FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")
    yield
    await close_postgres()


app = FastAPI(lifespan=lifespan)

# Add CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/jobs")
@cache(expire=86400)  # Cache expires in 86400 seconds (1 day)
async def get_jobs(db_pool: asyncpg.Pool = Depends(get_postgres)):
    try:
        async with db_pool.acquire() as conn:
            results = await conn.fetch("""
            SELECT * 
            FROM jobs j 
            JOIN coordinates c 
            on j.location=c.location 
            WHERE publication_date = CURRENT_DATE;
            """)
            return [dict(result) for result in results]
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve products")


@app.get("/jobs/search/{keyword}")
@cache(expire=3600)  # Cache expires in 1 hour
async def search_jobs_by_keyword(
    keyword: str,
    db_pool: asyncpg.Pool = Depends(get_postgres)
):
    try:
        words = keyword.split()
        if not words:
            return []

        # Build dynamic WHERE clause for each word
        ilike_clauses = " OR ".join(
            [f"description ILIKE ${i+1}" for i in range(len(words))])
        sql = f"""
            SELECT * 
            FROM jobs j 
            JOIN coordinates c 
            ON j.location = c.location 
            WHERE expiration_date >= CURRENT_DATE 
            AND ({ilike_clauses});
        """
        params = [f"%{word}%" for word in words]

        async with db_pool.acquire() as conn:
            results = await conn.fetch(sql, *params)
            return [dict(result) for result in results]
    except Exception as e:
        logger.error(f"Error searching jobs by keyword: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to search jobs")


@app.get("/jobs/search/{keywords}")
@cache(expire=3600)
async def search_jobs_by_keywords(
    keywords: str,
    db_pool: asyncpg.Pool = Depends(get_postgres)
):
    try:
        if not keywords:
            return []
        keywords = keywords.split()
        ilike_clauses = " OR ".join(
            [f"description ILIKE ${i+1}" for i in range(len(keywords))])
        sql = f"""
            SELECT * 
            FROM jobs j 
            JOIN coordinates c 
            ON j.location = c.location 
            WHERE expiration_date >= CURRENT_DATE 
            AND ({ilike_clauses});
        """
        params = [f"%{keyword}%" for keyword in keywords]

        async with db_pool.acquire() as conn:
            results = await conn.fetch(sql, *params)
            return [dict(result) for result in results]
    except Exception as e:
        logger.error(f"Error searching jobs by regex: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to search jobs")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
