import re

from sympy import Eq, sstr

_PATTERN_REPLACEMENTS: tuple[tuple[str, str], ...] = (
    (r"Subs\(Derivative\(y\(t\), \(t, 2\)\), t, 0\)", "y''(0)"),
    (r"Subs\(Derivative\(y\(t\), t\), t, 0\)", "y'(0)"),
    (r"Derivative\(y\(t\), \(t, 2\)\)", "y''(t)"),
    (r"Derivative\(y\(t\), t\)", "y'(t)"),
)


def format_math_output(expression) -> str:
    if isinstance(expression, Eq):
        return f"{format_math_output(expression.lhs)} = {format_math_output(expression.rhs)}"

    text = sstr(expression)
    text = text.replace("**", "^")

    for pattern, replacement in _PATTERN_REPLACEMENTS:
        text = re.sub(pattern, replacement, text)

    return text
