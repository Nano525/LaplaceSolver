# Backend

API en Python para resolver ecuaciones diferenciales ordinarias de primer y
segundo orden usando la transformada de Laplace.

## Ejecutar

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

## Endpoint principal

`POST /api/solver/solve`

Payload de ejemplo:

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
