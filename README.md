# LaplaceSolver

LaplaceSolver es un proyecto academico en desarrollo para resolver ecuaciones
diferenciales ordinarias de primer y segundo orden usando la Transformada de
Laplace.

La idea es construir una aplicacion web donde el usuario pueda capturar una
ecuacion diferencial, sus condiciones iniciales y obtener una solucion
simbolica junto con una representacion visual del resultado.

## Estado actual

Este repositorio contiene la estructura inicial del proyecto.

Hoy existe:

- Un frontend base con React + Vite
- Una carpeta `backend/` reservada para la API y el motor simbolico
- Documentacion inicial del objetivo del sistema

Todavia no existe:

- Un backend funcional en Python
- Integracion entre frontend y backend
- Resolucion simbolica con SymPy
- Graficas o visualizacion de resultados

## Objetivo del proyecto

La meta es desarrollar una aplicacion capaz de:

- Recibir ecuaciones diferenciales
- Aceptar condiciones iniciales
- Aplicar la Transformada de Laplace
- Resolver la ecuacion en el dominio `s`
- Obtener la transformada inversa
- Mostrar la solucion en el dominio del tiempo
- Graficar el resultado

## Stack previsto

### Frontend

- React
- Vite
- Bootstrap

### Backend

- Python
- SymPy
- NumPy
- Matplotlib

## Estructura actual

```text
LaplaceSolver/
|-- backend/
|-- frontend/
|   |-- src/
|   |-- public/
|   |-- package.json
|-- README.md
|-- .gitignore
```

## Proximos pasos sugeridos

1. Crear la base del backend en Python
2. Definir una API para enviar ecuaciones y condiciones iniciales
3. Implementar la resolucion simbolica con SymPy
4. Conectar el frontend con la API
5. Agregar visualizacion de resultados y graficas

## Desarrollo local

Para ejecutar el frontend:

```bash
cd frontend
npm install
npm run dev
```

## Licencia

Proyecto de uso academico.
