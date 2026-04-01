export function buildSolvePayload(form) {
  return {
    equation: form.equation || '',
    order: Number(form.order),
    initial_conditions:
      form.order === '2'
        ? { y0: form.y0 || '0', y1: form.y1 || '0' }
        : { y0: form.y0 || '0' },
  }
}

export function buildApiPreview(form) {
  return JSON.stringify(buildSolvePayload(form), null, 2)
}
