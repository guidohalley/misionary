"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !user.roles) {
                res.status(403).json({ error: 'Acceso denegado' });
                return;
            }
            const hasRole = user.roles.some((role) => roles.includes(role));
            if (!hasRole) {
                res.status(403).json({ error: 'No tienes los permisos necesarios' });
                return;
            }
            next();
        }
        catch (error) {
            res.status(500).json({ error: 'Error al verificar permisos' });
        }
    };
};
exports.checkRole = checkRole;
//# sourceMappingURL=checkRole.js.map