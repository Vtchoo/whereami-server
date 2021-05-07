import { Router } from 'express'
import { ChallengesController } from '../../controllers'

const router = Router({ mergeParams: true })

router.post('/', ChallengesController.create)

export default router