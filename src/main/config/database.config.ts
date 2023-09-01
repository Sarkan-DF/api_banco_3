import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { type } from "os";

dotenv.config();

let config = new DataSource({
  type: "postgres",
  port: 8080,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  url: process.env.DB_URL,

  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  schema: "banco_dados",
  entities: ["src/app/shared/database/entities/**/*.ts"],
  migrations: ["src/app/shared/database/migrations/**/*.ts"],
});

if (process.env.DB_ENV === "test") {
  config = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    synchronize: false,
    entities: ["src/app/shared/database/entities/**/*.ts"],
    migrations: ["tests/app/shared/database/migrations/**/*.ts"],
  });
}

export default config;
