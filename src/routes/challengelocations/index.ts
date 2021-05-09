import { Router } from 'express'
import { ChallengeLocationsController } from '../../controllers'
import guesses from '../guesses'

const router = Router({ mergeParams: true })

router.use('/:challengeLocationId/guesses', guesses)

router.get('/:challengeLocationId', ChallengeLocationsController.findById)

export default router
