# LaplaceSolver

LaplaceSolver es una aplicacion academica para resolver ecuaciones
diferenciales ordinarias de primer y segundo orden usando la Transformada de
Laplace.

El proyecto combina un frontend en React con un backend en Python para recibir
una ecuacion, aplicar el procedimiento simbolico y mostrar la salida de forma
mas clara para el usuario.

## Estado actual

Hoy el proyecto ya incluye:

- Frontend funcional con interfaz para capturar la ecuacion y condiciones iniciales
- Backend con API para resolver EDOs de primer y segundo orden
- Resolucion simbolica con SymPy
- Salida con:
  - transformada de la ecuacion
  - ecuacion algebraica en el dominio de Laplace
  - solucion en `Y(s)`
  - solucion final `y(t)`
- Grafica de la solucion en la interfaz a partir de puntos generados por la API

## Alcance actual

La aplicacion esta pensada para ejercicios como:

- `y' + 2y = 0`, con `y(0) = 1`
- `y'' + 3y' + 2y = 0`, con `y(0) = 0`, `y'(0) = 1`
- `y' - y = e^t`, con `y(0) = 1`
- `y'' + y = sin(t)`, con `y(0) = 0`, `y'(0) = 0`

La API valida el orden detectado de la ecuacion y resuelve el problema usando
Transformada de Laplace e inversa de Laplace.

## Stack

### Frontend

- React
- Vite
- CSS modular por componentes

### Backend

- Python
- FastAPI
- SymPy
- NumPy

## Ejecucion local

Abre dos terminales: una para el backend y otra para el frontend.

### Backend

```powershell
cd C:\Users\berna\Desktop\LaplaceSolver\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

El backend queda disponible en:

`http://127.0.0.1:8000`

### Frontend

```powershell
cd C:\Users\berna\Desktop\LaplaceSolver\frontend
npm install
npm run dev
```

El frontend suele abrir en:

`http://localhost:5173`

El proyecto ya tiene proxy configurado en desarrollo para que el frontend pueda
consumir `/api/solver/solve` sin cambiar URLs manualmente.

## Flujo de resolucion

1. El usuario escribe la ecuacion diferencial.
2. Ingresa `y(0)` y, si aplica, `y'(0)`.
3. El frontend envia el problema al backend.
4. El backend:
   - interpreta la ecuacion
   - aplica Laplace
   - sustituye condiciones iniciales
   - despeja `Y(s)`
   - obtiene `y(t)`
   - genera puntos para la grafica
5. El frontend muestra la salida matematica y la curva de la solucion.

## Notas

- La salida matematica se presenta en un formato mas legible que la salida cruda de SymPy.
- La grafica actual se dibuja en SVG a partir de los puntos que devuelve la API.
- El proyecto sigue siendo academico y todavia puede recibir mejoras en documentacion, pruebas y presentacion final.

## Siguientes mejoras recomendadas

- Agregar pruebas automaticas para los casos base
- Mejorar aun mas el formato matematico de algunas expresiones equivalentes
- Preparar el PDF final del proyecto y el video de presentacion

## Licencia

Proyecto de uso academico.
