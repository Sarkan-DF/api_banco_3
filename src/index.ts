import "reflect-metadata";
import { Database } from "./main/config/database.conection";
import { Server } from "./main/config/express.config";
import { CacheDatabase } from "./main/database/redis.connections";

Promise.all([Database.connect(), CacheDatabase.connect()]).then(() => {
  // console.log("Database is connected!");

  const app = Server.create();
  Server.listen(app);
});
