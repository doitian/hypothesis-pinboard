addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function respondWithJSON(bodyObject) {
  return new Response(JSON.stringify(bodyObject, null, 2), {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  })
}

// Given https://hypothes.is/a/RjuHSrr0Eey-hmukl1Mumg
// Return https://hypothes.is/api/annotations/RjuHSrr0Eey-hmukl1Mumg
function getAnnotationAPIEndpoint(annotationURL) {
  const parts = annotationURL.split('/')
  parts[3] = 'api/annotations'
  return parts.join('/')
}

async function fetchAnnotation(annotationURL, hypothesisToken) {
  return fetch(getAnnotationAPIEndpoint(annotationURL), {
    headers: {
      authorization: `Bearer ${hypothesisToken}`,
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })
}

async function addBookmark(annotation, pinboardToken) {
  const params = new URLSearchParams({
    auth_token: pinboardToken,
    url: annotation.uri,
    description: annotation.document.title[0],
    tags: 'highlighted from/hypothesis',
    replace: 'no',
    format: 'json',
  })
  const resp = await fetch(`https://api.pinboard.in/v1/posts/add?${params}`, {
    headers: {
      accept: 'application/json',
    },
  })

  return new Response(resp.body, { status: 200, headers: resp.headers })
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)

  const annotationURL = `https://${url.pathname.split(/:\/\/?/, 2)[1]}`
  console.log(annotationURL)
  const annotationResponse = await fetchAnnotation(
    annotationURL,
    request.headers.get('x-hypothesis-token'),
  )
  if (request.method == 'GET' || !annotationResponse.ok) {
    return annotationResponse
  }

  const annotation = await annotationResponse.json()
  console.log(annotation)
  return addBookmark(annotation, request.headers.get('x-pinboard-token'))
}
