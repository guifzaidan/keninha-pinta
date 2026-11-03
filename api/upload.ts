import { put } from '@vercel/blob'
import { isAuthenticated, json, unauthorized } from './_lib/auth.js'

/** POST raw image bytes (the admin compresses them first). Returns the public URL. */
const MAX_BYTES = 4 * 1024 * 1024
const TYPES: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/avif': 'avif',
  'image/gif': 'gif',
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return unauthorized()

  const type = (request.headers.get('content-type') ?? '').split(';')[0].trim()
  const ext = TYPES[type]
  if (!ext) return json({ error: 'Formato de imagem não suportado' }, { status: 415 })

  const body = await request.arrayBuffer()
  if (body.byteLength === 0) return json({ error: 'Arquivo vazio' }, { status: 400 })
  if (body.byteLength > MAX_BYTES) return json({ error: 'Imagem grande demais (máx. 4 MB)' }, { status: 413 })

  const name = (new URL(request.url).searchParams.get('name') ?? 'imagem')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'imagem'

  const blob = await put(`images/${name}.${ext}`, body, {
    access: 'public',
    addRandomSuffix: true,
    contentType: type,
  })
  return json({ url: blob.url })
}
