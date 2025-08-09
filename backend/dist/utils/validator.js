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
        const formattedErrors = errors.array().map((error) => {
            var _a, _b, _c;
            return ({
                field: (_b = (_a = error.param) !== null && _a !== void 0 ? _a : error.path) !== null && _b !== void 0 ? _b : 'unknown',
                message: (_c = error.msg) !== null && _c !== void 0 ? _c : 'Invalid value'
            });
        });
        throw new http_error_1.HttpError(400, 'Error de validación').withDetails(formattedErrors);
    };
};
exports.validate = validate;
http_error_1.HttpError.prototype.withDetails = function (details) {
    this.details = details;
    return this;
};
//# sourceMappingURL=validator.js.map