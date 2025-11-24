import { readFileSync } from 'node:fs'
import * as path from 'path'

export function ensurePermissions(permissionAllowed) {
  return function verifyRoles(req, res, next) {
    const isAllowed = hasPermissions(permissionAllowed, req.user.permissions)
    if (!isAllowed) {
      return res.status(403).send({ success: false, message: '403 Forbidden.' })
    }

    next()
  }
}

function hasPermissions(required, permissions) {
  for (const [action, code] of Object.entries(required)) {
    const ok = permissions.some((p) => p.code === code && p[action] === true)
    if (!ok) return false
  }
  return true
}
