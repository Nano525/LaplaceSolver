from fastapi import APIRouter, HTTPException

from app.schemas.solver import SolveRequest, SolveResponse
from app.services.laplace_solver import solve_laplace_problem

router = APIRouter(prefix="/api/solver", tags=["solver"])


@router.post("/solve", response_model=SolveResponse)
def solve_equation(payload: SolveRequest) -> SolveResponse:
    try:
        return solve_laplace_problem(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Ocurrio un error interno al resolver la ecuacion.",
        ) from exc
