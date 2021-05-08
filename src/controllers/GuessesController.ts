import { NextFunction, Request, Response } from 'express'
import { getChallengesLocationsRepository } from '../repositories/ChallengeLocationsRepository'
import { getGuessesRepository } from '../repositories/GuessesRepository'

class GuessesController {

    static async submit(req: Request, res: Response, next: NextFunction) {

        const key = req.params.challengeKey || req.body.challengeKey
        const challengeLocationId = parseInt(req.params.challengeLocationId || req.body.challengeLocationId)

        if (!key) return res.error(400, 'No challenge key supplied')
        if (!challengeLocationId) return res.error(400, 'No challenge location supplied')

        const { ...guess } = req.body

        try {
            
            const challengeLocationsRepository = getChallengesLocationsRepository()

            const [challengeLocation] = await challengeLocationsRepository.findByIds([challengeLocationId], { relations: ['challenge'] })

            if (!challengeLocationId) return res.error(404, 'Challenge location not found')
            
            if (!challengeLocation.challenge?.key === key) return res.error(403, 'This round does not belong to the challenge supplied')
            
            const guessesRepository = getGuessesRepository()

            const existingGuess = await guessesRepository.count({ where: { challengeLocationId, guessedBy: req.user.id } })

            if (!existingGuess) return res.error(403, 'Double guess detected')
            
            const newGuess = guessesRepository.create([{ ...guess, challengeLocationId }])

            await guessesRepository.save(newGuess)

            return res.json(newGuess)

        } catch (error) {
            console.log(error)
            return res.error(500, 'Internal server error')
        }
    }
}

export default GuessesController
