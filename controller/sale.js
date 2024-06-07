import { db } from "../db.js"

export const getSale = (req, res) => {
    const q = "SELECT * FROM sale WHERE sale_id = ?"

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(404).json("sale not found")
        return res.status(200).json(data)
    })
}

export const getSales = (req, res) => {
    const q = "SELECT * FROM sale WHERE user_id = ? AND isdisplay = 0"

    const { page = 1, limit = 4 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.query.userId

    const querySale = `
    SELECT * FROM sale 
    WHERE user_id = ? AND isdisplay = 0
    ORDER BY sale_date DESC
    LIMIT ? OFFSET ?
`;

const queryTotalCount = `
    SELECT COUNT(*) AS totalCount 
    FROM sale 
    WHERE user_id = ? AND isdisplay = 0
`;

db.query(queryTotalCount, [userId], (err, countResult) => {
    if (err) return res.status(500).json("Error fetching total count");
    const totalCount = countResult[0].totalCount;

    db.query(querySale, [userId, parseInt(limit), parseInt(offset)], (err, data) => {
        if (err) return res.status(404).json("Sale not found");
        return res.status(200).json({ sale: data, totalCount });
    });
});

    // const userId = req.query.userId
    // console.log(userId)

    // db.query(q, [userId], (err, data) => {
    //     if (err) return res.status(404).json("ไม่มีรายการที่สั่งซื้อ")
        
    //     return res.status(200).json(data)
    // })
}

// export const userDelete = (req, res) => {
//     const q = "UPDATE sale SET isdisplay = 1 WHERE sale_id = ?"

//     db.query(q, req.body.sale_id, (err, data) => {
//         if (err) return res.statsu(404).json("CANNOT FIND DELETE")
//         return res.status(200).json("delete successfully")
//     })
// }

export const userDelete = (req, res) => {
    const saleIds = req.body.sale_id;
    if (!Array.isArray(saleIds) || saleIds.length === 0) {
        return res.status(400).json("No sale IDs provided");
    }

    const placeholders = saleIds.map(() => '?').join(',');
    const q = `UPDATE sale SET isdisplay = 1 WHERE sale_id IN (${placeholders})`;

    db.query(q, saleIds, (err, data) => {
        if (err) return res.status(404).json("CANNOT FIND DELETE");
        return res.status(200).json("Delete successfully");
    });
}


export const updateSale = (req, res) => {
    const q = "INSERT INTO sale (`boxpass_id`, `user_id`, `sale_date`, `sale_amount`, `boxpass_username`, `boxpass_password`,`boxpass_email`, `boxpass_code`, `post_title`) VALUES (?)"

    const value = [
        req.body.boxpass_id,
        req.body.user_id,
        req.body.sale_date,
        req.body.sale_amount,
        req.body.boxpass_username,
        req.body.boxpass_password,
        req.body.boxpass_email,
        req.body.boxpass_code,
        req.body.post_title
    ]

    console.log(value)
    db.query(q, [value], (err, data) => {
        if (err) return res.status(500).json(err)
        console.log("done")
        return res.status(200).json("อัปโหลด sale สำเร็จ")
        
    })
} 

export const updateSaleCode = (req, res) => {
    
}