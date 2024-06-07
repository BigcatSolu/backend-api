import express from "express";
import { getSale, getSales, updateSale, userDelete } from "../controller/sale.js";

const router = express.Router()

router.get('/get', getSales)
router.get('/:id', getSale)
router.post('/', updateSale)
router.put('/delete', userDelete)

export default router