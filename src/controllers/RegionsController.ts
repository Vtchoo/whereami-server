import { NextFunction, Request, Response } from 'express'
import { getRegionsRepository } from '../repositories/RegionsRepository'

class RegionsController {

    static async find(req: Request, res: Response, next: NextFunction) {

        const {
            squares,
            polygons,
            ...query
        } = req.query

        const relations = []
        if (squares === '1') relations.push('squares')

        try {
            
            const [regions, count] = await getRegionsRepository().findAndCount({ where: query, relations })

            return res.json({ count, results: regions })

        } catch (error) {
            console.log(error)
            return res.error(500, 'Internal server error')
        }
    }
}

export default RegionsController
