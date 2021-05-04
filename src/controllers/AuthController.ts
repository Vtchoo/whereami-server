import { Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories'
import BruteForceProtection from '../system/BruteForceProtection'
import bcrypt from 'bcrypt'
import { SHA256 } from '../shared/CryptoUtils'
import Server from '../system/Server'
import Auth from '../system/Auth'
import * as Yup from 'yup'
import BcryptUtils from '../shared/BcryptUtils'
import ArrayUtils from '../shared/ArrayUtils'

import { getUsersRepository } from '../repositories/UsersRepository'

class AuthController {

    static async Login(req: Request, res: Response, next: NextFunction) {

        const { ip } = req
        const ipStatus = BruteForceProtection.getIpStatus(ip)

        if (!ipStatus.isAllowed) return res.error(403, `Muitas tentativas de login, espere ${ipStatus.wait} segundos e tente novamente`, { wait: ipStatus.wait })

        const { username, password } = req.body

        if (!username || !password) return res.error(400, 'Usuário ou senha não informados')

        try {
            
            const usersRepository = getUsersRepository()

            const result = await usersRepository.createQueryBuilder('u')
                .addSelect('u.password')

                // Needs update to MariaDB 10.5.0+
                // .leftJoin('u.permissions', 'p')
                // .addSelect('JSON_ARRAYAGG(p.code)', 'permissions')

                .where("u.username = :username", { username })
                .getOne()

            if (!result) return res.error(404, 'Usuário não encontrado')
            
            const { password: hashedPassword, ...user } = result
            
            if(!user.isActive) return res.error(401, 'Este usuário não está ativo')

            const matches = await bcrypt.compare(SHA256(password), hashedPassword)

            if (!matches) {
                BruteForceProtection.registerFailedAttempt(ip)
                Server.logAction(username, `Unsuccessful login attempt`)
                return res.error(401, 'Senha incorreta')
            }
            
            BruteForceProtection.resetIpStatus(ip)

            const token = Auth.generateAccessToken({}, { expiresIn: Auth.ACCESS_TOKEN_EXPIRE_TIME, subject: `${user.id}` })
            const refreshToken = Auth.generateRefreshToken({}, { expiresIn: Auth.REFRESH_TOKEN_EXPIRE_TIME, subject: `${user.id}` })

            Auth.scheduleRevoke(refreshToken)

            //res.cookie('authorization', token, { httpOnly: true, sameSite: true })

            Server.logAction(user.username, `Logged in`)


            return res.status(200).json({ user, token, refreshToken })

        } catch (error) {
            
            console.log(error)
            return res.sendStatus(500)
        }
    }

    static async SignUp(req: Request, res: Response, next: NextFunction) {

        const data = { ...req.body }

        // if (!data.username || !data.password || !data.firstName) return res.status(400).json({ error: 'Incomplete data' })

        try {
            
            const schema = Yup.object().shape({
                username: Yup.string().required('Username required'),
                password: Yup.string().required('Password required').min(6, 'Password must be at least 6 characters long')
            })
            
            await schema.validate(data)

            const usersRepository = getCustomRepository(UsersRepository)
        
            // In order to perform an OR select, pass an array to the where property to findOne or find
            const userAreadyExists = await usersRepository.findOne({ username: data.username })

            if (userAreadyExists) return res.error(409, 'This user already exists')

            const [user] = usersRepository.create([data])
            
            // Encrypt password using bcrypt
            user.password = await BcryptUtils.getHashedString(SHA256(user.password))

            const { password, ...result } = await usersRepository.save(user)

            Server.logAction(req.user?.username || user.username, 'New account created')
            
            return res.json(result)

        } catch (error) {

            if (error instanceof Yup.ValidationError) return res.status(400).json(error)

            console.log(error)
            return res.sendStatus(500)
        }
    }

    static async Logout(req: Request, res: Response, next: NextFunction) {

        const { refreshToken } = req.body

        const { user } = req

        Auth.revoke(refreshToken)

        Server.logAction(user.username, 'Logout')

        res.sendStatus(200)
    }

    static async Refresh(req: Request, res: Response, next: NextFunction) {

        const { refreshToken } = req.body

        const { user } = req

        const { user: fetchUser } = req.query

        try {

            const token = Auth.generateAccessToken({}, { expiresIn: Auth.ACCESS_TOKEN_EXPIRE_TIME, subject: `${user.id}` })

            const result: { token: string, refreshToken: string, user?: any } = { token, refreshToken }

            if (fetchUser) {
                result.user = user
            }

            Auth.scheduleRevoke(refreshToken)

            Server.logAction(user.username, 'Refresh')

            return res.json(result)

        } catch (error) {

            console.log(error)
            return res.sendStatus(500)
        }
    }
}

export default AuthController