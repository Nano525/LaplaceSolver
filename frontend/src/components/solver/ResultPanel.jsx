import { buildApiPreview } from '../../utils/buildApiPreview.js'

function ResultPanel({ form, selectedExample, matchesKnownExample }) {
  const apiPreview = buildApiPreview(form)

  return (
    <section className="panel panel--results">
      <div className="panel__header">
        <div>
          <p className="panel__eyebrow">Salida</p>
          <h2>Vista de resolucion</h2>
        </div>
        <span className={`tag ${matchesKnownExample ? '' : 'tag--muted'}`}>
          {matchesKnownExample ? 'Caso reconocido' : 'Pendiente de backend'}
        </span>
      </div>

      <div className="result-stack">
        <article className="result-card">
          <span className="result-card__label">Transformada</span>
          <p>
            {matchesKnownExample
              ? selectedExample.transform
              : 'Aqui aparecera la transformada de la ecuacion cuando el backend procese el ejercicio.'}
          </p>
        </article>

        <article className="result-card">
          <span className="result-card__label">Ecuacion en Y(s)</span>
          <p>
            {matchesKnownExample
              ? selectedExample.laplaceEquation
              : 'El despeje algebraico del dominio s se mostrara en esta seccion.'}
          </p>
        </article>

        <article className="result-card">
          <span className="result-card__label">Solucion final</span>
          <p>
            {matchesKnownExample
              ? selectedExample.solutionT
              : 'La solucion y(t) y su interpretacion visual apareceran aqui.'}
          </p>
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
