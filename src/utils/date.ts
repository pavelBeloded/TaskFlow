export function parseMonthDay(timestamp: string | null) {
  if (timestamp === null) {
    return 'Unknown'
  }
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
