from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.solver import router as solver_router

app = FastAPI(
    title="LaplaceSolver API",
    description="API para resolver EDOs con transformada de Laplace usando SymPy.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(solver_router)
