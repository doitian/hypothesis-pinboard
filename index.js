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

async function fetchAnnotation(annotationURL) {
  return fetch(getAnnotationAPIEndpoint(annotationURL), {
    headers: {
      authorization: `Bearer ${HYPOTHESIS_TOKEN}`,
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })
}

async function addBookmark(annotation) {
  const params = URLSearchParams({
    auth_token: PINBOARD_TOKEN,
    url: annotation.uri,
    description: annotation.document.title[0],
    replace: 'no',
  })
  const resp = await fetch(`https://api.pinboard.in/v1/posts/add?${params}`, {
    headers: {
      accept: 'application/json',
    },
  })

  return respondWithJSON({ duplicated: !resp.ok })
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)
  console.log(url)

  // https://hypothesis-pinboard.doitian.workers.dev/https://hypothes.is/a/RjuHSrr0Eey-hmukl1Mumg
  const annotationURL = `https://${url.pathname.split(/:\/\/?/, 2)[1]}`
  const annotation = await fetchAnnotation(annotationURL)

  if (request.method == 'GET') {
    return annotation
  }

  return addBookmark(annotation)
}