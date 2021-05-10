import { NextFunction, Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { UsersRepository } from "../repositories"
import Server from '../system/Server'
import * as Yup from 'yup'
import { getUsersRepository } from "../repositories/UsersRepository"

class UsersController {

    static async verify(req: Request, res: Response, next: NextFunction) {

        const { username } = req.query

        if (!username) return res.error(400, 'No username informed')
        
        try {
            
            const usersRepository = getUsersRepository()

            const [users, count] = await usersRepository.findAndCount({ where: { username } })
            
            return res.json({ count })

        } catch (error) {

            console.log(error)
            return res.sendStatus(500)
        }
    }

    static async Find(req: Request, res: Response, next: NextFunction) {
        
        const { password, ids, ...query } = req.query

        const userIds = String(ids)

        try {
            
            const usersRepository = getCustomRepository(UsersRepository)
    
            let users
            if(!ids)
                users = await usersRepository.find({ where: query/*, relations: ['permissions'] */ })
            else
                users = await usersRepository.findByIds(userIds.split(','))
            
            return res.json(users)
            
        } catch (error) {

            console.log(error)
            return res.sendStatus(500)
        }
    }

    static async FindById(req: Request, res: Response, next: NextFunction) {
        
        const id = parseInt(req.params.userId)

        if(!id) return res.error(400, 'Id de usuário inválido')

        // const { relation } = req.query
        // const relations = relation ? (Array.isArray(relation) ? <string[]>relation : [relation as string]) : undefined

        // console.log(relations)

        try {
            
            const usersRepository = getCustomRepository(UsersRepository)
    
            const user = await usersRepository.findOne({ id }, { relations: ['permissions', 'profiles', 'profiles.permissions'] })

            if(!user) return res.status(404).json({ error: 'Usuário não encontrado' })

            return res.json(user)

        } catch (error) {

            console.log(error)
            return res.sendStatus(500)
        }
    }

    

    static async Edit(req: Request, res: Response, next: NextFunction) {

        const userId = parseInt(req.params.userId)

        if (!userId) return res.error(400, 'Id de usuário inválido')

        // Remove password to allow password editing
        const { password, ...data } = req.body

        try {
            
            const userRepository = getCustomRepository(UsersRepository)
            
            const user = await userRepository.findOne(userId)
            
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
            
            const editedUser = userRepository.merge(user, data)
            
            const schema = Yup.object().shape({
                username: Yup.string().required('Usuário requerido'),
                password: Yup.string().required('Senha requerida').min(6, 'A senha deve conter pelo menos 6 caracteres'),
                firstName: Yup.string().required('Primeiro nome requerido')
            })
            
            await schema.validate(editedUser)
            
            // Uncomment to allow password editing
            // if (data.password)
            //     editedUser.password = await BcryptUtils.getHashedString(SHA256(data.password))

            const results = await userRepository.save(editedUser)
            
            Server.logAction(req.user.username, `Users > ${user.id} > Edit`)

            return res.json(editedUser)
            
        } catch (error) {

            if (error instanceof Yup.ValidationError) return res.status(400).json(error)

            console.log(error)
            return res.sendStatus(500)
        }
    }

    static async Delete(req: Request, res: Response, next: NextFunction) {

        const userId = parseInt(req.params.userId)

        if (!userId) return res.status(400).json({ error: 'Id de usuário inválido' })

        try {

            const usersRepository = getCustomRepository(UsersRepository)

            const user = await usersRepository.findOne(userId)

            if (!user) return res.error(404, 'Usuário não encontrado')
            
            const result = await usersRepository.delete(userId)

            Server.logAction(req.user.username, `Users > ${user.id} > Delete`)

            return res.sendStatus(200)

        } catch (error) {
            
            console.log(error)
            return res.sendStatus(500)
        }
    }

    static async toggleActive(req: Request, res: Response, next: NextFunction) {

        const userId = parseInt(req.params.userId)

        if (!userId) return res.status(400).json({ error: 'Id de usuário inválido' })

        if (userId === req.user.id) return res.error(409, `Você não pode se auto ativar ou desativar`)

        try {
            
            const usersRepository = getCustomRepository(UsersRepository)

            const user = await usersRepository.findOne(userId)

            if (!user) return res.error(404, 'Usuário não encontrado')

            user.isActive = !user.isActive

            const result = usersRepository.save(user)

            Server.logAction(req.user.username, `Users > ${user.id} > ${user.isActive ? 'Activate' : 'Deactivate'}`)

            return res.status(200).json(user)

        } catch (error) {
            
            console.log(error)
            return res.sendStatus(500)
        }
    }

}

export default UsersController