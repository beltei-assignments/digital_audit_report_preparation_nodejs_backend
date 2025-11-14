export function autoConvertObjValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => {
      if (val === 'true') return [key, true]
      if (val === 'false') return [key, false]
      if (!isNaN(val) && val.trim() !== '') return [key, Number(val)]
      return [key, val]
    })
  )
}
