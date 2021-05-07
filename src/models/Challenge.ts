import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Location } from './Location'
import {v4 as uuid } from 'uuid'

@Entity('challenges')
class Challenge {
    
    @PrimaryGeneratedColumn('increment')
    id: number

    @Index({ unique: true })
    @Column()
    uuid: string

    @Column()
    time: number

    @Column()
    createdBy: number

    @CreateDateColumn()
    createdAt: Date

    @Column()
    expiresAt?: Date

    @ManyToMany(() => Location, location => location.challenges)
	@JoinTable({
		name: 'challenges_locations',
		joinColumn: {
			name: 'challengeId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'locationId',
			referencedColumnName: 'id',
		},
	})
    locations: Location[]

    constructor() {
        this.uuid = uuid()
    }
}

export { Challenge }
