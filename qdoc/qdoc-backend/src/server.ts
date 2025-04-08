import { initDB } from "./utils/db-connection";
import { Logger } from "./logger";
import app from "./app";

const port = process.env.API_PORT || 8010;

initDB()
  .catch((err) => Logger.error("Failed connecting to DB.", err));

app.listen(port, (): void => {
  Logger.info(`app running on port ${port}`);
});
