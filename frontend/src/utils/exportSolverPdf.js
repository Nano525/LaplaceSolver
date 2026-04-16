function formatValue(value) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  const rounded = Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(2)
  return rounded.replace(/\.00$/, '')
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildPath(points, width, height, padding) {
  if (!points.length) {
    return ''
  }

  const xValues = points.map((point) => point.t)
  const yValues = points.map((point) => point.y)
  const minX = Math.min(...xValues)
  const maxX = Math.max(...xValues)
  const minY = Math.min(...yValues)
  const maxY = Math.max(...yValues)
  const xRange = maxX - minX || 1
  const yRange = maxY - minY || 1
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2

  return points
    .map((point, index) => {
      const x = padding + ((point.t - minX) / xRange) * innerWidth
      const y = height - padding - ((point.y - minY) / yRange) * innerHeight
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function buildPlotMarkup(points) {
  if (!points?.length) {
    return `
      <div class="plot-empty">
        No fue posible generar la grafica para este ejercicio.
      </div>
    `
  }

  const width = 720
  const height = 320
  const padding = 28
  const xValues = points.map((point) => point.t)
  const yValues = points.map((point) => point.y)
  const minX = Math.min(...xValues)
  const maxX = Math.max(...xValues)
  const minY = Math.min(...yValues)
  const maxY = Math.max(...yValues)
  const zeroY =
    minY <= 0 && maxY >= 0
      ? height - padding - ((0 - minY) / (maxY - minY || 1)) * (height - padding * 2)
      : null
  const path = buildPath(points, width, height, padding)

  return `
    <div class="plot-meta">
      <span>t: ${formatValue(minX)} a ${formatValue(maxX)}</span>
      <span>y: ${formatValue(minY)} a ${formatValue(maxY)}</span>
    </div>
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafica de la solucion">
      <defs>
        <linearGradient id="pdf-plot-line-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stop-color="#1fa78c" />
          <stop offset="100%" stop-color="#d18c11" />
        </linearGradient>
      </defs>
      <rect
        x="${padding}"
        y="${padding}"
        width="${width - padding * 2}"
        height="${height - padding * 2}"
        fill="#f7f9fc"
        stroke="#d9e1ec"
        rx="16"
      />
      <line x1="${padding}" x2="${width - padding}" y1="${height - padding}" y2="${height - padding}" stroke="#7c8ba0" stroke-width="1.25" />
      <line x1="${padding}" x2="${padding}" y1="${padding}" y2="${height - padding}" stroke="#7c8ba0" stroke-width="1.25" />
      ${
        zeroY === null
          ? ''
          : `<line x1="${padding}" x2="${width - padding}" y1="${zeroY}" y2="${zeroY}" stroke="#b7c0ce" stroke-width="1" stroke-dasharray="5 5" />`
      }
      <path d="${path}" fill="none" stroke="url(#pdf-plot-line-gradient)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <text x="${padding}" y="${height - 8}" fill="#6b7788" font-size="13">t = ${formatValue(minX)}</text>
      <text x="${width - padding}" y="${height - 8}" fill="#6b7788" font-size="13" text-anchor="end">t = ${formatValue(maxX)}</text>
      <text x="8" y="${padding + 4}" fill="#6b7788" font-size="13">${formatValue(maxY)}</text>
      <text x="8" y="${height - padding}" fill="#6b7788" font-size="13">${formatValue(minY)}</text>
    </svg>
  `
}

export function exportSolverPdf({ form, result }) {
  if (!result) {
    return
  }

  const reportWindow = window.open('', '_blank', 'width=960,height=720')

  if (!reportWindow) {
    window.alert('No se pudo abrir la ventana de impresion. Revisa si el navegador bloqueo la ventana emergente.')
    return
  }

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>LaplaceSolver - Reporte</title>
        <style>
          :root {
            color-scheme: light;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 40px;
            color: #162033;
            background: #ffffff;
            font-family: Georgia, "Times New Roman", serif;
          }

          h1, h2, h3, p {
            margin: 0;
          }

          .report {
            width: min(900px, 100%);
            margin: 0 auto;
          }

          .report-header {
            margin-bottom: 28px;
            padding-bottom: 18px;
            border-bottom: 2px solid #d9e1ec;
          }

          .eyebrow {
            color: #6b7788;
            font: 700 12px/1.2 Arial, sans-serif;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }

          .report-header h1 {
            margin-top: 10px;
            font-size: 34px;
          }

          .report-header p {
            margin-top: 10px;
            color: #49566b;
            font: 16px/1.6 Arial, sans-serif;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 24px;
          }

          .summary-card,
          .section {
            border: 1px solid #d9e1ec;
            border-radius: 16px;
            background: #fbfcfe;
          }

          .summary-card {
            padding: 16px;
          }

          .summary-card strong {
            display: block;
            margin-top: 6px;
            font-size: 18px;
          }

          .section {
            margin-bottom: 16px;
            padding: 18px 20px;
          }

          .section h2 {
            margin-top: 8px;
            font-size: 24px;
          }

          .equation,
          .plot-shell {
            margin-top: 14px;
            padding: 16px 18px;
            border-radius: 14px;
            border: 1px solid #e1e7f0;
            background: #ffffff;
          }

          .equation {
            font-size: 26px;
            line-height: 1.6;
            word-break: break-word;
          }

          .details {
            display: grid;
            gap: 12px;
          }

          .label {
            color: #6b7788;
            font: 700 12px/1.2 Arial, sans-serif;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }

          .value {
            margin-top: 8px;
            font-size: 24px;
            line-height: 1.55;
            word-break: break-word;
          }

          .plot-meta {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
            color: #6b7788;
            font: 14px/1.4 Arial, sans-serif;
          }

          svg {
            display: block;
            width: 100%;
            height: auto;
          }

          .plot-empty {
            color: #49566b;
            font: 16px/1.6 Arial, sans-serif;
            text-align: center;
            padding: 36px 18px;
          }

          @media print {
            body {
              padding: 16px;
            }
          }
        </style>
      </head>
      <body>
        <main class="report">
          <header class="report-header">
            <p class="eyebrow">LaplaceSolver</p>
            <h1>Reporte de resolucion</h1>
            <p>Resultado generado automaticamente a partir del ejercicio capturado en la aplicacion.</p>
          </header>

          <section class="summary">
            <article class="summary-card">
              <span class="eyebrow">Orden</span>
              <strong>${escapeHtml(form.order === '2' ? 'Segundo orden' : 'Primer orden')}</strong>
            </article>
            <article class="summary-card">
              <span class="eyebrow">y(0)</span>
              <strong>${escapeHtml(form.y0 || '0')}</strong>
            </article>
            <article class="summary-card">
              <span class="eyebrow">y'(0)</span>
              <strong>${escapeHtml(form.order === '2' ? form.y1 || '0' : 'No aplica')}</strong>
            </article>
          </section>

          <section class="section">
            <p class="eyebrow">Problema</p>
            <h2>Ecuacion diferencial</h2>
            <div class="equation">${escapeHtml(form.equation)}</div>
          </section>

          <section class="section">
            <p class="eyebrow">Desarrollo</p>
            <h2>Proceso de resolucion</h2>
            <div class="details">
              <div>
                <p class="label">Transformada</p>
                <div class="value">${escapeHtml(result.transformed_equation)}</div>
              </div>
              <div>
                <p class="label">Ecuacion algebraica</p>
                <div class="value">${escapeHtml(result.algebraic_equation)}</div>
              </div>
              <div>
                <p class="label">Solucion en Y(s)</p>
                <div class="value">${escapeHtml(result.solution_s)}</div>
              </div>
              <div>
                <p class="label">Solucion final</p>
                <div class="value">${escapeHtml(result.solution_t)}</div>
              </div>
            </div>
          </section>

          <section class="section">
            <p class="eyebrow">Grafica</p>
            <h2>Comportamiento de la solucion</h2>
            <div class="plot-shell">
              ${buildPlotMarkup(result.plot_points ?? [])}
            </div>
          </section>
        </main>
      </body>
    </html>
  `

  reportWindow.document.open()
  reportWindow.document.write(html)
  reportWindow.document.close()
  reportWindow.focus()

  reportWindow.onload = () => {
    reportWindow.print()
  }
}
