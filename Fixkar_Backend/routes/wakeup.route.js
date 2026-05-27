import express from "express"
import { awakeServer } from "../utils/awakeServer.controller.js";

const wakeRouter = express.Router();

wakeRouter.get('/ping', awakeServer);

export default wakeRouter;