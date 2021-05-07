import { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { ChallengeLocation } from '../models/ChallengeLocation'
import { Location } from '../models/Location'
import { getChallengesLocationsRepository } from '../repositories/ChallengeLocationsRepository'
import { getChallengesRepository } from '../repositories/ChallengesRepository'
import { getLocationsRepository } from '../repositories/LocationsRepository'

class ChallengesController {
    
    static async create(req: Request, res: Response, next: NextFunction) {

        const { locations: _, ...challenge } = req.body
        let { locations } = req.body as { locations?: Location[] | number }

        try {
            const challengesRepository = getChallengesRepository()
            const locationsRepository = getLocationsRepository()
            const challengesLocationsRepository = getChallengesLocationsRepository()

            const [newChallenge] = challengesRepository.create([challenge])
            newChallenge.createdBy = req.user.id
            
            let existingChallenge
            do {

                // Generates unique identifier for the challenge
                // use smaller string if needed
                newChallenge.uuid = uuid()

                existingChallenge = await challengesRepository.findOne({ where: { uuid: newChallenge.uuid } })

            } while (existingChallenge);

            await challengesRepository.save(newChallenge)

            if (Array.isArray(locations)) {
                
                locations = locationsRepository.create(locations)
                await locationsRepository.save(locations)
            } else {

                locations = await locationsRepository
                    .createQueryBuilder()
                    .select()
                    .orderBy('RAND()')
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
