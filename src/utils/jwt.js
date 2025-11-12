import Jwt from 'jsonwebtoken'

export function generateToken({
  payload,
  secretOrPrivateKey,
  expiresIn = '24h',
}) {
  const token = Jwt.sign(payload, secretOrPrivateKey, {
    expiresIn,
  })

  return token
}

export function verifyToken({ token, secretOrPrivateKey }) {
  const decode = Jwt.verify(token, secretOrPrivateKey)
  return decode
}
