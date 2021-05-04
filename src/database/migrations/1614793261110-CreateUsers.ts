import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1614793261110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'username', type: 'varchar' },
                    { name: 'password', type: 'varchar' },
                    { name: 'email', type: 'varchar' },
                    { name: 'isActive', type: 'boolean', default: false },
                    { name: 'createdAt', type: 'timestamp', isGenerated: true, default: 'NOW()' },
                    { name: 'updatedAt', type: 'timestamp', isNullable: true }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}
