import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import prisma from '../config/prisma';
import { config } from '../config/config';
import { TipoPersona, RolUsuario } from '@prisma/client';
import { AuthTokenService } from '../services/authToken.service';
import { sendMail } from '../config/mailer';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, nombre, tipo, roles } = req.body;
      const normalizedEmail = (email || '').trim().toLowerCase();

      const existingUser = await prisma.persona.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.persona.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          nombre,
      tipo: tipo as TipoPersona,
      roles: (roles as RolUsuario[]) ?? []
        }
      });

      const secret = config.jwtSecret as Secret;
      const expiresIn = config.jwtExpiresIn as SignOptions['expiresIn'];
      const token = jwt.sign(
        { id: user.id },
        secret,
        { expiresIn }
      );

  const { password: _pwd, ...safeUser } = user as any;
  return res.status(201).json({ user: safeUser, token });
    } catch (error) {
  return res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const normalizedEmail = (email || '').trim().toLowerCase();

      const user = await prisma.persona.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } }
      });

      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      if (!user.password) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const secret = config.jwtSecret as Secret;
      const expiresIn = config.jwtExpiresIn as SignOptions['expiresIn'];
      const token = jwt.sign(
        { id: user.id },
        secret,
        { expiresIn }
      );

  const { password: _pwd, ...safeUser } = user as any;
  return res.json({ user: safeUser, token });
    } catch (error) {
  return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  // POST /api/auth/invite
  static async invite(req: Request, res: Response) {
    try {
      const currentUser = (req as any).user;
      if (!currentUser || !currentUser.roles.includes('ADMIN')) {
        return res.status(403).json({ error: 'Solo administradores pueden invitar usuarios' });
      }

      const { email, tipo, providerArea, providerRoles, personalNote, returnLinkOnly } = req.body;
      const normalizedEmail = (email || '').trim().toLowerCase();

      // Si solo quieren el link, no validamos el email
      if (!returnLinkOnly && !normalizedEmail) {
        return res.status(400).json({ error: 'Email es requerido' });
      }

      // Solo verificamos usuario existente si no es returnLinkOnly
      if (!returnLinkOnly) {
        const existingUser = await prisma.persona.findFirst({
          where: { email: { equals: normalizedEmail, mode: 'insensitive' } }
        });

        if (existingUser) {
          return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
        }
      }

      // Para returnLinkOnly, usamos un email temporal
      const emailToUse = returnLinkOnly ? `temp_${Date.now()}@misionary.com` : normalizedEmail;
      
      // Crear token asociado al email
      const { token, record } = await AuthTokenService.createToken('INVITE', emailToUse, null, 24);

      const acceptUrl = `${config.frontendUrl}/complete-provider-registration?token=${token}`;

      // Crear mensaje personalizado
      const personalMessage = personalNote ? `\n\n${personalNote}` : '';

      // Solo enviar email si no es returnLinkOnly
      if (!returnLinkOnly) {
        await sendMail({
          to: normalizedEmail,
          subject: 'Invitación a Misionary - Únete a nuestro equipo',
          text: `Has sido invitado a formar parte del equipo de Misionary. Completa tu registro en: ${acceptUrl}${personalMessage}`,
          html: `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #F2F2F2; padding: 32px;">
              <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #262626; font-size: 32px; font-weight: bold; margin: 0;">MISIONARY</h1>
                  <div style="height: 4px; background: linear-gradient(90deg, #E9FC87, #BCB4FF); margin: 8px auto; width: 100px; border-radius: 2px;"></div>
                </div>
                
                <h2 style="color: #262626; font-size: 24px; font-weight: 600; margin-bottom: 16px;">¡Bienvenido a nuestro equipo!</h2>
                
                <p style="color: #666666; line-height: 1.6; margin-bottom: 24px;">
                  Has sido invitado a formar parte del equipo de <strong>MISIONARY</strong> como proveedor. 
                  Estamos emocionados de tenerte con nosotros.
                </p>
                
                <p style="color: #666666; line-height: 1.6; margin-bottom: 32px;">
                  Para completar tu registro y configurar tu perfil, haz clic en el siguiente enlace:
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${acceptUrl}" style="display: inline-block; background: #E9FC87; color: #262626; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; border: 2px solid #262626; transition: all 0.3s;">
                    Completar Registro
                  </a>
                </div>
                
                ${personalNote ? `
                  <div style="margin: 32px 0; padding: 20px; background: #F9FFCC; border-left: 4px solid #E9FC87; border-radius: 6px;">
                    <h4 style="color: #262626; margin: 0 0 8px 0; font-size: 16px;">Mensaje personal:</h4>
                    <p style="color: #666666; margin: 0; line-height: 1.5;">${personalNote}</p>
                  </div>
                ` : ''}
                
                <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #E6E6E6;">
                  <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 0;">
                    <strong>Importante:</strong> Este enlace expirará en 24 horas por seguridad.
                  </p>
                  <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 8px 0 0 0;">
                    Si no solicitaste esta invitación, puedes ignorar este email.
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 24px;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} MISIONARY - Gestión Empresarial
                </p>
              </div>
            </div>
          `
        });

        return res.status(201).json({ 
          success: true, 
          message: 'Invitación enviada exitosamente',
          email: normalizedEmail
        });
      } else {
        // Si es returnLinkOnly, devolver solo el link
        return res.status(201).json({
          success: true,
          inviteUrl: acceptUrl
        });
      }
    } catch (error) {
      console.error('Error invite:', error);
      return res.status(500).json({ error: 'Error al generar invitación' });
    }
  }

  // GET /api/auth/invite/validate?token=...
  static async validateInvite(req: Request, res: Response) {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') return res.status(400).json({ error: 'Token requerido' });

      const record = await AuthTokenService.validateToken(token, 'INVITE');
      if (!record) return res.status(404).json({ error: 'Token inválido o expirado' });

      return res.json({ valid: true });
    } catch (error) {
      console.error('Error validateInvite:', error);
      return res.status(500).json({ error: 'Error al validar token' });
    }
  }

  // POST /api/auth/invite/accept
  static async acceptInvite(req: Request, res: Response) {
    try {
      const { token, nombre, password, providerArea, providerRoles } = req.body;
      if (!token || !password || !nombre) return res.status(400).json({ error: 'Datos incompletos' });

      const record = await AuthTokenService.validateToken(token, 'INVITE');
      if (!record) return res.status(400).json({ error: 'Token inválido o expirado' });

      if (!record.email) return res.status(400).json({ error: 'Token inválido' });

      // Verificar que no exista ya un usuario con ese email
      const existingUser = await prisma.persona.findFirst({
        where: { email: { equals: record.email, mode: 'insensitive' } }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
      }

      // Crear persona
      const hashedPassword = await bcrypt.hash(password, 10);
      const persona = await prisma.persona.create({
        data: {
          nombre,
          email: record.email,
          password: hashedPassword,
          tipo: 'PROVEEDOR' as any,
          roles: ['PROVEEDOR'] as any,
          esUsuario: true,
          providerArea: providerArea || null,
          providerRoles: providerRoles || []
        }
      });

      await AuthTokenService.markUsed(record.id);

      const secret = config.jwtSecret as Secret;
      const expiresIn = config.jwtExpiresIn as SignOptions['expiresIn'];
      const jwtToken = jwt.sign({ id: persona.id }, secret, { expiresIn });

      const { password: _pwd, ...safeUser } = persona as any;
      return res.status(201).json({ user: safeUser, token: jwtToken });
    } catch (error) {
      console.error('Error acceptInvite:', error);
      return res.status(500).json({ error: 'Error al aceptar invitación' });
    }
  }

  // POST /api/auth/invite/complete-provider
  static async completeProviderRegistration(req: Request, res: Response) {
    try {
      const { token, password, ...providerData } = req.body;
      if (!token || !password) return res.status(400).json({ error: 'Token y contraseña son requeridos' });

      const record = await AuthTokenService.validateToken(token, 'INVITE');
      if (!record) return res.status(400).json({ error: 'Token inválido o expirado' });

      if (!record.email) return res.status(400).json({ error: 'Token inválido' });

      // Verificar que no exista ya un usuario con ese email
      const existingUser = await prisma.persona.findFirst({
        where: { email: { equals: record.email, mode: 'insensitive' } }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
      }

      // Crear proveedor completo de una vez
      const hashedPassword = await bcrypt.hash(password, 10);
      const newProvider = await prisma.persona.create({
        data: {
          email: record.email,
          password: hashedPassword,
          tipo: 'PROVEEDOR' as any,
          roles: ['PROVEEDOR'] as any,
          esUsuario: true,
          ...providerData
        }
      });

      // Marcar token como usado
      await AuthTokenService.markUsed(record.id);

      const { password: _pwd, ...safeUser } = newProvider as any;
      return res.status(201).json({ 
        success: true, 
        message: 'Proveedor registrado exitosamente',
        user: safeUser 
      });
    } catch (error) {
      console.error('Error completeProviderRegistration:', error);
      return res.status(500).json({ error: 'Error al registrar proveedor' });
    }
  }
}
