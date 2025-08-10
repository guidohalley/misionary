import { Router } from 'express'
import { auth } from '../middleware/auth'
import { checkRole } from '../middleware/checkRole'
import { postRecibo, getRecibos } from '../controllers/recibo.controller'

const router = Router()

router.use(auth)
router.get('/', getRecibos)
router.post('/', checkRole(['ADMIN']), postRecibo)

export default router
