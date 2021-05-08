import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ChallengeLocation } from './ChallengeLocation'
import { User } from './User'

@Entity('guesses')
class Guess {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    challengeLocationId: number

    @Column({ nullable: true })
    lat?: number

    @Column({ nullable: true })
    lng?: number

    @Column({ nullable: true })
    guessedBy?: number

    @CreateDateColumn()
    guessedAt: number
    
    @ManyToOne(() => ChallengeLocation)
    @JoinColumn({ name: 'challengeLocationId', referencedColumnName: 'id' })
    challengeLocation?: ChallengeLocation

    @ManyToOne(() => User)
    @JoinColumn({ name: 'guessedBy', referencedColumnName: 'id' })
    user?: User
    
}

export { Guess }
