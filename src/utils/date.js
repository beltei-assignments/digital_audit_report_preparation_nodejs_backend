export function formatDateTime(dateStr) {
  const date = new Date(dateStr)

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }

  return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', '')
}
