import { Router } from 'express'
import { UsersController } from '../../controllers'

const router = Router({ mergeParams: true })

router.get('/', UsersController.Find)

// router.post('/', UsersController.Create)

router.get('/:userId', UsersController.FindById)

router.put('/:userId', UsersController.Edit)

router.delete('/:userId', UsersController.Delete)

router.patch('/:userId/toggleactive', UsersController.toggleActive)

export default router