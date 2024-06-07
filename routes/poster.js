import express from 'express'
import { db } from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
    // const q = "SELECT * FROM poster LIMIT 1"

    // db.query(q, (err, data) => {
    //     if (err) return res.status(404).json("POSTER NOT FOUND")
        
    //     return res.status(200).json(data)
    // })

    const { page = 1, limit = 5 } = req.query; // Default values for page and limit
    const offset = (page - 1) * limit;

    const queryPoster = `
        SELECT * FROM poster 
        LIMIT ? OFFSET ?
    `;

    const queryTotalCount = `
        SELECT COUNT(*) AS totalCount 
        FROM poster 
    `;

    db.query(queryTotalCount, (err, countResult) => {
        if (err) return res.status(500).json("Error fetching total count");
        const totalCount = countResult[0].totalCount;

        db.query(queryPoster, [parseInt(limit), parseInt(offset)], (err, data) => {
            if (err) return res.status(404).json("Banners not found");
            return res.status(200).json({ poster: data, totalCount });
        });
    });
})

router.post('/add', (req, res) => {
    const q = "INSERT INTO poster (poster_image) VALUES (?)"

    db.query(q, req.body.img, (err, data) => {
        if (err) return res.status(500).json("INTERVAL ERROR")
        
        return res.status(200).json("ADD POSTER SUCCESSFUL")
    })
})

router.delete('/delete', (req, res) => {
    const q = "DELETE FROM poster WHERE poster_id = ?"

    db.query(q, req.body.poster_id, (err, data) => {
        if (err) return res.status(500).json("INTERVAL ERROR")
        
        return res.status(200).json("ADD POSTER SUCCESSFUL")
    })
})

export default router
