import express from "express";
import { getTotal } from "../controller/total.js";

const router = express.Router()

router.get('/', getTotal)

export default router