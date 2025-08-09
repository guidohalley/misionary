"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const empresa_service_1 = require("./empresa.service");
class PersonaService {
    static async create(data) {
        return prisma_1.default.persona.create({
            data
        });
    }
    static async findById(id) {
        return prisma_1.default.persona.findUnique({
            where: { id },
            include: {
                productos: true,
                servicios: true,
                presupuestos: true,
                recibos: true
            }
        });
    }
    static async findByEmail(email) {
        return prisma_1.default.persona.findUnique({
            where: { email }
        });
    }
    static async update(id, data) {
        console.log('PersonaService.update - ID:', id, 'Data:', data);
        const result = await prisma_1.default.persona.update({
            where: { id },
            data
        });
        console.log('PersonaService.update - Result:', result);
        return result;
    }
    static async delete(id) {
        return prisma_1.default.persona.delete({
            where: { id }
        });
    }
    static async findAll(tipo) {
        const where = tipo ? { tipo } : {};
        return prisma_1.default.persona.findMany({
            where,
            include: {
                productos: true,
                servicios: true,
                empresas: true
            }
        });
    }
    static async createClienteWithEmpresa(clienteData, empresaData) {
        const cliente = await prisma_1.default.persona.create({
            data: clienteData
        });
        if (empresaData) {
            const empresa = await empresa_service_1.EmpresaService.create({
                ...empresaData,
                clienteId: cliente.id
            });
            return {
                cliente,
                empresa
            };
        }
        return { cliente };
    }
}
exports.PersonaService = PersonaService;
//# sourceMappingURL=persona.service.js.map