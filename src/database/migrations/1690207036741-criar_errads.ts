import { MigrationInterface, QueryRunner } from "typeorm";

export class criarErrads1690207036741 implements MigrationInterface {
    name = 'criarErrads1690207036741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banco_dados"."errands" ("idErrands" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id_user" uuid NOT NULL, CONSTRAINT "PK_3e2e9052fb6bf87c5037b92b34d" PRIMARY KEY ("idErrands"))`);
        await queryRunner.query(`ALTER TABLE "banco_dados"."errands" ADD CONSTRAINT "FK_19f7b7d8bee8381e086980e4081" FOREIGN KEY ("id_user") REFERENCES "banco_dados"."user"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banco_dados"."errands" DROP CONSTRAINT "FK_19f7b7d8bee8381e086980e4081"`);
        await queryRunner.query(`DROP TABLE "banco_dados"."errands"`);
    }

}
