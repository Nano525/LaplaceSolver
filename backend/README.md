# Backend

API en Python para resolver ecuaciones diferenciales ordinarias de primer y
segundo orden usando la Transformada de Laplace.

## Tecnologias

- FastAPI
- SymPy
- NumPy

## Ejecutar

```powershell
cd C:\Users\berna\Desktop\LaplaceSolver\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Servidor local:

`http://127.0.0.1:8000`

## Endpoint principal

`POST /api/solver/solve`

### Payload de ejemplo

```json
{
  "equation": "y'' + 3y' + 2y = 0",
  "order": 2,
  "initial_conditions": {
    "y0": "0",
    "y1": "1"
  }
}
```

### Respuesta esperada

```json
{
  "normalized_equation": "y''(t) + 3*y'(t) + 2*y(t) = 0",
  "detected_order": 2,
  "transformed_equation": "s^2*Y(s) + 3*s*Y(s) - s*y(0) + 2*Y(s) - 3*y(0) - y'(0) = 0",
  "algebraic_equation": "s^2*Y(s) + 3*s*Y(s) + 2*Y(s) - 1 = 0",
  "solution_s": "1/(s^2 + 3*s + 2)",
  "solution_t": "(exp(t) - 1)*exp(-2*t)",
  "plot_points": [
    { "t": 0.0, "y": 0.0 }
  ]
}
```

## Responsabilidades del backend

- Interpretar ecuaciones en texto
- Detectar si la EDO es de primer o segundo orden
- Aplicar transformada de Laplace
- Sustituir condiciones iniciales
- Despejar `Y(s)`
- Aplicar transformada inversa
- Generar puntos numericos para la grafica del frontend
