import { AppError } from '../utils/error.js'

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status || 400).json({
      success: false,
      message: err.message,
    })
  }

  // Unknown or programming error
  // return res.status(500).json({
  //   success: false,
  //   message: 'Internal Server Error',
  // })
  throw err
}
