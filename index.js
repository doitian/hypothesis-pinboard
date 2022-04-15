addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Given https://hypothes.is/a/RjuHSrr0Eey-hmukl1Mumg
 * Return https://hypothes.is/api/annotations/RjuHSrr0Eey-hmukl1Mumg
 */
function getAPIEndpoint(entryURL) {
  let parts = entryURL.split('/')
}

function respondWithJSON(bodyObject) {
  return new Response(JSON.stringify(bodyObject, null, 2), {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  })
}

function runTest() {
  if (
    getAPIEndpoint('https://hypothes.is/a/RjuHSrr0Eey-hmukl1Mumg') !==
    'https://hypothes.is/api/annotations/RjuHSrr0Eey-hmukl1Mumg'
  ) {
    throw 'getAPIEndpoint Error'
  }

  return respondWithJSON({ test: 'pass' })
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/test') {
    return runTest(request)
  }

  let body = await request.json()
  return respondWithJSON({ pong: body })
}
