import { buildApiPreview } from '../../utils/buildApiPreview.js'

function ResultPanel({
  error,
  form,
  isSolving,
  result,
  selectedExample,
  matchesKnownExample,
}) {
  const apiPreview = buildApiPreview(form)
  const transformText = result?.transformed_equation
  const algebraText = result?.algebraic_equation
  const solutionSText = result?.solution_s
  const solutionText = result?.solution_t
  const graphSummary = result?.plot_points?.length
    ? `${result.plot_points.length} puntos listos para graficar desde t=${result.plot_points[0].t} hasta t=${result.plot_points.at(-1).t}.`
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
          <p>
            {transformText ||
              (matchesKnownExample
              ? selectedExample.transform
              : 'Aqui aparecera la transformada de la ecuacion cuando el backend procese el ejercicio.')}
          </p>
        </article>

        <article className="result-card">
          <span className="result-card__label">Ecuacion algebraica</span>
          <p>
            {algebraText ||
              (matchesKnownExample
              ? selectedExample.laplaceEquation
              : 'El despeje algebraico del dominio s se mostrara en esta seccion.')}
          </p>
        </article>

        <article className="result-card">
          <span className="result-card__label">Solucion en Y(s)</span>
          <p>
            {solutionSText ||
              (matchesKnownExample
              ? selectedExample.solutionS
              : 'La solucion en el dominio de Laplace se mostrara aqui.')}
          </p>
        </article>

        <article className="result-card">
          <span className="result-card__label">Solucion final</span>
          <p>
            {solutionText ||
              (matchesKnownExample
              ? selectedExample.solutionT
              : 'La solucion y(t) y su interpretacion visual apareceran aqui.')}
          </p>
        </article>

        <article className="result-card">
          <span className="result-card__label">Grafica</span>
          <p>{graphSummary}</p>
        </article>

        <article className="result-card">
          <span className="result-card__label">Payload sugerido</span>
          <pre>{apiPreview}</pre>
        </article>
      </div>
    </section>
  )
}

export default ResultPanel
