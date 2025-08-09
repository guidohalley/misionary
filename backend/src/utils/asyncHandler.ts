import type { Request, Response, NextFunction, RequestHandler } from 'express'

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).then(() => undefined).catch(next)
  }
}
