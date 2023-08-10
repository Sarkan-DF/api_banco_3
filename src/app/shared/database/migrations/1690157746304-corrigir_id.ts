import { MigrationInterface, QueryRunner } from "typeorm";

export class corrigirId1690157746304 implements MigrationInterface {
    name = 'corrigirId1690157746304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banco_dados"."user" RENAME COLUMN "id" TO "id_user"`);
        await queryRunner.query(`ALTER TABLE "banco_dados"."user" RENAME CONSTRAINT "PK_cace4a159ff9f2512dd42373760" TO "PK_9664961c0264d34a3cf82b11700"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banco_dados"."user" RENAME CONSTRAINT "PK_9664961c0264d34a3cf82b11700" TO "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "banco_dados"."user" RENAME COLUMN "id_user" TO "id"`);
    }

}
