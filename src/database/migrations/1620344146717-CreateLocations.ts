import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateLocations1620344146717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'locations',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'pano', type: 'varchar', isUnique: true },
                    { name: 'description', type: 'varchar' },
                    { name: 'shortDescription', type: 'varchar' },
                    { name: 'lat', type: 'double' },
                    { name: 'lng', type: 'double' }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('locations')
    }

}
