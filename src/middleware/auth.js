import { verifyToken } from '../utils/jwt.js'

export default function verifyHeader(req, res, next) {
  const token = req.headers['x-access-token']
  if (!token) {
    res.status(401)
    res.send({
      success: false,
      message: 'Missing key (x-access-token) for authentication.',
    })
    return
  }

  try {
    const decode = verifyToken({
      token,
      secretOrPrivateKey: 'LOGIN-KEY-HL8D8A3OA1',
    })
    req.user = decode
  } catch (error) {
    return res
      .status(401)
      .send({ success: false, message: 'Invalid (x-access-token).' })
  }
  return next()
}
