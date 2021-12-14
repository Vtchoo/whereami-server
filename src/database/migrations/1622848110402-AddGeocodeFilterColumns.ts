import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddGeocodeFilterColumns1622848110402 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(
            'regions',
            [
                new TableColumn({
                    name: 'regionType', type: 'varchar', isNullable: true
                }),
                new TableColumn({
                    name: 'regionCode', type: 'varchar', isNullable: true
                })
            ]
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('regions', 'regionType')
        await queryRunner.dropColumn('regions', 'regionCode')
    }

}
