import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CreateRegions1620421498687 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'regions',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'name', type: 'varchar' }
                ]
            })
        )

        await queryRunner.addColumn(
            'challenges',
            new TableColumn({ name: 'regionId', type: 'int', isNullable: true })
        )

        await queryRunner.createForeignKey(
            'challenges',
            new TableForeignKey({
                name: 'FKchallenge_region',
                referencedTableName: 'regions',
                referencedColumnNames: ['id'],
                columnNames: ['regionId'],
                onUpdate: 'SET NULL',
                onDelete: 'SET NULL',
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey('challenges', 'FKchallenge_region')
        await queryRunner.dropColumn('challenges', 'regionId')
        await queryRunner.dropTable('regions')
    }

}
