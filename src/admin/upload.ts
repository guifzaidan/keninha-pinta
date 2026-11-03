/** Shrinks a photo in the browser (max 1600px, WebP) so uploads are fast and the site stays light. */
async function compress(file: File, maxSide = 1600, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
  const webp = await encode('image/webp')
  // Browsers that can't encode WebP silently return PNG; JPEG is much smaller then
  if (webp && webp.type === 'image/webp') return webp
  const jpeg = await encode('image/jpeg')
  if (!jpeg) throw new Error('Não foi possível processar a imagem')
  return jpeg
}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Escolha um arquivo de imagem')
  let body: Blob
  try {
    body = await compress(file)
  } catch {
    throw new Error('Não foi possível ler essa imagem. Tente uma foto em JPG ou PNG.')
  }

  const res = await fetch(`/api/upload?name=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers: { 'Content-Type': body.type },
    body,
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) throw new Error('Sua sessão expirou. Entre de novo.')
  if (!res.ok || typeof data.url !== 'string') throw new Error(data.error ?? 'Falha ao enviar a imagem')
  return data.url
}
