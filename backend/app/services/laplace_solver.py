import numpy as np
from sympy import Eq, Function, lambdify, simplify, solve
from sympy.integrals.transforms import (
    inverse_laplace_transform,
    laplace_correspondence,
    laplace_initial_conds,
    laplace_transform,
)

from app.schemas.solver import PlotPoint, SolveRequest, SolveResponse
from app.utils.equation_parser import (
    detect_equation_order,
    parse_differential_equation,
    parse_initial_value,
)
from app.utils.math_formatter import format_math_output


def solve_laplace_problem(payload: SolveRequest) -> SolveResponse:
    parsed_problem = parse_differential_equation(payload.equation)
    detected_order = detect_equation_order(parsed_problem.equation, parsed_problem.t)

    if detected_order not in (1, 2):
        raise ValueError("Solo se soportan ecuaciones diferenciales de primer y segundo orden.")

    if detected_order != payload.order:
        raise ValueError(
            f"El orden indicado ({payload.order}) no coincide con el orden detectado ({detected_order})."
        )

    y_capital = Function("Y")
    transformed_equation = Eq(
        laplace_correspondence(
            laplace_transform(parsed_problem.equation.lhs, parsed_problem.t, parsed_problem.s, noconds=True),
            {parsed_problem.y: y_capital},
        ),
        laplace_correspondence(
            laplace_transform(parsed_problem.equation.rhs, parsed_problem.t, parsed_problem.s, noconds=True),
            {parsed_problem.y: y_capital},
        ),
    )

    initial_values = [parse_initial_value(payload.initial_conditions.y0)]
    if detected_order == 2:
        initial_values.append(parse_initial_value(payload.initial_conditions.y1 or "0"))

    algebraic_equation = laplace_initial_conds(
        transformed_equation,
        parsed_problem.t,
        {parsed_problem.y: initial_values},
    )

    solved_y_s = solve(algebraic_equation, y_capital(parsed_problem.s))
    if not solved_y_s:
        raise ValueError("No fue posible despejar Y(s) para la ecuacion proporcionada.")

    solution_s = simplify(solved_y_s[0])
    solution_t = simplify(
        inverse_laplace_transform(solution_s, parsed_problem.s, parsed_problem.t)
    )

    return SolveResponse(
        normalized_equation=format_math_output(parsed_problem.equation),
        detected_order=detected_order,
        transformed_equation=format_math_output(transformed_equation),
        algebraic_equation=format_math_output(algebraic_equation),
        solution_s=format_math_output(solution_s),
        solution_t=format_math_output(solution_t),
        plot_points=_generate_plot_points(solution_t, parsed_problem.t),
    )


def _generate_plot_points(solution_t, t_symbol) -> list[PlotPoint]:
    time_values = np.linspace(0.0, 10.0, 101)

    try:
        evaluator = lambdify(t_symbol, solution_t, modules=["numpy"])
        raw_values = evaluator(time_values)

        if np.isscalar(raw_values):
            raw_values = np.full_like(time_values, float(raw_values), dtype=float)

        values = np.real_if_close(np.asarray(raw_values, dtype=np.complex128))
        values = np.asarray(values, dtype=float)
    except Exception:
        return []

    points: list[PlotPoint] = []
    for t_value, y_value in zip(time_values, values):
        if np.isfinite(y_value):
            points.append(
                PlotPoint(
                    t=round(float(t_value), 6),
                    y=round(float(y_value), 6),
                )
            )

    return points
