import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Region } from '../models/Region';

@EntityRepository(Region)
class RegionsRepository extends Repository<Region> {


}

function getRegionsRepository() {
    return getCustomRepository(RegionsRepository)
}

export { getRegionsRepository }
