import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateChallenges1620344159986 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'challenges',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'uuid', type: 'varchar', isUnique: true },
                    { name: 'isPrivate', type: 'boolean', default: true },
                    { name: 'time', type: 'int', default: 2 * 60 },
                    { name: 'createdBy', type: 'int', isNullable: true },
                    { name: 'createdAt', type: 'timestamp', isGenerated: true, default: 'NOW()' },
                    { name: 'expiresAt', type: 'timestamp', isNullable: true }
                ],
                foreignKeys: [
                    {
                        name: 'FKchallenge_user',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['createdBy'],
                        onUpdate: 'SET NULL',
                        onDelete: 'SET NULL'
                    }
                ]
            })
        )

        await queryRunner.createTable(
            new Table({
                name: 'challenges_locations',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'challengeId', type: 'int' },
                    { name: 'locationId', type: 'int' }
                ],
                foreignKeys: [
                    {
                        name: 'FKchallengelocation_challenge',
                        referencedTableName: 'challenges',
                        referencedColumnNames: ['id'],
                        columnNames: ['challengeId'],
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE'
                    },
                    {
                        name: 'FKchallengelocation_location',
                        referencedTableName: 'locations',
                        referencedColumnNames: ['id'],
                        columnNames: ['locationId'],
                        onUpdate: 'RESTRICT',
                        onDelete: 'RESTRICT'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('challenges_locations')
        await queryRunner.dropTable('challenges')
    }

}
