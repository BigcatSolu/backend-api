import { db } from "../db.js"

export const getProfiles = (req, res) => {
    const q = "SELECT * FROM profiles"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json("profiles not found")

        return res.status(200).json(data)
    })
}