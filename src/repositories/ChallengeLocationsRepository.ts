import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { ChallengeLocation } from '../models/ChallengeLocation';

@EntityRepository(ChallengeLocation)
class ChallengesLocationsRepository extends Repository<ChallengeLocation> {


}

function getChallengesLocationsRepository() {
    return getCustomRepository(ChallengesLocationsRepository)
}

export { getChallengesLocationsRepository }
