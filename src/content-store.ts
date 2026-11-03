import { createContext, useContext } from 'react'
import { ASSETS, DEFAULT_CONTENT } from './content'
import type { SiteContent } from './content'

export const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT)

export const useContent = () => useContext(ContentContext)

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

/**
 * Lays saved content over the defaults, key by key, keeping only what matches the
 * defaults' shape. Fields added to the site later keep their default value, and
 * anything malformed in the saved file is ignored instead of breaking the page.
 */
export function mergeContent<T>(base: T, saved: unknown): T {
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base
    const template = base[0]
    if (template === undefined) return saved as T
    return saved.filter((item) => (isObject(template) ? isObject(item) : typeof item === typeof template)).map((item) => mergeContent(template, item)) as T
  }
  if (isObject(base)) {
    if (!isObject(saved)) return base
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(base)) out[key] = key in saved ? mergeContent(base[key], saved[key]) : base[key]
    return out as T
  }
  return typeof saved === typeof base ? (saved as T) : base
}

function mapStrings(value: unknown, fn: (s: string) => string): unknown {
  if (typeof value === 'string') return fn(value)
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, fn))
  if (isObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, fn)]))
  return value
}

const ASSET_PREFIX = 'asset:'
const ASSET_NAMES = new Map(Object.entries(ASSETS).map(([name, url]) => [url, name]))

/** Content as saved: built-in photo URLs become "asset:<name>". */
export const toStored = (content: SiteContent) =>
  mapStrings(content, (s) => (ASSET_NAMES.has(s) ? ASSET_PREFIX + ASSET_NAMES.get(s) : s))

/** Saved content (any shape) → full SiteContent, with "asset:<name>" turned back into URLs. */
export const fromStored = (saved: unknown) =>
  mergeContent(
    DEFAULT_CONTENT,
    mapStrings(saved, (s) => (s.startsWith(ASSET_PREFIX) ? (ASSETS[s.slice(ASSET_PREFIX.length)] ?? '') : s)),
  )

/** Fetches what was saved in the admin. Falls back to the defaults if it fails or takes too long. */
export async function loadContent(timeoutMs = 2500): Promise<SiteContent> {
  try {
    const res = await fetch('/api/content', { signal: AbortSignal.timeout(timeoutMs) })
    if (!res.ok || !res.headers.get('content-type')?.includes('json')) return DEFAULT_CONTENT
    return fromStored(await res.json())
  } catch {
    return DEFAULT_CONTENT
  }
}
