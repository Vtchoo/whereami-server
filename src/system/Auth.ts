import { User } from '../models/User'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories'
import { v4 as uuid } from 'uuid'

declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}

class Auth {

    static readonly ACCESS_TOKEN_EXPIRE_TIME = '1h'
    static readonly REFRESH_TOKEN_EXPIRE_TIME = '12h'
    static readonly INACTIVITY_TIME = 3 * 60 * 60 * 1000    // 3 hours

    /**
     * List of revoked refresh tokens
     */
    static revokedTokens: { [id: string]: { token: string, exp: Date } } = {}
    static scheduledRevoke: { [token: string]: NodeJS.Timeout } = {}

    static expiredTokenCleanUp = setInterval(() => {

        for (const jwtid in Auth.revokedTokens) {
            
            const token = Auth.revokedTokens[jwtid]

            if (token.exp < new Date())
                delete Auth.revokedTokens[jwtid]
        }

    }, 60 * 60 * 1000)

    /**
     * Generate new access token
     * @param payload Token's payload
     * @param options jwt sign options
     * @returns New access token
     */
    static generateAccessToken(payload: string | object | Buffer, options?: jwt.SignOptions) {
        
        const secret = process.env.JWT_ACCESS_SECRET
        if (!secret) throw new Error('\x1b[31mWARNING! JWT SECRET NOT DEFINED ON .env FILE.\nSET SECRET USING JWT_ACCESS_SECRET VARIABLE.\x1b[0m')
        
        return jwt.sign(payload, secret, options)
    }
    
    /**
     * Generate new refresh token
     * @param payload Token's payload
     * @param options jwt sign options
     * @returns New refresh token
     */
    static generateRefreshToken(payload: string | object | Buffer, options?: jwt.SignOptions) {
        
        const secret = process.env.JWT_REFRESH_SECRET
        if (!secret) throw new Error('\x1b[31mWARNING! JWT SECRET NOT DEFINED ON .env FILE.\nSET SECRET USING JWT_REFRESH_SECRET VARIABLE.\x1b[0m')
        
        return jwt.sign(payload, secret, { ...options, jwtid: uuid() })
    }

    static async verifyRefresh(req: Request, res: Response, next: NextFunction) {
        
        const { refreshToken } = req.body

        if (!refreshToken) return res.error(400, 'Nenhum token fornecido')
        
        try {
            
            const secret = process.env.JWT_REFRESH_SECRET
            if (!secret) throw new Error('\x1b[31mERROR! JWT SECRET NOT DEFINED ON .env FILE.\nSET SECRET USING JWT_SECRET VARIABLE.\x1b[0m')

            const decode = jwt.verify(refreshToken, secret)
            const tokenPayload = typeof decode === 'string' ? JSON.parse(decode) : decode
            const { sub, jti } = tokenPayload

            // Check if token can be identified
            if(!jti) return res.error(400, 'Token inválido')

            // Check if token is listed as revoked
            if (Auth.revokedTokens[jti]) return res.error(400, 'Token inválido')

            // Get user info from database
            const usersRepository = getCustomRepository(UsersRepository)
            const user = await usersRepository.findById(sub, { relations: ['permissions', 'profiles', 'profiles.permissions'] })

            if (!user) return res.error(404, 'Usuário informado não é válido')
            
            if (!user.isActive) return res.error(401, 'Este usuário não está ativo')
            
            // Pass user info to next routes
            req.user = user
    
            next()

        } catch (error) {
            
            if (error instanceof TokenExpiredError) return res.error(403, 'Token expirado')
            if (error instanceof JsonWebTokenError) return res.error(400, 'Token inválido')

            console.log(error)
            return res.sendStatus(500)
        }
    }

    static async verifyAccess (req: Request, res: Response, next: NextFunction) {
        
        // Needs cookie parser to work
        // const { authorization } = req.cookie

        // No need for cookie parser when using header
        const { authorization } = req.headers
        
        if (!authorization) return res.status(401).json({ error: 'Nenhuma credencial informada' })

        const [method, token] = authorization.split(' ')

        if (!token) return res.status(401).json({ error: 'Nenhuma credencial informada' })
        
        try {
    
            const secret = process.env.JWT_ACCESS_SECRET
            if (!secret) throw new Error('\x1b[31mERROR! JWT SECRET NOT DEFINED ON .env FILE.\nSET SECRET USING JWT_SECRET VARIABLE.\x1b[0m')

            // Decode jwt and get user id
            const decode = jwt.verify(token, secret)
            const tokenPayload = typeof decode === 'string' ? JSON.parse(decode) : decode
            const { sub } = tokenPayload

            // Get user info from database
            const usersRepository = getCustomRepository(UsersRepository)
            const user = await usersRepository.findById(sub, { relations: ['permissions', 'profiles', 'profiles.permissions'] })

            if (!user) return res.error(404, 'Usuário informado no token é inválido')
            
            if (!user.isActive) return res.error(401, 'Este usuário não está ativo')
            
            // Pass user info to next routes
            req.user = user
    
            next()
            
        } catch (error) {

            if (error instanceof TokenExpiredError) return res.error(403, 'Token expirado')
            if (error instanceof JsonWebTokenError) return res.error(400, 'Token inválido')

            console.log(error)
            return res.sendStatus(500)
        }
    }

    static cancelScheduledRevoke(token: string) {

        const decode = jwt.decode(token)

        const payload = typeof decode === 'string' ? JSON.parse(decode) : decode
        if (!payload) return

        const { jti } = payload
        
        clearTimeout(Auth.scheduledRevoke[jti])
        delete Auth.scheduledRevoke[jti]
        // console.log(`cancelled scheduled revoke of token ${jti}`)
    }

    static scheduleRevoke(token: string) {

        const decode = jwt.decode(token)

        const payload = typeof decode === 'string' ? JSON.parse(decode) : decode
        if (!payload) return

        const { jti } = payload

        if (Auth.scheduledRevoke[jti]) {
            Auth.cancelScheduledRevoke(token)
        }

        Auth.scheduledRevoke[jti] = setTimeout(() => {
            Auth.revoke(token)
            // console.log(`revoked token ${jti} for inactivity`)
        }, Auth.INACTIVITY_TIME)

        // console.log(`scheduled revoke of token ${jti}`)
    }

    static revoke(token: string) {

        const decode = jwt.decode(token)

        const payload = typeof decode === 'string' ? JSON.parse(decode) : decode
        if (!payload) return
        
        const { jti, exp } = payload
        
        Auth.revokedTokens[jti] = { token, exp: new Date(exp * 1000) }
        
        if (Auth.scheduledRevoke[jti]) {
            Auth.cancelScheduledRevoke(token)
        }
        // const scheduleCleanupTime = exp * 1000 - new Date().getTime()

        // setTimeout(() => {
        //     // Clean up revoked token
        //     delete Auth.revokedTokens[jti]
        // }, scheduleCleanupTime);
    }
}

export default Auth