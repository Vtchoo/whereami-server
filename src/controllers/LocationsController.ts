import { NextFunction, Request, Response } from 'express'
import { getUsersRepository } from '../repositories/UsersRepository'

class LocationsController {

    static async myLocations(req: Request, res: Response, next: NextFunction) {

        const { id } = req.user

        if (!id)
            return res.error(400, 'Invalid user')
        
        try {

            const locations = await getUsersRepository()
                .createQueryBuilder()
                .relation('locations')
                .of(id)
                .loadMany()
            
            return res.json({ results: locations })
            
        } catch (error) {
            console.log(error)
            return res.error(500, 'Internal server error')
        }
    }
    
}

export default LocationsController
