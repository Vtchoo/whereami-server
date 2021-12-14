import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Region } from './Region'

@Entity('squares')
class Square {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    regionId: number

    @Column({ name: 'lat_max' })
    maxLat: number

    @Column({ name: 'lat_min' })
    minLat: number

    @Column({ name: 'lng_max' })
    maxLng: number

    @Column({ name: 'lng_min' })
    minLng: number

    @ManyToOne(() => Region)
    @JoinColumn({ name: 'regionId', referencedColumnName: 'id' })
    region: Region
}

export { Square }
