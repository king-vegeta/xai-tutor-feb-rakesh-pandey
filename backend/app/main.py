from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import health_router, items_router, emails_router


def _run_migrations():
    """Run all pending database migrations on startup."""
    import importlib, os, glob
    migrations_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "migrations")
    pattern = os.path.join(migrations_dir, "[0-9][0-9][0-9]_*.py")
    for filepath in sorted(glob.glob(pattern)):
        spec = importlib.util.spec_from_file_location(
            os.path.basename(filepath).replace(".py", ""), filepath
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        module.upgrade()


@asynccontextmanager
async def lifespan(app: FastAPI):
    _run_migrations()
    yield


app = FastAPI(title="Email Client API", version="1.0.0", lifespan=lifespan)

# CORS – allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(items_router)
app.include_router(emails_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
