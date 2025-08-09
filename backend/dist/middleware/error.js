"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
const errorHandler = (err, req, res, _next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map