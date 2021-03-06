import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Location } from './Location'
import {v4 as uuid } from 'uuid'
import { ChallengeLocation } from './ChallengeLocation'
import { Region } from './Region'

@Entity('challenges')
class Challenge {
    
    @PrimaryGeneratedColumn('increment')
    id: number

    @Index({ unique: true })
    @Column({ name: 'challengeKey' })
    key: string

    @Column({ nullable: true })
    regionId?: number

    @Column()
    time: number

    @Column()
    createdBy: number

    @CreateDateColumn()
    createdAt: Date

    @Column()
    expiresAt?: Date

    @OneToMany(() => ChallengeLocation, challengeLocation => challengeLocation.challenge)
    challengeLocations: ChallengeLocation[]
    
    @ManyToOne(() => Region)
    @JoinColumn({ name: 'regionId', referencedColumnName: 'id' })
    region?: Region

    // @ManyToMany(() => Location, location => location.challenges)
	// @JoinTable({
	// 	name: 'challenges_locations',
	// 	joinColumn: {
	// 		name: 'challengeId',
	// 		referencedColumnName: 'id',
	// 	},
	// 	inverseJoinColumn: {
	// 		name: 'locationId',
	// 		referencedColumnName: 'id',
	// 	},
	// })
    // locations: Location[]

}

export { Challenge }
