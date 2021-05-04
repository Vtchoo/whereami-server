import { EntityRepository, FindManyOptions, getCustomRepository, getRepository, Repository } from "typeorm";
import { User } from "../models/User";

//export default () => getRepository(User)

@EntityRepository(User)
class UsersRepository extends Repository<User> {

    async findById(id: number, options?: FindManyOptions<User>) {

        const [user] = await this.findByIds([id], options)

        return user
    }

}

function getUsersRepository() {
    return getCustomRepository(UsersRepository)
}

export default UsersRepository
export { getUsersRepository }