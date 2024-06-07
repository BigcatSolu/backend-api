import express from "express";
import { getOrder, getUserOrder, orderOut, postOrder, removeCount, updateOrder } from "../controller/order.js";

const router = express.Router();

router.post('/', postOrder)
router.post('/out', orderOut)
router.get('/get', getOrder)
router.get('/user', getUserOrder)
router.put('/remove', removeCount)
router.put('/update', updateOrder)

export default router