import { buildSolvePayload } from '../utils/buildApiPreview.js'

export async function solveDifferentialEquation(form) {
  const response = await fetch('/api/solver/solve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildSolvePayload(form)),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'No se pudo resolver la ecuacion.')
  }

  return data
}
