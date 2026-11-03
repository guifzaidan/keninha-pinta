import { checkCredentials, clearedCookie, isAuthenticated, json, sessionCookie } from './_lib/auth.js'

/** GET: is there a valid session? */
export function GET(request: Request) {
  return json({ authenticated: isAuthenticated(request) })
}

/** POST { user, password }: log in. */
export async function POST(request: Request) {
  let body: { user?: unknown; password?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Requisição inválida' }, { status: 400 })
  }
  const user = typeof body.user === 'string' ? body.user.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  let ok: boolean
  try {
    ok = checkCredentials(user, password)
  } catch (e) {
    return json({ error: (e as Error).message }, { status: 500 })
  }
  if (!ok) {
    // Slow down guessing a little
    await new Promise((r) => setTimeout(r, 800))
    return json({ error: 'Usuário ou senha incorretos' }, { status: 401 })
  }
  return json({ authenticated: true }, { headers: { 'Set-Cookie': sessionCookie() } })
}

/** DELETE: log out. */
export function DELETE() {
  return json({ authenticated: false }, { headers: { 'Set-Cookie': clearedCookie() } })
}
