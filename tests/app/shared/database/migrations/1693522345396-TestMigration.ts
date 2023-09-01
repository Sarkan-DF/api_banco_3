import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration1693522345396 implements MigrationInterface {
    name = 'TestMigration1693522345396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id_user" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "errands" ("idErrands" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_errands" ("idErrands" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL, CONSTRAINT "FK_19f7b7d8bee8381e086980e4081" FOREIGN KEY ("id_user") REFERENCES "user" ("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_errands"("idErrands", "title", "description", "created_at", "updated_at", "id_user") SELECT "idErrands", "title", "description", "created_at", "updated_at", "id_user" FROM "errands"`);
        await queryRunner.query(`DROP TABLE "errands"`);
        await queryRunner.query(`ALTER TABLE "temporary_errands" RENAME TO "errands"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "errands" RENAME TO "temporary_errands"`);
        await queryRunner.query(`CREATE TABLE "errands" ("idErrands" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "errands"("idErrands", "title", "description", "created_at", "updated_at", "id_user") SELECT "idErrands", "title", "description", "created_at", "updated_at", "id_user" FROM "temporary_errands"`);
        await queryRunner.query(`DROP TABLE "temporary_errands"`);
        await queryRunner.query(`DROP TABLE "errands"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
