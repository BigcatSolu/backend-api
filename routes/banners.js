import express from "express";
import { deleteBanner, getBanner, getBanners, postBanner } from "../controller/banners.js";

const router = express.Router()

router.get('/', getBanners)
router.get('/get' , getBanner)
router.post('/add', postBanner)
router.delete('/:id', deleteBanner)

export default router