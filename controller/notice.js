import { db } from "../db.js"

export const getNotice = (req, res) => {
    const q = "SELECT * FROM notice WHERE notice_isdisplay = 0"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json({ message: "notice not found"})

        return res.status(200).json(data)
    })
}

export const adminNotice = (req, res) => {
    const { page = 1, limit = 5 } = req.query; // Default values for page and limit
    const offset = (page - 1) * limit;

    const queryBanners = `
        SELECT * FROM notice 
        WHERE notice_isdisplay = 0
        LIMIT ? OFFSET ?
    `;

    const queryTotalCount = `
        SELECT COUNT(*) AS totalCount 
        FROM notice 
        WHERE notice_isdisplay = 0
    `;

    db.query(queryTotalCount, (err, countResult) => {
        if (err) return res.status(500).json("Error fetching total count");
        const totalCount = countResult[0].totalCount;

        db.query(queryBanners, [parseInt(limit), parseInt(offset)], (err, data) => {
            if (err) return res.status(404).json("notice not found");
            return res.status(200).json({ notice: data, totalCount });
        });
    });
}

export const updateNotice = (req, res) => {
    const noticeId = req.params.id 

    const q = "UPDATE notice SET notice_isdisplay = 1 WHERE notice_id = ?"

    db.query(q, [noticeId], (err, data) => {
        if (err) return res.status(500).json({ message: "Internal ERROR"})

            return res.status(200).json("Delete Successful")
    })
}

export const addNotice = (req, res) => {
    const q = "INSERT INTO notice (notice_message) VALUES (?)";

    db.query(q, [req.body.msg], (err, data) => {
        if (err) return res.status(500).json({ message: "Internal server error" });

        return res.status(200).json({message: "อัปโหลดประกาศของคุณสำเร็จ"});
    });
}