export function paginate({ page = 1, limit = '-1' }) {
  if (limit === '-1') return {}

  page = Number(page) > 0 ? Number(page) - 1 : 0
  const offset = Number(page) * Number(limit)

  return {
    offset: Number(offset),
    limit: Number(limit),
  }
}
