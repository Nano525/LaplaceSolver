function SolverForm({ form, isSolving, onFieldChange, onSolve }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="panel__eyebrow">Entrada</p>
          <h2>Problema diferencial</h2>
        </div>
        <span className="tag">
          {form.order === '2' ? 'Segundo orden' : 'Primer orden'}
        </span>
      </div>

      <label className="field">
        <span>Ecuacion diferencial</span>
        <textarea
          rows="4"
          value={form.equation}
          onChange={onFieldChange('equation')}
          placeholder="Ejemplo: y'' + 3y' + 2y = 0"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Orden</span>
          <select value={form.order} onChange={onFieldChange('order')}>
            <option value="1">Primer orden</option>
            <option value="2">Segundo orden</option>
          </select>
        </label>

        <label className="field">
          <span>y(0)</span>
          <input
            type="text"
            value={form.y0}
            onChange={onFieldChange('y0')}
            placeholder="0"
          />
        </label>

        {form.order === '2' ? (
          <label className="field">
            <span>y'(0)</span>
            <input
              type="text"
              value={form.y1}
              onChange={onFieldChange('y1')}
              placeholder="0"
            />
          </label>
        ) : null}
      </div>

      <div className="panel__actions">
        <button className="solve-button" onClick={onSolve} type="button">
          {isSolving ? 'Resolviendo...' : 'Resolver ejercicio'}
        </button>
      </div>
    </section>
  )
}

export default SolverForm
