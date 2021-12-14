import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Square } from './Square'

@Entity('regions')
class Region {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    name: string

    @Column()
    regionType?: string

    @Column()
    regionCode?: string

    @OneToMany(() => Square, square => square.region)
    squares: Square[]
}

export { Region }
