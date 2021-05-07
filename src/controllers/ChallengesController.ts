import { NextFunction, Request, Response } from 'express'
import { ChallengeLocation } from '../models/ChallengeLocation'
import { Location } from '../models/Location'
import { getChallengesLocationsRepository } from '../repositories/ChallengeLocationsRepository'
import { getChallengesRepository } from '../repositories/ChallengesRepository'
import { getLocationsRepository } from '../repositories/LocationsRepository'

class ChallengesController {
    
    static async create(req: Request, res: Response, next: NextFunction) {

        const { ...challenge } = req.body
        let { locations } = req.body as { locations?: Location[] | number }

        try {
            const challengesRepository = getChallengesRepository()
            const locationsRepository = getLocationsRepository()
            const challengesLocationsRepository = getChallengesLocationsRepository()

            const [newChallenge] = challengesRepository.create([challenge])
            
            if (Array.isArray(locations)) {
                
                locations = locationsRepository.create(locations)
                await locationsRepository.save(locations)
            } else {

                locations = await locationsRepository
                    .createQueryBuilder()
                    .select()
                    .orderBy('RANDOM()')
                    .limit(locations ? locations <= 10 ? locations : 10 : 5)
                    .getMany()
            }
            

            const challengeLocations = challengesLocationsRepository.create(
                locations.map((location): ChallengeLocation => ({
                    challengeId: newChallenge.id,
                    locationId: location.id
                }))
            )

            await challengesLocationsRepository.save(challengeLocations)

            return res.json(newChallenge)

        } catch (error) {
            console.log(error)
            return res.error(500, 'Internal server error')
        }

    }

}

export default ChallengesController
