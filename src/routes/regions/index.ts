import { Router } from 'express'
import RegionsController from '../../controllers/RegionsController'

const router = Router({ mergeParams: true })

router.get('/', RegionsController.find)

export default router
