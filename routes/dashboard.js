import express from "express";
import { getAllBoxpass, getAllSales, getDashboard, getUsers } from "../controller/dashboard.js";

const router = express.Router()

router.get('/', getDashboard)
router.get('/users', getUsers)
router.get('/sale', getAllSales)
router.get('/boxpass', getAllBoxpass)
export default router