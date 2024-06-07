import { db } from "../db.js"
import axios from 'axios'
import fs from 'fs';
import wallet from '../wallet.js'
import FormData from "form-data";
import  dotenv from 'dotenv'

dotenv.config()
// import redeemVoucher from "../wallet.js";

export const topupWallet = async (req, res) => {
    const number = req.body.tureNum
    
    const tureNumStr = number.padStart(10, '0');
    console.log(tureNumStr)
    // const tureNumInt = parseInt(tureNumStr, 10);
    // console.log("NUMB", tureNumInt) //output 0915513135
    // console.log(tureNumStr)
    try {
        // Await the result of the wallet function
        const rest = await wallet(tureNumStr, req.body.true);
        
        // Define the SQL query to update the user's balance

        const amount = rest.amount
        const his = "INSERT INTO topup ( `user_id`, `topup_date`, `topup_amount`, `topup_payment`) VALUES (?)"
        const value = [
            req.body.userId,
            req.body.time,
            amount,
            "True Wallet"
        ]
        db.query(his, [value], (err, data) => {
            if (err) {
                console.error("Error inserting topup record:", err);
                return res.status(400).json({ message: "Error inserting topup record" });
            }

            // Define the SQL query to update the user's balance
            const q = "UPDATE users SET user_balance = user_balance + ?, user_totaltopup = user_totaltopup + ? WHERE user_id = ?";
            
            db.query(q, [amount, amount, req.body.userId], (err, data) => {
                if (err) {
                    console.error("Error updating balance:", err);
                    return res.status(400).json({ message: "Error updating balance" });
                }
                const update = "UPDATE payment SET payment_count = payment_count + 1, today_topup = today_topup + ? WHERE payment_id = ?"

                db.query(update, [amount, req.body.payment_id], (err, data) => {
                    if (err) return res.status(500).json("INTERNAL ERROR")
                    
                    return res.status(200).json({ message: "เติมเงินด้วยอั่งเปาสำเร็จ" });
                })

                // Send a success message to the frontend
                
            });
        });
    } catch (err) {
        if (err.message === 'VOUCHER_OUT_OF_STOCK') {
            console.warn("Voucher out of stock. Retrying...");
            // Implement retry logic here, if appropriate, or handle the error as needed.
            return res.status(400).json({ message: "อั่งเปานี้หมดอายุการใช้งาน โปรดลองใหม่อีกครั้ง" });
        } else {
            console.error("Error in topupWallet:", err);
            return res.status(500).json({ message: "อั่งเปานี้ถูกรับเงินไปแล้ว", error: err });
        }
    }
}

export const getHistory = (req, res) => {
    const userId = req.query.userId
    const { page = 1, limit = 5 } = req.query;
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    // const q = "SELECT * FROM topup WHERE user_id = ? LIMIT ? OFFSET ?"

    const queryHistory = `
    SELECT * FROM topup 
    WHERE user_id = ?
    LIMIT ? OFFSET ?
`;

const queryTotalCount = `
    SELECT COUNT(*) AS totalCount 
    FROM topup 
    WHERE user_id = ?
`;

db.query(queryTotalCount, [userId], (err, countResult) => {
    if (err) return res.status(500).json("Error fetching total count");
    const totalCount = countResult[0].totalCount;

    db.query(queryHistory, [userId, parseInt(limit), parseInt(offset)], (err, data) => {
        if (err) return res.status(404).json("Sale not found");
        return res.status(200).json({ history: data, totalCount });
    });
});
    
    // db.query(q, [userId, limit, offset], (err, data) => {
    //     if (err) return res.status(500).json(err)

    //     return res.status(200).json(data)
    // })
}

// topupSlip

// export const topupSlip = async (req, res) => {

//     // const file = req.body.Formdata
//     // if (!formData) {    
//     //     return res.status(404).json("file not found")
//     // }
//     try {
//         const rest = await axios.post('https://api.slipok.com/api/line/apikey/21745', req.body, {
//             headers: {
//                 "x-authorization": 'SLIPOKBDO4VN8',
//             }
//         })

//         if (rest.success === true) {
//             return res.status(200).json("success", res.success)
//         }

//         // const his = "INSERT INTO topup ( `user_id`, `topup_date`, `topup_amount`, `topup_payment`) VALUES (?)"

//         // const value = [
//         //     req.body.userId,
//         //     req.body.time,
//         //     rest.data.amount,
//         //     req.body.bank
//         // ]

//         // db.query(his, [value], (err, data) => {
//         //     if (err) {
//         //         console.error("Error inserting topup record:", err);
//         //         return res.status(400).json({ message: "Error inserting topup record" });
//         //     }

//         //     const q = "UPDATE users SET balance = balance + (?) WHERE id = (?)"

//         //     db.query(q, [rest.data.amount, req.body.userId], (err, data) => {
//         //         if (err) {
//         //             console.error("Error updating balance:", err);
//         //             return res.status(400).json({ message: "Error updating balance" });
//         //         }

//         //         return res.status(200).json({ message: "Balance updated successfully" });
//         //     })
//         // })
//     } catch (err) {
//         if (err.message === 'VOUCHER_OUT_OF_STOCK') {
//             console.warn("Voucher out of stock. Retrying...");
//             // Implement retry logic here, if appropriate, or handle the error as needed.
//             return res.status(400).json({ message: "Voucher out of stock. Please try again later." });
//         } else {
//             console.error("Error in topupWallet:", err);
//             return res.status(500).json({ message: "Internal Server Error", error: err });
//         }
//     }
// }

