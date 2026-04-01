from dataclasses import dataclass

from sympy import Derivative, E, Eq, Function, Symbol, pi, sin, cos, exp, log, sqrt, symbols
from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,
    convert_xor,
)


@dataclass(frozen=True)
class ParsedProblem:
    equation: Eq
    y: Function
    t: Symbol
    s: Symbol


def parse_differential_equation(raw_equation: str) -> ParsedProblem:
    normalized = normalize_math_input(raw_equation)
    if "=" not in normalized:
        raise ValueError("La ecuacion debe incluir el signo '='.")

    left_side, right_side = normalized.split("=", maxsplit=1)
    t, s = symbols("t s", positive=True, real=True)
    y = Function("y")

    equation = Eq(
        _parse_expression_side(left_side, y, t),
        _parse_expression_side(right_side, y, t),
    )

    return ParsedProblem(equation=equation, y=y, t=t, s=s)


def parse_initial_value(raw_value: str) -> object:
    normalized = normalize_math_input(str(raw_value or "0"))
    try:
        return parse_expr(
            normalized,
            local_dict=_expression_locals(),
            transformations=TRANSFORMATIONS,
        )
    except Exception as exc:
        raise ValueError(f"No se pudo interpretar la condicion inicial '{raw_value}'.") from exc


def detect_equation_order(equation: Eq, t: Symbol) -> int:
    highest_order = 0
    for derivative in equation.atoms(Derivative):
        for symbol, count in derivative.variable_count:
            if symbol == t:
                highest_order = max(highest_order, count)
    return highest_order


def normalize_math_input(raw_text: str) -> str:
    return (
        raw_text.strip()
        .replace("\u2212", "-")
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2032", "'")
        .replace("\u2019", "'")
    )


def _parse_expression_side(side: str, y: Function, t: Symbol):
    prepared = normalize_math_input(side).replace(" ", "")
    prepared = prepared.replace("y''", "D2Y")
    prepared = prepared.replace("y'", "D1Y")
    prepared = prepared.replace("y(t)", "y")

    local_dict = _expression_locals()
    local_dict.update(
        {
            "y": y(t),
            "D1Y": Derivative(y(t), t),
            "D2Y": Derivative(y(t), (t, 2)),
            "t": t,
        }
    )

    try:
        return parse_expr(
            prepared,
            local_dict=local_dict,
            transformations=TRANSFORMATIONS,
        )
    except Exception as exc:
        raise ValueError(f"No se pudo interpretar la expresion '{side}'.") from exc


def _expression_locals() -> dict[str, object]:
    return {
        "e": E,
        "E": E,
        "pi": pi,
        "sin": sin,
        "cos": cos,
        "exp": exp,
        "log": log,
        "sqrt": sqrt,
    }
