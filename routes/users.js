import express from 'express';
import { refreshUser, updateBalance } from '../controller/users.js';

const router = express.Router()

router.get("/:id", refreshUser)
router.put('/update', updateBalance)

export default router