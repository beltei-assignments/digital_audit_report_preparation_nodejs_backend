import Jwt from 'jsonwebtoken'

export function generateToken(payload) {
  const token = Jwt.sign(
    {
      ...payload,
    },
    'TOKEN-KEY',
    {
      expiresIn: '24h',
    }
  )
  return token
}

export function verifyToken(token) {
  const decode = Jwt.verify(token, 'TOKEN-KEY')
  return decode
}
