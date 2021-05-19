import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUserLocationsTable1621166863695 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users_locations',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'userId', type: 'int' },
                    { name: 'locationId', type: 'int' }
                ],
                foreignKeys: [
                    {
                        name: 'FKuser_locations_user',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['userId'],
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    },
                    {
                        name: 'FKuser_locations_location',
                        referencedTableName: 'locations',
                        referencedColumnNames: ['id'],
                        columnNames: ['locationId'],
                        onUpdate: 'RESTRICT',
                        onDelete: 'RESTRICT',
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users_locations')
    }

}
