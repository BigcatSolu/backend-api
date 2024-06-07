import express from "express";
import { getStatus } from "../controller/getStatus.js";

const router = express.Router()

router.get('/', getStatus)

export default router