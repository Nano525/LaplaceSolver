export function buildApiPreview(form) {
  const payload = {
    equation: form.equation || '',
    order: Number(form.order),
    initial_conditions:
      form.order === '2'
        ? { y0: form.y0 || '0', y1: form.y1 || '0' }
        : { y0: form.y0 || '0' },
  }

  return JSON.stringify(payload, null, 2)
}
