from fastapi import APIRouter, HTTPException  # Importa componentes de FastAPI para crear rutas y manejar excepciones
from app.schemas.solver import SolveRequest, SolveResponse  # Importa los esquemas definidos para solicitudes y respuestas
from app.services.laplace_solver import solve_laplace_problem  # Importa la función que resuelve problemas de transformada de Laplace

# Crea un enrutador FastAPI con prefijo "/api/solver" y etiquetas ["solver"]
router = APIRouter(prefix="/api/solver", tags=["solver"])

# Define una ruta POST para resolver ecuaciones
@router.post("/solve", response_model=SolveResponse)
def solve_equation(payload: SolveRequest) -> SolveResponse:
    try:
        return solve_laplace_problem(payload)  # Llama a la función que resuelve el problema de transformada de Laplace
    except ValueError as exc:  # Captura excepciones de tipo ValueError
        raise HTTPException(status_code=400, detail=str(exc)) from exc  # Devuelve una respuesta con status 400 y el mensaje del error
    except Exception as exc:  # Captura excepciones generales
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error interno al resolver la ecuación.",
        ) from exc  # Devuelve una respuesta con status 500 y un mensaje de error general