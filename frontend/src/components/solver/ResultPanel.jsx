import MathExpression from './MathExpression.jsx'
import SolutionPlot from './SolutionPlot.jsx'

function ResultPanel({
  error,
  isSolving,
  result,
  selectedExample,
  matchesKnownExample,
}) {
  const transformText = result?.transformed_equation
  const algebraText = result?.algebraic_equation
  const solutionSText = result?.solution_s
  const solutionText = result?.solution_t
  const plotPoints = result?.plot_points ?? []
  const transformExpression =
    transformText || (matchesKnownExample ? selectedExample.transform : '')
  const algebraExpression =
    algebraText || (matchesKnownExample ? selectedExample.laplaceEquation : '')
  const solutionSExpression =
    solutionSText || (matchesKnownExample ? selectedExample.solutionS : '')
  const solutionExpression =
    solutionText || (matchesKnownExample ? selectedExample.solutionT : '')
  const graphSummary = plotPoints.length
    ? `${plotPoints.length} puntos evaluados para representar y(t) en la ventana de analisis.`
    : 'La API devolvera puntos para graficar cuando la solucion pueda evaluarse numericamente.'

  return (
    <section className="panel panel--results">
      <div className="panel__header">
        <div>
          <p className="panel__eyebrow">Salida</p>
          <h2>Vista de resolucion</h2>
        </div>
        <span className={`tag ${result ? '' : 'tag--muted'}`}>
          {result ? 'Resuelto por API' : matchesKnownExample ? 'Caso reconocido' : 'Pendiente de backend'}
        </span>
      </div>

      {error ? <div className="status-banner status-banner--error">{error}</div> : null}
      {isSolving ? <div className="status-banner">Consultando backend y resolviendo con Laplace...</div> : null}

      <div className="result-stack">
        <article className="result-card">
          <span className="result-card__label">Transformada</span>
          <MathExpression
            expression={
              transformExpression ||
              'Aqui aparecera la transformada de la ecuacion cuando el backend procese el ejercicio.'
            }
            isPlaceholder={!transformExpression}
          />
        </article>

        <article className="result-card">
          <span className="result-card__label">Ecuacion algebraica</span>
          <MathExpression
            expression={
              algebraExpression ||
              'El despeje algebraico del dominio s se mostrara en esta seccion.'
            }
            isPlaceholder={!algebraExpression}
          />
        </article>

        <article className="result-card">
          <span className="result-card__label">Solucion en Y(s)</span>
          <MathExpression
            expression={solutionSExpression || 'La solucion en el dominio de Laplace se mostrara aqui.'}
            isPlaceholder={!solutionSExpression}
          />
        </article>

        <article className="result-card">
          <span className="result-card__label">Solucion final</span>
          <MathExpression
            expression={
              solutionExpression || 'La solucion y(t) y su interpretacion visual apareceran aqui.'
            }
            isPlaceholder={!solutionExpression}
          />
        </article>

        <article className="result-card">
          <span className="result-card__label">Grafica</span>
          <SolutionPlot points={plotPoints} />
          <p>{graphSummary}</p>
        </article>
      </div>
    </section>
  )
}

export default ResultPanel
