import ExampleList from '../components/solver/ExampleList.jsx'
import ResultPanel from '../components/solver/ResultPanel.jsx'
import SolverForm from '../components/solver/SolverForm.jsx'
import { useSolverForm } from '../hooks/useSolverForm.js'

function HomePage() {
  const {
    examples,
    error,
    form,
    isSolving,
    result,
    selectedExample,
    matchesKnownExample,
    handleFieldChange,
    loadExample,
    solveCurrentProblem,
  } = useSolverForm()

  return (
    <main className="page">
      <section className="workspace" aria-label="Herramienta de resolucion">
        <header className="workspace__header">
          <div>
            <p className="workspace__eyebrow">LaplaceSolver</p>
            <h1>Resuelve ejercicios de laplace.</h1>
          </div>
          <p className="workspace__summary">
            Captura la ecuacion, define condiciones iniciales y prepara la
            salida para el backend simbolico.
          </p>
        </header>

        <div className="workspace__grid">
          <div className="workspace__column">
            <SolverForm
              form={form}
              isSolving={isSolving}
              onFieldChange={handleFieldChange}
              onSolve={solveCurrentProblem}
            />
            <ExampleList
              examples={examples}
              selectedId={selectedExample.id}
              onSelect={loadExample}
            />
          </div>

          <ResultPanel
            error={error}
            form={form}
            isSolving={isSolving}
            result={result}
            selectedExample={selectedExample}
            matchesKnownExample={matchesKnownExample}
          />
        </div>
      </section>
    </main>
  )
}

export default HomePage
