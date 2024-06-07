import express from 'express'
import { getProfiles } from '../controller/profiles.js'

const router = express.Router()

router.get('/', getProfiles)

export default router