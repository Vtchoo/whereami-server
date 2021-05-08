import { Router } from 'express'
import guesses from '../guesses'

const router = Router({ mergeParams: true })

router.use('/:challengeLocationId/guesses', guesses)

export default router
