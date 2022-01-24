const ansi2html = require('ansi2html')

const { CLOCKWORK_USERAGENT } = require('../../utils')

const { formatLambdaError } = require('./utils')

const handleScheduledFunction = ({ error, request, response, result }) => {
  const acceptsHtml = request.headers.accept && request.headers.accept.includes('text/html')
  const paragraph = (text) => {
    text = text.trim()

    if (acceptsHtml) {
      return ansi2html(`<p>${text}</p>`)
    }

    text = text
      .replaceAll('<pre><code>', '```\n')
      .replaceAll('</code></pre>', '\n```')
      .replaceAll(`<code>`, '`')
      .replaceAll(`</code>`, '`')

    return `${text}\n\n`
  }

  const isSimulatedRequest = request.headers['user-agent'] === CLOCKWORK_USERAGENT

  let message = ''

  if (!isSimulatedRequest) {
    message += paragraph(`
You performed an HTTP request to <code>${request.path}</code>, which is a scheduled function.
You can do this to test your functions locally, but it won't work in production.
    `)
  }

  if (error) {
    message += paragraph(`
There was an error during execution of your scheduled function:

<pre><code>${formatLambdaError(error)}</code></pre>`)
  }

  if (result) {
    const { statusCode } = result
    if (statusCode >= 500) {
      message += paragraph(`
Your function returned a status code of <code>${statusCode}</code>.
At the moment, Netlify does nothing about that. In the future, there might be a retry mechanism based on this.
`)
    }

    const allowedKeys = new Set(['statusCode'])
    const returnedKeys = Object.keys(result)
    const ignoredKeys = returnedKeys.filter((key) => !allowedKeys.has(key))

    if (ignoredKeys.length !== 0) {
      message += paragraph(
        `Your function returned ${ignoredKeys
          .map((key) => `<code>${key}</code>`)
          .join(', ')}. Is this an accident? It won't be interpreted by Netlify.`,
      )
    }
  }

  response.status(error ? 500 : 200)
  if (acceptsHtml) {
    response.set('Content-Type', 'text/html')
    response.send(
      `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">\n
      ${message}`,
    )
  } else {
    response.set('Content-Type', 'text/plain')
    response.send(message)
  }
}

module.exports = { handleScheduledFunction }
