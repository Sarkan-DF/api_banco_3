import "reflect-metadata";
import { Database } from "./main/config/database.conection";
import { Server } from "./main/config/express.config";

Database.connect().then(() => {
  console.log("Database is connected!");

  const app = Server.create();
  Server.listen(app);
});
