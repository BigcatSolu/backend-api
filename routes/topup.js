import express from 'express';
import { getHistory, topupWallet } from '../controller/topup.js';
import FormData from 'form-data';
import multer from 'multer';
import axios from 'axios';
import { db } from "../db.js";
import dotenv from 'dotenv'

dotenv.config()
// import { topupWallet } from '../controller/topup.js';

const router = express.Router();

router.post('/wallet', topupWallet)
// router.post('/slip', topupSlip)

const upload = multer({ storage: multer.memoryStorage() });

router.post('/slip', upload.single('files'), async (req, res) => {
    const { userId, time, bank } = req.body;
    const file = req.file;

    console.log("Request Body:", req.body); // Log request body
    console.log("Uploaded File:", file); // Log uploaded file

    if (!file) {
        return res.status(400).json({ message: "File not received" });
    }

    try {
        const formData = new FormData();
        formData.append('files', file.buffer, file.originalname);
        formData.append('log', 'true');


        const rest = await axios.post(process.env.SLIP_URL, formData, {
            headers: {
                "x-authorization": process.env.SLIP_CODE,
                ...formData.getHeaders(),
            }
        });

        // console.log("Response from slipok:", rest.data)

        const amount = rest.data.data.amount; // Adjust based on actual response structure
        if (!amount) {
            // console.error("Amount not found in response");
            return res.status(400).json({ message: "Invalid response from slipok" });
        }

        const his = "INSERT INTO topup (`user_id`, `topup_date`, `topup_amount`, `topup_payment`) VALUES (?)";
        const value = [
            userId,
            time,
            amount,
            bank
        ];

        // console.log("Insert values:", value);

        db.query(his, [value], (err, data) => {
            if (err) {
                // console.error("Error inserting topup record:", err);
                return res.status(400).json({ message: "Error inserting topup record" });

                
            }


            const q = "UPDATE users SET user_balance = user_balance + ?, user_totaltopup = user_totaltopup + ? WHERE user_id = ?";
            db.query(q, [amount, amount, userId], (err, data) => {
                if (err) {
                    // console.error("Error updating balance:", err);
                    return res.status(400).json({ message: "Error updating balance" });
                }

                return res.status(200).json({ message: "เติมเงินสำเร็จ" });
            });
        });
    } catch (err) {
        if (err.message === 'VOUCHER_OUT_OF_STOCK') {
            console.warn("Voucher out of stock. Retrying...");
            return res.status(400).json({ message: "Voucher out of stock. Please try again later." });
        } else {
            console.error("Error in topupWallet:", err);
            return res.status(500).json({ message: "สลิปนี้เคยเติมเงินแล้วโปรดลองใหม่อีกครั้ง", error: err });
        }
    }
});

// router.get('/:id', getSubCategory)
// router.get('/', addCategory)

router.get('/history', getHistory)

export default router