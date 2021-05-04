import { Router } from 'express'
import { AuthController, UsersController } from '../controllers'
import Auth from '../system/Auth'

import users from './users'

const router = Router({ mergeParams: true })

router.post('/login', AuthController.Login)

router.post('/signup', AuthController.SignUp)

router.post('/refresh', Auth.verifyRefresh, AuthController.Refresh)

router.post('/logout', Auth.verifyRefresh, AuthController.Logout)

router.get('/verify', UsersController.verify)

router.use(Auth.verifyAccess)

router.use('/users', users)



export default router