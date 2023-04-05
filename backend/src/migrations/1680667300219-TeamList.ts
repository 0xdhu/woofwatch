import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class TeamList1680667300219 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "team_list",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                    },
                    {
                        name: "ip_address",
                        type: "varchar",
                    },
                    {
                        name: "role",
                        type: "varchar",
                    },
                ],
            }),
            true,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "team_list"
        `);
    }

}
