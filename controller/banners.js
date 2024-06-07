import { db } from "../db.js"
import jwt from 'jsonwebtoken'

export const getBanner = (req, res) => {
    const q = "SELECT * FROM banner"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json("ERROR")
        return res.status(200).json(data)
    })
}

export const getBanners = (req, res) => {
    const { page = 1, limit = 5 } = req.query; // Default values for page and limit
    const offset = (page - 1) * limit;

    const queryBanners = `
        SELECT * FROM banner 
        WHERE banner_isDisplay = 0
        LIMIT ? OFFSET ?
    `;

    const queryTotalCount = `
        SELECT COUNT(*) AS totalCount 
        FROM banner 
        WHERE banner_isDisplay = 0
    `;

    db.query(queryTotalCount, (err, countResult) => {
        if (err) return res.status(500).json("Error fetching total count");
        const totalCount = countResult[0].totalCount;

        db.query(queryBanners, [parseInt(limit), parseInt(offset)], (err, data) => {
            if (err) return res.status(404).json("Banners not found");
            return res.status(200).json({ banners: data, totalCount });
        });
    });
};

export const postBanner = (req, res) => {
    // const token = req.cookies.access_token;

    // if (!token) return res.status(401).json("Not authenticated");
    // console.log("pass 1")

    // const q = "INSERT INTO banner (banner_img) VALUES = ?"
    const w = "INSERT INTO banner (banner_img) VALUES (?)"
    const files = req.body.img

    db.query(w, [files], (err, data) => {
        if (err) return res.status(500).json("error")
        return res.status(200).json("เพิ่มแบนเนอร์สำเร็จ")
    
    })
    console.log("pass 2")
}

export const deleteBanner = (req, res) => {
    // const token = req.cookies.access_token;

    // if (!token) return res.status(401).json("Not authenticated");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //     if (err) return res.status(403).json("Token is not valid!");
        // console.log(userInfo)

        // Check if the user has admin role
        // if (userInfo.role !== 'admin') {
        //     return res.status(403).json("Unauthorized: Admin role required for deletion.");
        // }

        const q = "DELETE FROM banner WHERE banner_id = ?";
        const bannerId = req.params.id;

        db.query(q, [bannerId], (err, data) => {
            if (err) return res.status(500).json("Error deleting banner");

            return res.status(200).json("Banner deleted successfully");
        });
    // });
}
