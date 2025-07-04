"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
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
exports.HttpError = HttpError;
//# sourceMappingURL=http-error.js.map