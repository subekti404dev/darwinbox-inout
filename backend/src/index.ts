import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import v1Routes from "./routes/v1";
import { storeData } from "./utils/store";
import { startJob } from "./utils/job";
import path from "path";

const data = storeData.getConfigData();
if (data?.cronIn && data?.cronOut && data.scheduler) {
  startJob(data?.cronIn, data?.cronOut);
}

const app: Express = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());

app.get("/ping", (req: Request, res: Response) => {
  res.send("OK");
});

app.use("/v1", v1Routes);

app.use(express.static("html"));
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "html", "index.html"));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
