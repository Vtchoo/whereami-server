import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Location } from "../models/Location";


@EntityRepository(Location)
class LocationsRepository extends Repository<Location> {


}

function getLocationsRepository() {
    return getCustomRepository(LocationsRepository)
}

export { getLocationsRepository }
