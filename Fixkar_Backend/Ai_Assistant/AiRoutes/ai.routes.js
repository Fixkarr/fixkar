import express from "express";
import { chatWithAI } from "../AiControllers/ai.controller";


const Airouter = express.Router();

Airouter.post("/chat", chatWithAI);

export default Airouter;