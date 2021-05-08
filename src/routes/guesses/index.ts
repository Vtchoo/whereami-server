import { Router } from 'express'
import { GuessesController } from '../../controllers'

const router = Router({ mergeParams: true })

router.post('/', GuessesController.submit)

export default router
