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
async def lifespan(app:FastAPI):
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
                SELECT j.id as id,
                j.job_title as job_title,
                j.location as location,
                j.salary as salary,
                j.job_url as job_url,
                j.publication_date as publication_date,
                j.expiration_date as expiration_date,
                j.description as description,
                j.employer_name as employer_name,
                j.aplications as aplications,
                c.latitude as latitude,
                c.longitude as longitude
                FROM jobs j join coordinates c
                on j.location=c.location
                where expiration_date>=current_date 
                order by publication_date desc 
                ;
            """)
            return [dict(result) for result in results]
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve products")
  
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)