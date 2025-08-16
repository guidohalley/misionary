import crypto from 'crypto';
import prisma from '../config/prisma';

export class AuthTokenService {
  static hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static async createToken(tipo: 'INVITE' | 'RESET', email?: string, personaId?: number | null, expiresInHours = 24) {
    const token = crypto.randomBytes(24).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const record = await prisma.authToken.create({
      data: {
        tipo: tipo as any,
        tokenHash,
        email: email || null,
        personaId: personaId ?? null,
        expiresAt
      }
    });

    return { token, record };
  }

  static async validateToken(rawToken: string, tipo: 'INVITE' | 'RESET') {
    const tokenHash = this.hashToken(rawToken);
    const now = new Date();
    const token = await prisma.authToken.findFirst({
      where: { tokenHash, tipo: tipo as any, usado: false, expiresAt: { gt: now } }
    });
    return token;
  }

  static async markUsed(id: number) {
    return prisma.authToken.update({ where: { id }, data: { usado: true } });
  }
}
