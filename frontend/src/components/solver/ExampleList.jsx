function ExampleList({ examples, selectedId, onSelect }) {
  return (
    <section className="panel">
      <div className="panel__header panel__header--tight">
        <div>
          <p className="panel__eyebrow">Casos base</p>
          <h2>Ejercicios de prueba</h2>
        </div>
      </div>

      <div className="example-list">
        {examples.map((example) => {
          const isActive = example.id === selectedId

          return (
            <button
              key={example.id}
              className={`example-card${isActive ? ' example-card--active' : ''}`}
              onClick={() => onSelect(example)}
              type="button"
            >
              <span className="tag">{example.badge}</span>
              <strong>{example.title}</strong>
              <span className="example-card__meta">
                y(0) = {example.y0}
                {example.order === '2' ? ` | y'(0) = ${example.y1}` : ''}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default ExampleList
