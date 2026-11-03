import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ImagePlus, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import { useContext, useId, useRef, useState } from 'react'
import type { DragEvent, ReactNode } from 'react'
import { EditorContext } from './editor-context'
import type { Path } from './editor-context'
import type { Field, ListField } from './schema'
import { uploadImage } from './upload'

type Obj = Record<string, unknown>

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] text-ink shadow-[0_1px_2px_rgba(43,24,56,0.04)] outline-none transition placeholder:text-ink-soft/50 hover:border-ink-soft/40 focus:border-lilac focus:ring-4 focus:ring-lilac/15'
const iconButton =
  'grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition hover:bg-mist hover:text-ink disabled:pointer-events-none disabled:opacity-25'
const deleteButton = `${iconButton} hover:!bg-blush hover:!text-pink-deep`

const PALETTE = ['#e9488f', '#d65592', '#9b6ef0', '#7a45d8', '#2f7bd0', '#25a18e', '#f6b83c', '#f08a4b', '#3b2f45']

function Label({ htmlFor, label, hint }: { htmlFor?: string; label: string; hint?: string }) {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{hint}</p>}
    </div>
  )
}

function TextInput({
  id,
  value,
  onChange,
  long,
  placeholder,
}: {
  id?: string
  value: string
  onChange: (v: string) => void
  long?: boolean
  placeholder?: string
}) {
  return long ? (
    <textarea
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className={`${inputClass} field-sizing-content min-h-24 resize-y leading-relaxed`}
    />
  ) : (
    <input id={id} type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass} />
  )
}

/** Photo picker: click or drag a file onto it. `card` fills its container (gallery grid). */
function ImageInput({
  value,
  onChange,
  variant = 'row',
  children,
}: {
  value: string
  onChange: (v: string) => void
  variant?: 'row' | 'card'
  children?: ReactNode
}) {
  const file = useRef<HTMLInputElement>(null)
  const editor = useContext(EditorContext)
  const [busy, setBusy] = useState(false)
  const [over, setOver] = useState(false)
  const [error, setError] = useState<string>()

  const pick = async (f: File | undefined) => {
    if (!f || busy) return
    setError(undefined)
    setBusy(true)
    editor.begin()
    try {
      onChange(await uploadImage(f))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
      editor.end()
      if (file.current) file.current.value = ''
    }
  }

  const drop = {
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      setOver(true)
    },
    onDragLeave: () => setOver(false),
    onDrop: (e: DragEvent) => {
      e.preventDefault()
      setOver(false)
      pick(e.dataTransfer.files[0])
    },
  }

  const picker = <input ref={file} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
  const spinner = busy && (
    <span className="absolute inset-0 grid place-items-center bg-paper/75 backdrop-blur-[2px]">
      <span className="flex flex-col items-center gap-2 text-sm font-medium text-lilac-deep">
        <LoaderCircle className="h-7 w-7 animate-spin" /> Enviando…
      </span>
    </span>
  )
  const errorText = error && <p className="mt-2 text-sm font-medium text-pink-deep">{error}</p>

  if (variant === 'card') {
    return (
      <div>
        {picker}
        <button
          type="button"
          {...drop}
          onClick={() => file.current?.click()}
          className={`group relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-mist transition ${over ? 'ring-4 ring-lilac' : ''}`}
          aria-label={value ? 'Trocar foto' : 'Escolher foto'}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-2 text-sm font-medium text-ink-soft">
              <ImagePlus className="h-8 w-8" /> Escolher foto
            </span>
          )}
          {value && !busy && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-3 py-1.5 text-xs font-semibold opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100">
              <ImagePlus className="h-3.5 w-3.5" /> Trocar foto
            </span>
          )}
          {children}
          {spinner}
        </button>
        {errorText}
      </div>
    )
  }

  return (
    <div>
      {picker}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div className="relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-2xl bg-mist shadow-[0_10px_30px_-14px_rgba(43,24,56,0.45)]">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full place-items-center text-ink-soft">
              <ImagePlus className="h-7 w-7" />
            </span>
          )}
          {spinner}
        </div>
        <button
          type="button"
          {...drop}
          disabled={busy}
          onClick={() => file.current?.click()}
          className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
            over ? 'border-lilac bg-mist' : 'border-line hover:border-lilac hover:bg-mist/50'
          }`}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-mist text-lilac-deep">
            <ImagePlus className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold">{value ? 'Trocar foto' : 'Escolher foto'}</span>
          <span className="max-w-60 text-[13px] text-ink-soft">Clique ou arraste a imagem para cá. De preferência vertical.</span>
        </button>
      </div>
      {errorText}
    </div>
  )
}

function ColorInput({ id, value, onChange }: { id?: string; value: string; onChange: (v: string) => void }) {
  const isHex = /^#[0-9a-f]{6}$/i.test(value)
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`h-7 w-7 rounded-full transition hover:scale-110 ${
              value.toLowerCase() === c ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]'
            }`}
            style={{ background: c }}
            aria-label={`Cor ${c}`}
          />
        ))}
        <label
          className="relative grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-dashed border-ink-soft text-ink-soft transition hover:border-ink hover:text-ink"
          title="Outra cor"
        >
          <Plus className="h-3.5 w-3.5" />
          <input
            type="color"
            value={isHex ? value : '#e9488f'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>
      <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} py-2 font-mono text-xs`} />
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition peer-checked:bg-pink peer-focus-visible:ring-4 peer-focus-visible:ring-lilac/30 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-paper after:shadow after:transition-transform peer-checked:after:translate-x-5" />
      {label}
    </label>
  )
}

function AddButton({ onClick, children, className = '' }: { onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line px-4 py-3 text-sm font-semibold text-ink-soft transition hover:border-lilac hover:bg-mist/50 hover:text-lilac-deep ${className}`}
    >
      <Plus className="h-4 w-4" /> {children}
    </button>
  )
}

function useListOps(path: Path, value: unknown[], field: ListField) {
  const { set } = useContext(EditorContext)
  return {
    move: (i: number, d: number) => {
      const next = [...value]
      ;[next[i], next[i + d]] = [next[i + d], next[i]]
      set(path, next)
    },
    remove: (i: number) => set(path, value.filter((_, k) => k !== i)),
    add: () => set(path, [...value, structuredClone(field.empty)]),
  }
}

function StringList({ field, path, value }: { field: ListField; path: Path; value: unknown[] }) {
  const { set } = useContext(EditorContext)
  const ops = useListOps(path, value, field)
  return (
    <div className="space-y-2.5">
      {value.map((item, i) => (
        <div key={i} className="group flex items-start gap-2.5">
          <span className="mt-3 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mist text-xs font-bold text-lilac-deep">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <TextInput value={String(item)} onChange={(v) => set([...path, i], v)} long={field.item === 'long'} />
          </div>
          <div className="mt-2 flex shrink-0 gap-0.5 transition sm:opacity-40 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
            <button type="button" className={iconButton} onClick={() => ops.move(i, -1)} disabled={i === 0} aria-label="Mover para cima">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button type="button" className={iconButton} onClick={() => ops.move(i, 1)} disabled={i === value.length - 1} aria-label="Mover para baixo">
              <ArrowDown className="h-4 w-4" />
            </button>
            <button type="button" className={deleteButton} onClick={() => ops.remove(i)} aria-label={`Remover ${field.itemName}`}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <AddButton onClick={ops.add} className="ml-8.5">
        Adicionar {field.itemName}
      </AddButton>
    </div>
  )
}

/** Photo cards (gallery): the photo with a live preview of its sticker, then the other fields. */
function GridList({ field, path, value }: { field: ListField; path: Path; value: unknown[] }) {
  const { set } = useContext(EditorContext)
  const ops = useListOps(path, value, field)
  const fields = field.item as Field[]
  const imageField = fields.find((f) => f.kind === 'image')
  const rest = fields.filter((f) => f !== imageField)

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {value.map((raw, i) => {
        const item = raw as Obj
        return (
          <div key={i} className="flex flex-col rounded-2xl border border-line bg-paper p-3 shadow-[0_1px_2px_rgba(43,24,56,0.04)]">
            {imageField && (
              <ImageInput variant="card" value={String(item[imageField.key] ?? '')} onChange={(v) => set([...path, i, imageField.key], v)}>
                {typeof item.title === 'string' && typeof item.color === 'string' && (
                  <span
                    className={`font-display pointer-events-none absolute bottom-3 left-3 max-w-[85%] -rotate-2 truncate rounded-lg border-2 border-ink px-2.5 py-1 text-sm font-bold shadow-[2px_2px_0_0_var(--color-ink)] ${
                      item.dark ? 'text-ink' : 'text-white'
                    }`}
                    style={{ background: item.color }}
                  >
                    {item.title || 'Sem nome'}
                  </span>
                )}
              </ImageInput>
            )}
            <div className="mt-4 flex-1 px-1">
              <Fields fields={rest} path={[...path, i]} value={item} compact />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line px-1 pt-3">
              <span className="text-xs font-semibold text-ink-soft">
                {i + 1} de {value.length}
              </span>
              <div className="flex gap-0.5">
                <button type="button" className={iconButton} onClick={() => ops.move(i, -1)} disabled={i === 0} aria-label="Mover para antes">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button type="button" className={iconButton} onClick={() => ops.move(i, 1)} disabled={i === value.length - 1} aria-label="Mover para depois">
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" className={deleteButton} onClick={() => ops.remove(i)} aria-label={`Remover ${field.itemName}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
      <AddButton onClick={ops.add} className="min-h-60 flex-col rounded-2xl">
        Adicionar {field.itemName}
      </AddButton>
    </div>
  )
}

/** Cards that open and close, titled by one of the item's fields (FAQ, steps…). */
function AccordionList({ field, path, value }: { field: ListField; path: Path; value: unknown[] }) {
  const ops = useListOps(path, value, field)
  const [open, setOpen] = useState<number | null>(null)
  const fields = field.item as Field[]

  return (
    <div className="space-y-2.5">
      {value.map((raw, i) => {
        const item = raw as Obj
        const isOpen = open === i
        const title = field.titleKey ? String(item[field.titleKey] ?? '').trim() : ''
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border bg-paper transition ${
              isOpen ? 'border-lilac/50 shadow-[0_10px_30px_-14px_rgba(117,66,214,0.35)]' : 'border-line hover:border-ink-soft/30'
            }`}
          >
            <div className="flex items-center gap-2 pr-2">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-w-0 flex-1 items-center gap-3 py-3.5 pl-4 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                    isOpen ? 'bg-lilac text-white' : 'bg-mist text-lilac-deep'
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`min-w-0 flex-1 truncate font-medium ${title ? '' : 'text-ink-soft italic'}`}>
                  {title || `Nova ${field.itemName}`}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-ink-soft transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className="flex shrink-0 gap-0.5 border-l border-line pl-2">
                <button type="button" className={iconButton} onClick={() => ops.move(i, -1)} disabled={i === 0} aria-label="Mover para cima">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" className={iconButton} onClick={() => ops.move(i, 1)} disabled={i === value.length - 1} aria-label="Mover para baixo">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={deleteButton}
                  onClick={() => {
                    ops.remove(i)
                    setOpen(null)
                  }}
                  aria-label={`Remover ${field.itemName}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="border-t border-line bg-cream/50 px-4 py-5 sm:px-6">
                <Fields fields={fields} path={[...path, i]} value={item} />
              </div>
            )}
          </div>
        )
      })}
      <AddButton
        onClick={() => {
          ops.add()
          setOpen(value.length)
        }}
        className="w-full"
      >
        Adicionar {field.itemName}
      </AddButton>
    </div>
  )
}

function FieldInput({ field, path, value }: { field: Field; path: Path; value: unknown }) {
  const id = useId()
  const { set } = useContext(EditorContext)
  const onChange = (v: unknown) => set(path, v)

  if (field.kind === 'list') {
    const list = Array.isArray(value) ? value : []
    if (field.item === 'text' || field.item === 'long') return <StringList field={field} path={path} value={list} />
    if (field.layout === 'grid') return <GridList field={field} path={path} value={list} />
    return <AccordionList field={field} path={path} value={list} />
  }
  if (field.kind === 'bool') return <Toggle checked={Boolean(value)} onChange={onChange} label={field.label} />

  let control: ReactNode
  if (field.kind === 'image') control = <ImageInput value={String(value ?? '')} onChange={onChange} />
  else if (field.kind === 'color') control = <ColorInput id={id} value={String(value ?? '')} onChange={onChange} />
  else control = <TextInput id={id} value={String(value ?? '')} onChange={onChange} long={field.long} placeholder={field.placeholder} />

  return (
    <div>
      <Label htmlFor={field.kind === 'image' ? undefined : id} label={field.label} hint={field.hint} />
      {control}
    </div>
  )
}

export function Fields({ fields, path, value, compact }: { fields: Field[]; path: Path; value: Obj; compact?: boolean }) {
  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} path={[...path, f.key]} value={value[f.key]} />
      ))}
    </div>
  )
}
