import numpy as np  # Importa la biblioteca NumPy para manipulación de arrays numéricos

from sympy import Eq, Function, lambdify, simplify, solve  # Importa funciones y clases necesarias desde SymPy
from sympy.integrals.transforms import (
    inverse_laplace_transform,
    laplace_correspondence,
    laplace_initial_conds,
    laplace_transform,
)  # Importa transformaciones de Laplace y correspondencias simbólicas

# Importa esquemas y utilidades desde el módulo app
from app.schemas.solver import PlotPoint, SolveRequest, SolveResponse
from app.utils.equation_parser import (
    detect_equation_order,
    parse_differential_equation,
    parse_initial_value,
)
from app.utils.math_formatter import format_math_output

# Función principal para resolver problemas de transformada de Laplace
def solve_laplace_problem(payload: SolveRequest) -> SolveResponse:
    parsed_problem = parse_differential_equation(payload.equation)  # Analiza la ecuación diferencial proporcionada
    
    detected_order = detect_equation_order(parsed_problem.equation, parsed_problem.t)  # Detecta el orden de la ecuación
    if detected_order not in (1, 2):  # Verifica si es una ecuación de primer o segundo orden
        raise ValueError("Solo se soportan ecuaciones diferenciales de primer y segundo orden.")
    
    if detected_order != payload.order:  # Verifica si el orden indicado coincide con el detectado
        raise ValueError(
            f"El orden indicado ({payload.order}) no coincide con el orden detectado ({detected_order})."
        )
    
    y_capital = Function("Y")  # Define la función Y(s) en la transformada de Laplace
    
    transformed_equation = Eq(  # Transforma la ecuación diferencial a su forma en la transformada de Laplace
        laplace_correspondence(
            laplace_transform(parsed_problem.equation.lhs, parsed_problem.t, parsed_problem.s, noconds=True),
            {parsed_problem.y: y_capital},
        ),
        laplace_correspondence(
            laplace_transform(parsed_problem.equation.rhs, parsed_problem.t, parsed_problem.s, noconds=True),
            {parsed_problem.y: y_capital},
        ),
    )
    
    initial_values = [parse_initial_value(payload.initial_conditions.y0)]  # Analiza la condición inicial y0
    
    if detected_order == 2:  # Si es una ecuación de segundo orden
        initial_values.append(parse_initial_value(payload.initial_conditions.y1 or "0"))  # Analiza la condición inicial y1
        
    algebraic_equation = laplace_initial_conds(  # Convierte la ecuación transformada en una ecuación algebraica
        transformed_equation,
        parsed_problem.t,
        {parsed_problem.y: initial_values},
    )
    
    solved_y_s = solve(algebraic_equation, y_capital(parsed_problem.s))  # Resuelve la ecuación algebraica para Y(s)
    
    if not solved_y_s:
        raise ValueError("No fue posible despejar Y(s) para la ecuacion proporcionada.")
    
    solution_s = simplify(solved_y_s[0])  # Simplifica la solución en la transformada de Laplace
    
    solution_t = simplify(  # Convierte la solución en la transformada a su forma en el dominio temporal
        inverse_laplace_transform(solution_s, parsed_problem.s, parsed_problem.t)
    )
    
    return SolveResponse(
        normalized_equation=format_math_output(parsed_problem.equation),  # Formatea y devuelve la ecuación original
        detected_order=detected_order,
        transformed_equation=format_math_output(transformed_equation),  # Formatea y devuelve la ecuación transformada
        algebraic_equation=format_math_output(algebraic_equation),  # Formatea y devuelve la ecuación algebraica
        solution_s=format_math_output(solution_s),  # Formatea y devuelve la solución en la transformada de Laplace
        solution_t=format_math_output(solution_t),  # Formatea y devuelve la solución en el dominio temporal
        plot_points=_generate_plot_points(solution_t, parsed_problem.t),  # Genera puntos para gráficar la solución
    )

# Función auxiliar para generar puntos de gráfica a partir de una solución en el dominio temporal
def _generate_plot_points(solution_t, t_symbol) -> list[PlotPoint]:
    time_values = np.linspace(0.0, 10.0, 101)  # Genera 101 valores de tiempo entre 0 y 10 segundos
    
    try:
        evaluator = lambdify(t_symbol, solution_t, modules=["numpy"])  # Crea una función evaluadora para la solución
        raw_values = evaluator(time_values)  # Evalúa la solución en los valores de tiempo generados
        
        if np.isscalar(raw_values):  # Si el resultado es un escalar
            raw_values = np.full_like(time_values, float(raw_values), dtype=float)  # Convierte a un array de floats
        
        values = np.real_if_close(np.asarray(raw_values, dtype=np.complex128))  # Extrae los valores reales de la solución
        values = np.asarray(values, dtype=float)  # Convierte los valores a floats
        
    except Exception:
        return []  # Si ocurre un error, devuelve una lista vacía
    
    points: list[PlotPoint] = []
    for t_value, y_value in zip(time_values, values):  # Para cada par de tiempo y valor
        if np.isfinite(y_value):  # Verifica si el valor es finito
            points.append(
                PlotPoint(
                    t=round(float(t_value), 6),  # Añade el punto a la lista con tiempo y valor redondeados
                    y=round(float(y_value), 6),
                )
            )
    
    return points