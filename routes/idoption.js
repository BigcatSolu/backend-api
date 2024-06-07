import express from "express";
import { getCodeOption, getIdOption } from "../controller/idoption.js";

const router = express.Router()

router.get('/id', getIdOption)
router.get('/code', getCodeOption)

export default router