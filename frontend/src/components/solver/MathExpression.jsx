function findMatchingParenthesis(text, startIndex) {
  let depth = 0

  for (let index = startIndex; index < text.length; index += 1) {
    const character = text[index]

    if (character === '(') {
      depth += 1
    } else if (character === ')') {
      depth -= 1

      if (depth === 0) {
        return index
      }
    }
  }

  return -1
}

function readExponent(text, startIndex) {
  if (text[startIndex] === '(') {
    const endIndex = findMatchingParenthesis(text, startIndex)

    if (endIndex !== -1) {
      return {
        nextIndex: endIndex + 1,
        value: text.slice(startIndex + 1, endIndex),
      }
    }
  }

  let endIndex = startIndex

  while (endIndex < text.length && /[A-Za-z0-9.+\-]/.test(text[endIndex])) {
    endIndex += 1
  }

  return {
    nextIndex: endIndex,
    value: text.slice(startIndex, endIndex),
  }
}

function renderMathContent(text, keyPrefix = 'expr') {
  const nodes = []
  let index = 0

  while (index < text.length) {
    if (text.startsWith('exp(', index)) {
      const endIndex = findMatchingParenthesis(text, index + 3)

      if (endIndex !== -1) {
        const exponent = text.slice(index + 4, endIndex)

        nodes.push(
          <span className="math-token math-token--exp" key={`${keyPrefix}-exp-${index}`}>
            <span>e</span>
            <sup>{renderMathContent(exponent, `${keyPrefix}-exp-inner-${index}`)}</sup>
          </span>,
        )
        index = endIndex + 1
        continue
      }
    }

    const character = text[index]

    if (character === '^') {
      const exponent = readExponent(text, index + 1)

      nodes.push(
        <sup className="math-sup" key={`${keyPrefix}-sup-${index}`}>
          {renderMathContent(exponent.value, `${keyPrefix}-sup-inner-${index}`)}
        </sup>,
      )
      index = exponent.nextIndex
      continue
    }

    if (character === '*') {
      nodes.push(
        <span className="math-operator" key={`${keyPrefix}-mul-${index}`}>
          &middot;
        </span>,
      )
      index += 1
      continue
    }

    if (character === '=') {
      nodes.push(
        <span className="math-operator math-operator--equals" key={`${keyPrefix}-eq-${index}`}>
          =
        </span>,
      )
      index += 1
      continue
    }

    if (character === '-') {
      nodes.push(
        <span className="math-operator" key={`${keyPrefix}-minus-${index}`}>
          &minus;
        </span>,
      )
      index += 1
      continue
    }

    if (character === ' ') {
      nodes.push(
        <span className="math-space" key={`${keyPrefix}-space-${index}`}>
          {' '}
        </span>,
      )
      index += 1
      continue
    }

    let nextIndex = index + 1

    while (
      nextIndex < text.length &&
      !['^', '*', '=', '-', ' '].includes(text[nextIndex]) &&
      !text.startsWith('exp(', nextIndex)
    ) {
      nextIndex += 1
    }

    nodes.push(
      <span className="math-token" key={`${keyPrefix}-token-${index}`}>
        {text.slice(index, nextIndex)}
      </span>,
    )
    index = nextIndex
  }

  return nodes
}

function MathExpression({ expression, isPlaceholder = false }) {
  return (
    <div className={`math-expression ${isPlaceholder ? 'math-expression--placeholder' : ''}`}>
      {isPlaceholder ? expression : renderMathContent(expression)}
    </div>
  )
}

export default MathExpression
