import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Challenge } from './Challenge'

@Entity('locations')
class Location {
    
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    @Index({ unique: true })
    pano: string

    @Column()
    lat: number

    @Column()
    lng: number

    @Column()
    description: string

    @Column()
    shortDescription: string

    @ManyToMany(() => Challenge, challenge => challenge.locations)
	@JoinTable({
		name: 'challenges_locations',
		joinColumn: {
			name: 'locationId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'challengeId',
			referencedColumnName: 'id',
		},
    })
    challenges: Challenge[]
}

export { Location }