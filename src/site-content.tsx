import { Fragment } from 'react'
import type { ReactNode } from 'react'
import type { SiteContent } from './content'
import { ContentContext } from './content-store'

export function ContentProvider({ value, children }: { value: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

/** Renders "plain *highlighted* plain", wrapping each *…* part with `wrap`. */
export function Rich({ text, wrap }: { text: string; wrap: (part: string) => ReactNode }) {
  return (
    <>
      {text.split(/\*([^*]+)\*/).map((part, i) => (
        <Fragment key={i}>{i % 2 ? wrap(part) : part}</Fragment>
      ))}
    </>
  )
}
