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
                newChallenge.key = uuid()

                existingChallenge = await challengesRepository.findOne({ where: { key: newChallenge.key } })

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

    static async findByKey(req: Request, res: Response, next: NextFunction) {

        const { challengeKey: key } = req.params
        const { pregame, guesses, guessuser } = req.query

        if (!key) return res.error(400, 'Invalid challenge key')

        const relations = ['region', 'challengeLocations', 'challengeLocations.location']
        if (guesses) relations.push('challengeLocations.guesses')
        if (guessuser) relations.push('challengeLocations.guesses.user')

        try {
            
            const challengesRepository = getChallengesRepository()

            const challenge = await challengesRepository.findOne({ where: { key }, relations })

            if (!challenge) return res.error(404, 'Challenge not found')

            if (pregame)
                challenge.challengeLocations = challenge.challengeLocations.map(challengeLocation => (
                    {
                        id: challengeLocation.id,
                        location: { pano: challengeLocation.location?.pano || '' }
                    }
                ))
            // const { challengeLocations, ...challenge } = foundChallenge

            // const hiddenLocations = pregame ? challengeLocations.map(cl => ({
            //     id: cl.id,
            //     location: {
            //         pano: cl.location?.pano
            //     }
            // })) : challengeLocations

            return res.json(challenge)

        } catch (error) {
            console.log(error)
            return res.error(500, 'Internal server error')
        }
    }
}

export default ChallengesController
