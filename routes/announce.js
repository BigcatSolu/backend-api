import express from "express";
import { AdminAnnounce, addAnnounce, getAnnounce, getAnnounceOne, updateAnnounce } from "../controller/announce.js";

const router = express.Router()

router.post('/add', addAnnounce)
router.get('/admin', AdminAnnounce)
router.get('/:id', getAnnounceOne)
router.get('/', getAnnounce)
router.put('/update', updateAnnounce)

export default router