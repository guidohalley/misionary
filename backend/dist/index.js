"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config/config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const persona_routes_1 = __importDefault(require("./routes/persona.routes"));
const producto_routes_1 = __importDefault(require("./routes/producto.routes"));
const presupuesto_routes_1 = __importDefault(require("./routes/presupuesto.routes"));
const factura_routes_1 = __importDefault(require("./routes/factura.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)(config_1.config.cors));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/personas', persona_routes_1.default);
app.use('/api/productos', producto_routes_1.default);
app.use('/api/presupuestos', presupuesto_routes_1.default);
app.use('/api/facturas', factura_routes_1.default);
const error_1 = require("./middleware/error");
app.use(error_1.errorHandler);
app.listen(config_1.config.port, () => {
    console.log(`Servidor corriendo en el puerto ${config_1.config.port}`);
});
//# sourceMappingURL=index.js.map