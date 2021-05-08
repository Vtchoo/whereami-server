import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('regions')
class Region {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    name: string
}

export { Region }
