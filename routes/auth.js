import express from 'express';
import { chanagePassword,  login, logout, register, updateEmail, updateProfile } from '../controller/auth.js'

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/changepassword', chanagePassword)
router.put('/updateemail', updateEmail)
router.put('/updateprofile', updateProfile)

export default router