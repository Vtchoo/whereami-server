import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Challenge } from '../models/Challenge'


@EntityRepository(Challenge)
class ChallengesRepository extends Repository<Challenge> {


}

function getChallengesRepository() {
    return getCustomRepository(ChallengesRepository)
}

export { getChallengesRepository }
