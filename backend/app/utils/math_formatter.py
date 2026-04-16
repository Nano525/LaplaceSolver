import re  # Importa la biblioteca para trabajar con expresiones regulares

from sympy import Eq, sstr  # Importa funciones y clases necesarias desde SymPy

# Define patrones de reemplazo para formatear la salida matemática
_PATTERN_REPLACEMENTS: tuple[tuple[str, str], ...] = (
    (r"Subs\(Derivative\(y\(t\), \(t, 2\)\), t, 0\)", "y''(0)"),  # Reemplaza Subs(Derivative(y(t), t, 2), t, 0) con y''(0)
    (r"Subs\(Derivative\(y\(t\), t\), t, 0\)", "y'(0)"),          # Reemplaza Subs(Derivative(y(t), t), t, 0) con y'(0)
    (r"Derivative\(y\(t\), \(t, 2\)\)", "y''(t)"),                # Reemplaza Derivative(y(t), t, 2) con y''(t)
    (r"Derivative\(y\(t\), t\)", "y'(t)"),                       # Reemplaza Derivative(y(t), t) con y'(t)
)

# Función para formatear la salida matemática
def format_math_output(expression) -> str:
    if isinstance(expression, Eq):  # Si el expression es una ecuación
        return f"{format_math_output(expression.lhs)} = {format_math_output(expression.rhs)}"
    
    text = sstr(expression)  # Convierte el objeto simbólico a una cadena de texto usando sstr
    
    # Reemplaza las potencias dobles "**" por "^"
    text = text.replace("**", "^")
    
    # Aplica los patrones de reemplazo definidos en _PATTERN_REPLACEMENTS
    for pattern, replacement in _PATTERN_REPLACEMENTS:
        text = re.sub(pattern, replacement, text)
    
    return text