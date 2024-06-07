import express from 'express';
import { addPayment, adminGetTruewallet, deletePayment, getBankSlip, getKasikorn, getPayment, getPaymentById, getTruewallet, updatePayment } from '../controller/payment.js';

const router = express.Router();

router.get('/', getPayment)
router.get('/truewallet', getTruewallet)
router.get('/true', adminGetTruewallet)
router.get('/kasikron', getKasikorn)
router.get('/bankslip', getBankSlip)
router.get('/:id' , getPaymentById)
router.post('/addpayment', addPayment)
router.put('/update', updatePayment)
router.delete('/delete', deletePayment)

export default router