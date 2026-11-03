import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Login fixo: ADMIN_USER e ADMIN_PASSWORD vêm das variáveis de ambiente da Vercel.
 * A sessão é um cookie assinado (HMAC). Trocar a senha invalida todas as sessões abertas.
 */
const COOKIE = 'kp_admin'
const SESSION_DAYS = 7

function credentials() {
  const user = process.env.ADMIN_USER
  const password = process.env.ADMIN_PASSWORD
  if (!user || !password) throw new Error('ADMIN_USER e ADMIN_PASSWORD não estão configurados')
  return { user, password }
}

function secret() {
  const { user, password } = credentials()
  return createHash('sha256').update(`kp-admin:${user}:${password}`).digest()
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

function sameText(a: string, b: string) {
  // Hash first so the comparison is constant-time regardless of length
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function checkCredentials(user: string, password: string) {
  const c = credentials()
  // Evaluate both so timing doesn't reveal which one was wrong
  const okUser = sameText(user, c.user)
  const okPassword = sameText(password, c.password)
  return okUser && okPassword
}

export function sessionCookie() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const token = `${exp}.${sign(String(exp))}`
  return `${COOKIE}=${token}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DAYS * 24 * 60 * 60}`
}

export function clearedCookie() {
  return `${COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
}

export function isAuthenticated(request: Request) {
  const cookies = request.headers.get('cookie') ?? ''
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  if (!match) return false
  const [exp, sig] = match[1].split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  try {
    return sameText(sig, sign(exp))
  } catch {
    return false
  }
}

export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store')
  return new Response(JSON.stringify(data), { ...init, headers })
}

export const unauthorized = () => json({ error: 'Não autorizado' }, { status: 401 })
