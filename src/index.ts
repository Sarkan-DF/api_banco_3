import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes";
import cors from "cors";
import "reflect-metadata";
import { Database } from "./main/config/database.conection";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/users", userRoutes());

Database.connect().then(() => {
  console.log("Database is connected!");

  app.listen(process.env.PORT, () => {
    console.log("Servidor rodando na porta " + process.env.PORT + "!");
  });
});
