import { ArrowLeft, ArrowRight, Check, ExternalLink, LoaderCircle, LogOut, Menu, RotateCcw, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { SiteContent } from '../content'
import { Butterfly } from '../components/ui'
import { fromStored, toStored } from '../content-store'
import { EditorContext } from './editor-context'
import type { Path } from './editor-context'
import { Fields } from './fields'
import { SECTIONS } from './schema'
import type { Section } from './schema'

type Auth = 'checking' | 'out' | 'in'

export default function Admin() {
  const [auth, setAuth] = useState<Auth>('checking')
  const [notice, setNotice] = useState<string>()

  useEffect(() => {
    document.title = 'Painel · Keninha Pinta'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.append(robots)

    fetch('/api/login')
      .then((r) => r.json())
      .then((d) => setAuth(d.authenticated ? 'in' : 'out'))
      .catch(() => setAuth('out'))
  }, [])

  const logout = useCallback(async (message?: string) => {
    await fetch('/api/login', { method: 'DELETE' }).catch(() => {})
    setNotice(message)
    setAuth('out')
  }, [])

  if (auth === 'checking') return <FullScreenSpinner />
  if (auth === 'out')
    return (
      <Login
        notice={notice}
        onLogin={() => {
          setNotice(undefined)
          setAuth('in')
        }}
      />
    )
  return <Editor onLogout={logout} />
}

function FullScreenSpinner() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream">
      <LoaderCircle className="h-8 w-8 animate-spin text-lilac-deep" />
    </div>
  )
}

function Brand({ sub }: { sub?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Butterfly className="h-9 w-10 shrink-0" />
      <div className="leading-tight">
        <p className="font-display text-lg font-extrabold tracking-tight">
          Keninha <span className="text-pink">Pinta</span>
        </p>
        {sub && <p className="text-xs font-medium text-ink-soft">{sub}</p>}
      </div>
    </div>
  )
}

function Login({ onLogin, notice }: { onLogin: () => void; notice?: string }) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) return onLogin()
      setError(data.error ?? 'Não foi possível entrar')
    } catch {
      setError('Sem conexão. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  const input =
    'mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none transition hover:border-ink-soft/40 focus:border-lilac focus:ring-4 focus:ring-lilac/15'

  return (
    <div className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-cream px-4 py-10">
      <div aria-hidden="true" className="sunburst absolute top-1/2 left-1/2 -z-10 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-60" />
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-[2rem] border-2 border-ink bg-paper p-8 shadow-[8px_8px_0_0_var(--color-ink)] sm:p-10"
      >
        <Brand />
        <h1 className="font-display mt-8 text-3xl font-extrabold tracking-tight">Painel do site</h1>
        <p className="mt-1.5 text-ink-soft">Entre para editar os textos e as fotos.</p>

        {notice && <p className="mt-6 rounded-xl bg-mist px-4 py-3 text-sm">{notice}</p>}

        <label className="mt-7 block text-sm font-semibold">
          Usuário
          <input value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" required className={input} />
        </label>
        <label className="mt-5 block text-sm font-semibold">
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className={input}
          />
        </label>

        {error && <p className="mt-4 text-sm font-medium text-pink-deep">{error}</p>}

        <button type="submit" disabled={busy} className="btn-buy mt-8 w-full px-6 py-3.5 disabled:opacity-70">
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

/** Immutable set: returns a copy of `obj` with `value` at `path`. */
function setIn(obj: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value
  const [head, ...rest] = path
  if (Array.isArray(obj)) return obj.map((v, i) => (i === head ? setIn(v, rest, value) : v))
  const o = (obj ?? {}) as Record<string, unknown>
  return { ...o, [head]: setIn(o[head], rest, value) }
}

const sectionFromHash = () => SECTIONS.find((s) => `#${s.id}` === window.location.hash) ?? SECTIONS[0]

function Editor({ onLogout }: { onLogout: (message?: string) => void }) {
  const [draft, setDraft] = useState<SiteContent>()
  const [saved, setSaved] = useState('')
  const [loadError, setLoadError] = useState(false)
  const [uploads, setUploads] = useState(0)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ ok: boolean; text: string }>()
  const [active, setActive] = useState<Section>(sectionFromHash)
  const [menuOpen, setMenuOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/content?fresh=1')
      if (res.status === 401) return onLogout('Sua sessão expirou. Entre de novo.')
      if (!res.ok) throw new Error()
      const content = fromStored(await res.json())
      setDraft(content)
      setSaved(JSON.stringify(toStored(content)))
    } catch {
      setLoadError(true)
    }
  }, [onLogout])

  useEffect(() => {
    load()
  }, [load])

  // What changed, overall and per section (for the dots in the sidebar)
  const stored = useMemo(() => (draft ? (toStored(draft) as Record<string, unknown>) : undefined), [draft])
  const current = useMemo(() => (stored ? JSON.stringify(stored) : ''), [stored])
  const savedObj = useMemo(() => (saved ? (JSON.parse(saved) as Record<string, unknown>) : {}), [saved])
  const dirty = !!draft && current !== saved
  const dirtySections = useMemo(
    () => new Set(stored ? SECTIONS.filter((s) => JSON.stringify(stored[s.id]) !== JSON.stringify(savedObj[s.id])).map((s) => s.id) : []),
    [stored, savedObj],
  )

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(undefined), toast.ok ? 5000 : 8000)
    return () => clearTimeout(t)
  }, [toast])

  const ctx = useMemo(
    () => ({
      set: (path: Path, value: unknown) => setDraft((d) => (d ? (setIn(d, path, value) as SiteContent) : d)),
      begin: () => setUploads((n) => n + 1),
      end: () => setUploads((n) => n - 1),
    }),
    [],
  )

  const go = (s: Section) => {
    setActive(s)
    setMenuOpen(false)
    history.replaceState(null, '', `#${s.id}`)
    window.scrollTo({ top: 0 })
  }

  const canSave = dirty && !saving && uploads === 0
  const save = useCallback(async () => {
    if (!draft) return
    setSaving(true)
    const body = JSON.stringify(toStored(draft))
    try {
      const res = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body })
      if (res.status === 401) return onLogout('Sua sessão expirou. Entre de novo; o que não foi salvo se perdeu.')
      if (!res.ok) throw new Error()
      setSaved(body)
      setToast({ ok: true, text: 'Salvo! O site mostra as mudanças em até 1 minuto.' })
    } catch {
      setToast({ ok: false, text: 'Não foi possível salvar. Verifique a internet e tente de novo.' })
    } finally {
      setSaving(false)
    }
  }, [draft, onLogout])

  // Ctrl/Cmd + S saves
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (canSave) save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canSave, save])

  const undo = () => setDraft(fromStored(JSON.parse(saved)))

  if (loadError)
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-4 text-center">
        <div>
          <p className="text-lg font-semibold">Não foi possível carregar o conteúdo.</p>
          <button
            type="button"
            onClick={() => {
              setLoadError(false)
              load()
            }}
            className="btn-buy mt-5 px-6 py-3"
          >
            Tentar de novo
          </button>
        </div>
      </div>
    )
  if (!draft) return <FullScreenSpinner />

  const index = SECTIONS.indexOf(active)
  const prev = SECTIONS[index - 1]
  const next = SECTIONS[index + 1]
  const Icon = active.icon

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 pt-6 pb-8">
        <Brand sub="Painel do site" />
        <button type="button" onClick={() => setMenuOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-mist lg:hidden" aria-label="Fechar menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="px-6 pb-2 text-[11px] font-bold tracking-[0.16em] text-ink-soft/70 uppercase">Seções do site</p>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="Seções">
        {SECTIONS.map((s) => {
          const on = s === active
          const SIcon = s.icon
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s)}
              aria-current={on ? 'page' : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition ${
                on ? 'bg-paper font-semibold text-ink shadow-[0_2px_10px_-4px_rgba(43,24,56,0.25)]' : 'text-ink-soft hover:bg-paper/60 hover:text-ink'
              }`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${
                  on ? 'bg-pink text-white' : 'bg-paper text-ink-soft group-hover:text-pink'
                }`}
              >
                <SIcon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate">{s.title}</span>
              {dirtySections.has(s.id) && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" title="Alterações não salvas" />}
            </button>
          )
        })}
      </nav>

      <div className="space-y-0.5 border-t border-line px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-paper/60 hover:text-ink"
        >
          <ExternalLink className="h-4 w-4" /> Abrir o site
        </a>
        <button
          type="button"
          onClick={() => (!dirty || window.confirm('Sair sem salvar as alterações?')) && onLogout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-paper/60 hover:text-ink"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </div>
  )

  const status = uploads > 0 ? 'Enviando foto…' : dirty ? 'Alterações não salvas' : 'Tudo salvo'

  return (
    <EditorContext.Provider value={ctx}>
      <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[18rem_1fr]">
        {/* Sidebar: fixed column on desktop, slide-over on mobile */}
        <aside className="sticky top-0 hidden h-screen border-r border-line bg-blush/40 lg:block">{sidebar}</aside>
        <div className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}>
          <div
            className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className={`absolute inset-y-0 left-0 w-[19rem] max-w-[85vw] bg-cream shadow-2xl transition-transform duration-300 ${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {sidebar}
          </aside>
        </div>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur-md">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-8 lg:px-12">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-paper lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                <span className={`h-2 w-2 shrink-0 rounded-full ${uploads > 0 ? 'animate-pulse bg-lilac' : dirty ? 'bg-gold' : 'bg-green-500'}`} />
                <span className="truncate text-ink-soft">{status}</span>
              </div>
              {dirty && (
                <button
                  type="button"
                  onClick={undo}
                  disabled={saving}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-paper hover:text-ink"
                  title="Voltar para a última versão salva"
                >
                  <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">Desfazer</span>
                </button>
              )}
              <button
                type="button"
                onClick={save}
                disabled={!canSave}
                className="btn-buy shrink-0 px-5 py-2.5 text-sm disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
              >
                <span>
                  {saving ? 'Salvando…' : 'Salvar'}
                  {!saving && <span className="hidden sm:inline"> alterações</span>}
                </span>
              </button>
            </div>
          </header>

          <main className="px-4 pt-8 pb-16 sm:px-8 lg:px-12 lg:pt-12">
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-pink text-white shadow-[3px_3px_0_0_var(--color-ink)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{active.title}</h1>
                    <p className="mt-1 text-ink-soft">{active.description}</p>
                  </div>
                </div>
                {active.anchor && (
                  <a
                    href={`/#${active.anchor}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink"
                  >
                    Ver no site <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <div className="mt-10 space-y-6">
                {active.groups.map((g) => (
                  <section key={g.title} className="rounded-3xl border border-line bg-paper p-5 shadow-[0_1px_3px_rgba(43,24,56,0.04)] sm:p-8">
                    <div className="mb-6">
                      <h2 className="text-lg font-bold">{g.title}</h2>
                      {g.description && <p className="mt-0.5 text-sm text-ink-soft">{g.description}</p>}
                    </div>
                    <Fields fields={g.fields} path={[active.id]} value={draft[active.id] as Record<string, unknown>} />
                  </section>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
                {prev ? (
                  <button type="button" onClick={() => go(prev)} className="group inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink">
                    <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" /> {prev.title}
                  </button>
                ) : (
                  <span />
                )}
                {next && (
                  <button type="button" onClick={() => go(next)} className="group inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink">
                    {next.title} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Toast */}
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
        >
          {toast && (
            <div
              className={`flex items-center gap-2.5 rounded-full border-2 border-ink px-5 py-3 text-sm font-semibold shadow-[4px_4px_0_0_var(--color-ink)] ${
                toast.ok ? 'bg-paper' : 'bg-blush text-pink-deep'
              }`}
            >
              {toast.ok && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-green-500 text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}
              {toast.text}
            </div>
          )}
        </div>
      </div>
    </EditorContext.Provider>
  )
}
