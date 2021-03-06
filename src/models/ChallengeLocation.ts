import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Challenge } from './Challenge'
import { Guess } from './Guess'
import { Location } from './Location'

@Entity('challenges_locations')
class ChallengeLocation {

    @PrimaryGeneratedColumn('increment')
    id?: number

    @Column({ nullable: false })
    challengeId?: number

    @Column({ nullable: false })
    locationId?: number

    @ManyToOne(() => Challenge)
    @JoinColumn({ name: 'challengeId', referencedColumnName: 'id' })
    challenge?: Challenge

    @ManyToOne(() => Location)
    @JoinColumn({ name: 'locationId', referencedColumnName: 'id' })
    location?: Location

    @OneToMany(() => Guess, guess => guess.challengeLocation)
    guesses?: Guess[]
}

export { ChallengeLocation }