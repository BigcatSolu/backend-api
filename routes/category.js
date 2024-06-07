import express from 'express';

import { addCategory, deleteCategory, displayCategory, getCategory, getCategoryAdmin, getCategoryDetails, unDisplayCategory, updateCategory } from '../controller/category.js';

const router = express.Router();

router.get('/', getCategory)
router.get('/admin', getCategoryAdmin)
router.put('/display', displayCategory)
router.put('/undisplay', unDisplayCategory)
router.get('/:id', getCategoryDetails)
router.post('/add', addCategory)
router.put('/update', updateCategory)
router.delete('/delete', deleteCategory)

export default router