function formatValue(value) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  const rounded = Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(2)
  return rounded.replace(/\.00$/, '')
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

function SolutionPlot({ points }) {
  if (!points?.length) {
    return (
      <div className="plot plot--empty">
        <p>Resuelve el ejercicio para ver la curva de y(t) en el intervalo evaluado.</p>
      </div>
    )
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

  return (
    <div className="plot">
      <div className="plot__meta">
        <span>
          t: {formatValue(minX)} a {formatValue(maxX)}
        </span>
        <span>
          y: {formatValue(minY)} a {formatValue(maxY)}
        </span>
      </div>

      <svg
        className="plot__svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Grafica de la solucion y en funcion del tiempo"
      >
        <defs>
          <linearGradient id="plot-line-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#47d7bb" />
            <stop offset="100%" stopColor="#ffd166" />
          </linearGradient>
        </defs>

        <rect
          x={padding}
          y={padding}
          width={width - padding * 2}
          height={height - padding * 2}
          className="plot__frame"
        />

        <line
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
          className="plot__axis"
        />

        <line
          x1={padding}
          x2={padding}
          y1={padding}
          y2={height - padding}
          className="plot__axis"
        />

        {zeroY !== null ? (
          <line
            x1={padding}
            x2={width - padding}
            y1={zeroY}
            y2={zeroY}
            className="plot__zero"
          />
        ) : null}

        <path d={path} className="plot__line" />

        <text x={padding} y={height - 8} className="plot__label">
          t = {formatValue(minX)}
        </text>
        <text x={width - padding} y={height - 8} textAnchor="end" className="plot__label">
          t = {formatValue(maxX)}
        </text>
        <text x={8} y={padding + 4} className="plot__label">
          {formatValue(maxY)}
        </text>
        <text x={8} y={height - padding} className="plot__label">
          {formatValue(minY)}
        </text>
      </svg>
    </div>
  )
}

export default SolutionPlot
