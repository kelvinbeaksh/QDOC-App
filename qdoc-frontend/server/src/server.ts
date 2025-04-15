import express from "express";
import path from "path";

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.set("port", 8080);
app.listen(app.get("port"), () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server listening on port ${app.get("port")}!`);
});
