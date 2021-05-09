import { NextFunction, Request, Response } from 'express'
import { getChallengesLocationsRepository } from '../repositories/ChallengeLocationsRepository'

class ChallengeLocationsController {

    static async findById(req: Request, res: Response, next: NextFunction) {

        const id = parseInt(req.params.challengeLocationId)

        if (!id) return res.error(400, 'Invalid challenge location id')
        
        const { guesses, location, ...query } = req.query

        const relations = []
        if (guesses) relations.push('guesses', 'guesses.user')
        if (location) relations.push('location')

        try {
            
            const [challengeLocation] = await getChallengesLocationsRepository()
                .findByIds([id], { relations })

            if (!challengeLocation) return res.error(404, 'Challenge location not found')
            
            return res.json(challengeLocation)

        } catch (error) {
            console.log(error)
            return res.error(500, 'Internal server error')
        }
    }
}

export default ChallengeLocationsController
