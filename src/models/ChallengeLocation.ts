import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('challenges_locations')
class ChallengeLocation {

    @PrimaryGeneratedColumn('increment')
    id?: number

    @Column()
    challengeId: number

    @Column()
    locationId: number
}

export { ChallengeLocation }