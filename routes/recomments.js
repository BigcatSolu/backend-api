import express from "express";
import { getRecomments } from "../controller/recomments.js";

const router = express.Router()

router.get('/getrecomments', getRecomments)

export default router