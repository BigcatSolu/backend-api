import { db } from "../db.js"

export const addAnnounce = (req, res) => {

    const q = "INSERT INTO announce (`announce_username`, `announce_user_img`, `announce_content`, `announce_content_img`) VALUES (?)"

    const values = [
        req.body.userId,
        req.body.userimg,
        req.body.content,
        req.body.file
    ]

    console.log(values)

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json("INTERVAL ERROR")

        return res.status(200).json("อัปเดตข่าวสารสำเร็จ")
    })
}

export const getAnnounce = (req, res) => {
    const q = "SELECT * FROM announce ORDER BY announce_date DESC, announce_time DESC"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json("announce not found")
        return res.status(200).json(data)
    })
}

export const getAnnounceOne = (req, res) => {
    const q = "SELECT * FROM announce WHERE announce_id = ?"
    const id = req.params.id

    db.query(q, [id], (err, data) => {
        if (err) return res.status(404).json("announce not found")
        
        return res.status(200).json(data)
    })
}

export const AdminAnnounce = (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const offset = (page -1) * limit
    const q = "SELECT * FROM announce ORDER BY announce_date DESC, announce_time DESC LIMIT ?"

    const queryAnnounce = `
    SELECT * FROM announce ORDER BY announce_date DESC, announce_time DESC LIMIT ? OFFSET ?`

    const queryTotalCount = `
    SELECT COUNT(*) AS totalCount
    FROM announce 
    ORDER BY announce_date DESC, announce_time DESC`

    db.query(queryTotalCount, (err, data) => {
       if (err) return res.status(500).json("Error fetching total count")

       const totalCount = data[0].totalCount

       db.query(queryAnnounce, [parseInt(limit), parseInt(offset)], (err, data) => {
        if (err) return res.status(404).json("Announce not found")
        return res.status(200).json({ announce: data, totalCount })
       })
    })
}

export const updateAnnounce = (req, res) => {

    const q = "UPDATE announce SET announce_content = ?, announce_content_img = ? WHERE announce_id = ?"

    const values = [
        req.body.content,
        req.body.file,
        req.body.announceId
    ]
    console.log(values)

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json("INTERNAL ERROR")
        return res.status(200).json("แก้ไขข่าวสารสำเร็จ")
    })
}