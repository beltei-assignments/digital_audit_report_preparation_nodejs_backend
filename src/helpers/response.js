export function AppResponse(status = 200, options) {
  const defaultOptions = {
    success: options.success || true,
    message: options.message || 'Requesting was successful',
    ...(options.data && { data: options.data }),
    ...(options.custom && { ...options.custom }),
  }
  return { status, json: { ...defaultOptions } }
}
