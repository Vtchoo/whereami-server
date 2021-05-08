import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateGuesses1620487297627 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'guesses',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'challengeLocationId', type: 'int' },
                    { name: 'lat', type: 'double', isNullable: true },
                    { name: 'lng', type: 'double', isNullable: true },
                    { name: 'guessedBy', type: 'int', isNullable: true },
                    { name: 'guessedAt', type: 'timestamp', isGenerated: true, default: 'NOW()' }
                ],
                foreignKeys: [
                    {
                        name: 'FKguess_challengeLocation',
                        referencedTableName: 'challenges_locations',
                        referencedColumnNames: ['id'],
                        columnNames: ['challengeLocationId'],
                        onUpdate: 'RESTRICT',
                        onDelete: 'RESTRICT',
                    },
                    {
                        name: 'FKguess_user',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['guessedBy'],
                        onUpdate: 'SET NULL',
                        onDelete: 'SET NULL',
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('guesses')
    }

}
