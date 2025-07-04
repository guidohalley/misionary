"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const http_error_1 = require("./http-error");
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const formattedErrors = errors.array().map(error => ({
            field: error.param,
            message: error.msg
        }));
        throw new http_error_1.HttpError(400, 'Error de validación').withDetails(formattedErrors);
    };
};
exports.validate = validate;
http_error_1.HttpError.prototype.withDetails = function (details) {
    this.details = details;
    return this;
};
//# sourceMappingURL=validator.js.map