import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const { Server } = require("@tus/server");
const { GCSStore } = require("@tus/gcs-store");

const { Storage } = require("@google-cloud/storage");

// const cors = require("cors");
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const uploadApp = express();
const storage = new Storage({ keyFilename: "key.json" });

const server = new Server({
  path: "/uploads",
  datastore: new GCSStore({
    bucket: storage.bucket("upload_test_maxat"),
  }),
});
uploadApp.all("*", server.handle.bind(server));
app.use("/uploads", uploadApp);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
