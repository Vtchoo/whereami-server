import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm"
import { Location } from "./Location"

@Entity('users')
class User {
    
    @PrimaryGeneratedColumn('increment')
    readonly id: number

    @Column()
    username: string

    // In order to select password column on login, use queryBuilder with .addSelect()
    @Column({ select: false })
    password: string

	@Column({ select: false })
	email: string

    @Column({ insert: false })
    isActive: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToMany(() => Location, location => location.users)
    @JoinTable({
        name: 'users_locations',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'locationId',
            referencedColumnName: 'id'
        }
    })
    locations: Location[]

    constructor() {
        
    }
}

export { User }