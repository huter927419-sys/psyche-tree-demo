export async function fetchMysticalReading(
  psychologyInput: string,
): Promise<{ reading: string; model?: string }> {
  const response = await fetch('/api/mystical-reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ psychologyInput }),
  })

  const data = (await response.json()) as {
    reading?: string
    model?: string
    error?: string
  }

  if (!response.ok) {
    throw new Error(data.error ?? '生成玄学解读失败')
  }

  if (!data.reading) {
    throw new Error('解读内容为空')
  }

  return { reading: data.reading, model: data.model }
}
