import express from "express";
import { addNotice, adminNotice, getNotice, updateNotice } from "../controller/notice.js";

const router = express.Router()

router.get('/', getNotice)
router.get('/admin', adminNotice)
router.put('/:id', updateNotice)
router.post('/add', addNotice)

export default router