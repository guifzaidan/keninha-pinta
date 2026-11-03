import { get, put } from '@vercel/blob'
import { isAuthenticated, json, unauthorized } from './_lib/auth.js'

/**
 * The site's editable content lives in one JSON file in Vercel Blob.
 * Visitors get it through the CDN (refreshed every ~30s); the admin always reads the latest.
 */
const PATHNAME = 'content.json'
const MAX_BYTES = 512 * 1024

async function readContent() {
  const result = await get(PATHNAME, { access: 'public', useCache: false })
  if (!result || result.statusCode !== 200) return {}
  return JSON.parse(await new Response(result.stream).text())
}

export async function GET(request: Request) {
  const fresh = new URL(request.url).searchParams.has('fresh')
  if (fresh && !isAuthenticated(request)) return unauthorized()

  let content: unknown
  try {
    content = await readContent()
  } catch (e) {
    console.error('Falha ao ler o conteúdo', e)
    // The site falls back to its built-in texts
    return json({}, { status: 503 })
  }

  if (fresh) return json(content)
  return json(content, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Vercel-CDN-Cache-Control': 'max-age=30, stale-while-revalidate=300',
    },
  })
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) return unauthorized()

  const text = await request.text()
  if (text.length > MAX_BYTES) return json({ error: 'Conteúdo grande demais' }, { status: 413 })
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return json({ error: 'JSON inválido' }, { status: 400 })
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return json({ error: 'Formato inválido' }, { status: 400 })
  }

  await put(PATHNAME, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  })
  return json({ ok: true, savedAt: new Date().toISOString() })
}
