import express from "express";
import { PostReport, getReport, updateReport } from "../controller/report.js";

const router = express.Router()

router.get('/get', getReport)
router.put('/update/:id', updateReport)
router.post('/', PostReport)

export default router