import { db } from "../db.js";

export const refreshUser = (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).send("User ID is required");
    }

    const q = "SELECT * FROM users WHERE user_id = ?";

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).send(err);
        if (data.length === 0) return res.status(404).send("User not found");
        return res.status(200).json(data);
    });
}

export const updateBalance = (req, res) => {
    const q = "UPDATE users SET user_balance = user_balance - ? WHERE user_id = ?"

    const price = req.body.price
    const userId = req.body.userId

    console.log(price)
    console.log(userId)

    db.query(q, [req.body.price, req.body.userId], (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json("อัปเดตยอดเงินสำเร็จ")
    })
}