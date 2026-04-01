import { useState } from 'react'
import { solverExamples } from '../data/solverExamples.js'

const initialExample = solverExamples[1]

export function useSolverForm() {
  const [selectedId, setSelectedId] = useState(initialExample.id)
  const [form, setForm] = useState({
    equation: initialExample.equation,
    order: initialExample.order,
    y0: initialExample.y0,
    y1: initialExample.y1,
  })

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
  }

  const loadExample = (example) => {
    setSelectedId(example.id)
    setForm({
      equation: example.equation,
      order: example.order,
      y0: example.y0,
      y1: example.y1,
    })
  }

  return {
    examples: solverExamples,
    form,
    selectedExample,
    matchesKnownExample,
    handleFieldChange,
    loadExample,
  }
}
