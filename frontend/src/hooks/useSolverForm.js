import { useState } from 'react'
import { solverExamples } from '../data/solverExamples.js'
import { solveDifferentialEquation } from '../services/solverApi.js'

const initialExample = solverExamples[1]

export function useSolverForm() {
  const [selectedId, setSelectedId] = useState(initialExample.id)
  const [form, setForm] = useState({
    equation: initialExample.equation,
    order: initialExample.order,
    y0: initialExample.y0,
    y1: initialExample.y1,
  })
  const [result, setResult] = useState(null)
  const [isSolving, setIsSolving] = useState(false)
  const [error, setError] = useState('')

  const selectedExample =
    solverExamples.find((example) => example.id === selectedId) ??
    solverExamples[0]

  const matchesKnownExample =
    form.equation === selectedExample.equation &&
    form.order === selectedExample.order &&
    form.y0 === selectedExample.y0 &&
    form.y1 === selectedExample.y1

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value

    setForm((current) => {
      if (field === 'order') {
        return {
          ...current,
          order: value,
          y1: value === '2' ? current.y1 : '',
        }
      }

      return {
        ...current,
        [field]: value,
      }
    })
    setResult(null)
    setError('')
  }

  const loadExample = (example) => {
    setSelectedId(example.id)
    setForm({
      equation: example.equation,
      order: example.order,
      y0: example.y0,
      y1: example.y1,
    })
    setResult(null)
    setError('')
  }

  const solveCurrentProblem = async () => {
    setIsSolving(true)
    setError('')

    try {
      const nextResult = await solveDifferentialEquation(form)
      setResult(nextResult)
    } catch (nextError) {
      setResult(null)
      setError(nextError.message || 'No se pudo resolver la ecuacion.')
    } finally {
      setIsSolving(false)
    }
  }

  return {
    examples: solverExamples,
    error,
    form,
    isSolving,
    result,
    selectedExample,
    matchesKnownExample,
    handleFieldChange,
    loadExample,
    solveCurrentProblem,
  }
}
