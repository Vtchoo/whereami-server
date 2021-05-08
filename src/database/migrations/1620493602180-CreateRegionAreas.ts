import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRegionAreas1620493602180 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'squares',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'regionId', type: 'int' },
                    { name: 'lat_max', type: 'double' },
                    { name: 'lng_max', type: 'double' },
                    { name: 'lat_min', type: 'double' },
                    { name: 'lng_min', type: 'double' }
                ],
                foreignKeys: [
                    {
                        name: 'FKsquare_region',
                        referencedTableName: 'regions',
                        referencedColumnNames: ['id'],
                        columnNames: ['regionId'],
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    }
                ]
            })
        )

        await queryRunner.createTable(
            new Table({
                name: 'polygons',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'regionId', type: 'int' }
                ],
                foreignKeys: [
                    {
                        name: 'FKpolygon_region',
                        referencedTableName: 'regions',
                        referencedColumnNames: ['id'],
                        columnNames: ['regionId'],
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    }
                ]
            })
        )

        await queryRunner.createTable(
            new Table({
                name: 'polygons_vertices',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'polygonId', type: 'int' }
                ],
                foreignKeys: [
                    {
                        name: 'FKvertex_polygon',
                        referencedTableName: 'polygons',
                        referencedColumnNames: ['id'],
                        columnNames: ['polygonId'],
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('polygons_vertices')
        await queryRunner.dropTable('polygons')
        await queryRunner.dropTable('squares')
    }

}
