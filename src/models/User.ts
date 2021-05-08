import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm"

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

    constructor() {
        
    }
}

export { User }