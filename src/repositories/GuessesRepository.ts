import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Guess } from '../models/Guess';

@EntityRepository(Guess)
class GuessesRepository extends Repository<Guess> {


}

function getGuessesRepository() {
    return getCustomRepository(GuessesRepository)
}

export { getGuessesRepository }
