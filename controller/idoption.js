import { db } from "../db.js"

export const getIdOption = (req, res) => {
    console.log("Hi")
    const q = "SELECT * FROM new_view WHERE type = 'id'"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json(err)

        return res.status(200).json(data)
    })
  }

export const getCodeOption = (req, res) => {
    console.log("code")
    const q = "SELECT * FROM new_view WHERE type = 'code'"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json(err)

        return res.status(200).json(data)
    })
}