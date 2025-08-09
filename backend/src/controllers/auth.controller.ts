import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import prisma from '../config/prisma';
import { config } from '../config/config';
import { TipoPersona, RolUsuario } from '@prisma/client';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, nombre, tipo, roles } = req.body;

      const existingUser = await prisma.persona.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.persona.create({
        data: {
          email,
          password: hashedPassword,
          nombre,
          tipo: tipo as TipoPersona,
          roles: roles as RolUsuario[]
        }
      });

      const secret = config.jwtSecret as Secret;
      const expiresIn = config.jwtExpiresIn as SignOptions['expiresIn'];
      const token = jwt.sign(
        { id: user.id },
        secret,
        { expiresIn }
      );

  return res.status(201).json({ user, token });
    } catch (error) {
  return res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.persona.findUnique({
        where: { email }
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

  return res.json({ user, token });
    } catch (error) {
  return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }
}
