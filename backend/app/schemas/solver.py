from typing import Literal

from pydantic import BaseModel, Field, model_validator


class InitialConditions(BaseModel):
    y0: str = Field(default="0", description="Valor de y(0)")
    y1: str | None = Field(default=None, description="Valor de y'(0)")


class SolveRequest(BaseModel):
    equation: str = Field(..., min_length=1, description="EDO en formato de texto")
    order: Literal[1, 2] = Field(..., description="Orden esperado de la ecuacion")
    initial_conditions: InitialConditions

    @model_validator(mode="after")
    def validate_initial_conditions(self) -> "SolveRequest":
        if self.order == 2 and self.initial_conditions.y1 is None:
            raise ValueError("Las ecuaciones de segundo orden requieren y'(0).")
        return self


class PlotPoint(BaseModel):
    t: float
    y: float


class SolveResponse(BaseModel):
    normalized_equation: str
    detected_order: int
    transformed_equation: str
    algebraic_equation: str
    solution_s: str
    solution_t: str
    plot_points: list[PlotPoint]
