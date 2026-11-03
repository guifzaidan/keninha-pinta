import { createContext } from 'react'

export type Path = (string | number)[]

/**
 * Edits go through `set(path, value)`, which the editor applies to its latest state.
 * (A finished upload must not overwrite what was typed while it was running.)
 * `begin`/`end` let the editor hold the save button while uploads run.
 */
export const EditorContext = createContext<{ set: (path: Path, value: unknown) => void; begin: () => void; end: () => void }>({
  set() {},
  begin() {},
  end() {},
})
