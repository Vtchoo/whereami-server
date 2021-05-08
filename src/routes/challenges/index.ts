import { Router } from 'express'
import { ChallengesController } from '../../controllers'
import challengeLocations from '../challengelocations'

const router = Router({ mergeParams: true })

router.post('/', ChallengesController.create)

router.get('/:challengeKey', ChallengesController.findByKey)

router.use('/:challengeKey/challengelocations', challengeLocations)

export default router