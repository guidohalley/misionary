import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/misionary',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  frontendUrl: 'https://ad.misionary.com',
  // frontendUrldev:'http://localhost:5173'
};
