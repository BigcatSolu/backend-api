import { db } from "../db.js"

export const getStatus = (req, res) => {
    const q = "SELECT * FROM status"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json(err)
        return res.status(200).json(data)
    })
}