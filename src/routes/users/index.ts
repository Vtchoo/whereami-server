import { Router } from 'express'
import { LocationsController, UsersController } from '../../controllers'

import locations from '../locations'

const router = Router({ mergeParams: true })

router.get('/', UsersController.Find)

router.use('/locations', LocationsController.myLocations)
// router.post('/', UsersController.Create)

router.get('/:userId', UsersController.FindById)

router.put('/:userId', UsersController.Edit)

router.delete('/:userId', UsersController.Delete)

router.patch('/:userId/toggleactive', UsersController.toggleActive)


export default router