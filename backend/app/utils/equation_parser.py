# Importar bibliotecas y clases necesarias desde sympy
from dataclasses import dataclass
from sympy import Derivative, E, Eq, Function, Symbol, pi, sin, cos, exp, log, sqrt, symbols

# Definir transformaciones para el analizador de expresiones matemáticas
from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,  # Permite la multiplicación implícita entre símbolos
    convert_xor,                        # Convierte operadores XOR en funciones simbólicas
)

# Definir una clase inmutable para representar un problema matemático parseado
@dataclass(frozen=True)
class ParsedProblem:
    equation: Eq  # Ecuación diferencial
    y: Function   # Función dependiente (y(t))
    t: Symbol     # Variable independiente (t)
    s: Symbol     # Nueva variable compleja (s) introducida durante la transformada de Laplace

# Función para analizar una ecuación diferencial proporcionada como cadena
def parse_differential_equation(raw_equation: str) -> ParsedProblem:
    normalized = normalize_math_input(raw_equation)  # Normalizar la entrada matemática
    
    # Validar que la ecuación incluya el signo '='
    if "=" not in normalized:
        raise ValueError("La ecuacion debe incluir el signo '='.")
    
    # Dividir la ecuación en parte izquierda y parte derecha
    left_side, right_side = normalized.split("=", maxsplit=1)
    
    # Definir símbolos (t, s) como positivos y reales
    t, s = symbols("t s", positive=True, real=True)
    
    # Definir la función dependiente y(t)
    y = Function("y")
    
    # Crear una ecuación simbólica usando los lados parseados
    equation = Eq(
        _parse_expression_side(left_side, y, t),  # Parsear la parte izquierda
        _parse_expression_side(right_side, y, t)   # Parsear la parte derecha
    )
    
    # Devolver el objeto ParsedProblem con los componentes del problema parseado
    return ParsedProblem(equation=equation, y=y, t=t, s=s)

# Función para analizar un valor inicial proporcionado como cadena
def parse_initial_value(raw_value: str) -> object:
    normalized = normalize_math_input(str(raw_value or "0"))  # Normalizar la entrada matemática
    
    try:
        # Intentar interpretar el valor inicial como una expresión simbólica
        return parse_expr(
            normalized,
            local_dict=_expression_locals(),  # Diccionario con funciones matemáticas locales
            transformations=TRANSFORMATIONS   # Transformaciones para el analizador
        )
    except Exception as exc:
        raise ValueError(f"No se pudo interpretar la condicion inicial '{raw_value}'.") from exc

# Función para detectar el orden de una ecuación diferencial
def detect_equation_order(equation: Eq, t: Symbol) -> int:
    highest_order = 0  # Inicializar el orden más alto a 0
    
    for derivative in equation.atoms(Derivative):  # Recorrer todas las derivadas en la ecuación
        for symbol, count in derivative.variable_count:  # Obtener el símbolo y su orden
            if symbol == t:  # Verificar si el símbolo es 't'
                highest_order = max(highest_order, count)  # Actualizar el orden más alto
    
    return highest_order  # Devolver el orden más alto de la ecuación

# Función para normalizar la entrada matemática
def normalize_math_input(raw_text: str) -> str:
    return (
        raw_text.strip()  # Eliminar espacios en blanco al principio y final
        .replace("\u2212", "-")  # Reemplazar símbolo de resta unicode con '-'
        .replace("\u2013", "-")  # Reemplazar guion medio unicode con '-'
        .replace("\u2014", "-")  # Reemplazar guion largo unicode con '-'
        .replace("\u2032", "'")  # Reemplazar apóstrofe unicode (derivada) con "'"
        .replace("\u2019", "'")  # Reemplazar comilla simple unicode con "'"
    )

# Función auxiliar para parsear una parte del lado de la ecuación
def _parse_expression_side(side: str, y: Function, t: Symbol):
    prepared = normalize_math_input(side).replace(" ", "")  # Normalizar y eliminar espacios en blanco
    
    # Reemplazar notaciones específicas (y'' por D2Y, y' por D1Y)
    prepared = prepared.replace("y''", "D2Y")
    prepared = prepared.replace("y'", "D1Y")
    prepared = prepared.replace("y(t)", "y")
    
    local_dict = _expression_locals()  # Obtener el diccionario con funciones matemáticas locales
    local_dict.update(
        {
            "y": y(t),  # Agregar la función dependiente y(t)
            "D1Y": Derivative(y(t), t),  # Agregar la derivada primer orden de y(t)
            "D2Y": Derivative(y(t), (t, 2)),  # Agregar la derivada segunda orden de y(t)
            "t": t,  # Agregar la variable independiente t
        }
    )
    
    try:
        # Intentar interpretar el lado como una expresión simbólica
        return parse_expr(
            prepared,
            local_dict=local_dict,  # Diccionario con funciones matemáticas locales
            transformations=TRANSFORMATIONS   # Transformaciones para el analizador
        )
    except Exception as exc:
        raise ValueError(f"No se pudo interpretar la expresion '{side}'.") from exc

# Función auxiliar para obtener un diccionario con funciones matemáticas locales
def _expression_locals() -> dict[str, object]:
    return {
        "e": E,  # Número de Euler
        "E": E,  # Número de Euler (alias)
        "pi": pi,  # Número pi
        "sin": sin,  # Función seno
        "cos": cos,  # Función coseno
        "exp": exp,  # Función exponencial
        "log": log,  # Función logarítmica
        "sqrt": sqrt,  # Función raíz cuadrada
    }