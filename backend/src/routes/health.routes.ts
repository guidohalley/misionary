import { Router } from 'express';
import prisma from '../config/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { config } from '../config/config';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    // DB ping
    let dbOk = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {
      dbOk = false;
    }

    return res.json({
      status: 'ok',
      env: config.env,
      db: dbOk,
      time: new Date().toISOString(),
    });
  })
);

export default router;
