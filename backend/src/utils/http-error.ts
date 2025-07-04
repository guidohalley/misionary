export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }

  static BadRequest(message = 'Bad Request') {
    return new HttpError(400, message);
  }

  static Unauthorized(message = 'Unauthorized') {
    return new HttpError(401, message);
  }

  static Forbidden(message = 'Forbidden') {
    return new HttpError(403, message);
  }

  static NotFound(message = 'Not Found') {
    return new HttpError(404, message);
  }

  static InternalServer(message = 'Internal Server Error') {
    return new HttpError(500, message);
  }
}
