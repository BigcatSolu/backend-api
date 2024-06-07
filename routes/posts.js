import express from 'express';
import { StockInfo, addAccount, addCode, addProduct, deletePosts, displayRecomments, getAccount, getAllCategory, getBoxpassView, getPost, getPosts, getRemainManage, getRemaining, unDisplayRecomments, updateAccount, updateProduct } from '../controller/posts.js';

const router = express.Router()

router.get('/', getPosts)
router.get("/view-boxpass", getBoxpassView);
// router.get('/getrecomments', getRecomments)
router.get('/remain', getRemaining)
router.get('/manage', getRemainManage)
router.get('/stockinfo', StockInfo)
router.get('/allcategory', getAllCategory)
router.get("/:id", getPost)
router.post('/', addProduct)
router.post('/account', addAccount)
router.post('/code', addCode)
router.put("/update/:id", updateProduct);
router.put('/update', updateAccount)
router.post('/getaccount', getAccount)
router.put('/display', displayRecomments)
router.put('/undisplay', unDisplayRecomments)
router.delete('/delete', deletePosts)

export default router