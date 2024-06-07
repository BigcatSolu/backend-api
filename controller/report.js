import { db } from "../db.js"
import { Client } from "@line/bot-sdk";

const config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.CH_SECRET
}

const client = new Client(config)


export const getReport = (req, res) => {
    const { page = 1, limit = 5 } = req.query; // Default values for page and limit
    const offset = (page - 1) * limit;

    const queryBanners = `
        SELECT * FROM report 
        WHERE report_status = 'pending'
        LIMIT ? OFFSET ?
    `;

    const queryTotalCount = `
        SELECT COUNT(*) AS totalCount 
        FROM report 
        WHERE report_status = 'pending'
    `;

    db.query(queryTotalCount, (err, countResult) => {
        if (err) return res.status(500).json("Error fetching total count");
        const totalCount = countResult[0].totalCount;

        db.query(queryBanners, [parseInt(limit), parseInt(offset)], (err, data) => {
            if (err) return res.status(404).json("Banners not found");
            return res.status(200).json({ banners: data, totalCount });
        });
    });
}

export const updateReport = (req, res) => {
    const q = "UPDATE report SET report_status = 'accept' WHERE report_id = ?"
    const reportId = req.params.id
    console.log("pass 1")
    console.log(reportId)
    
    db.query(q, [reportId], (err, data) => {
        if (err) return res.status(500).json("update fails");
        console.log("pass 2")
        return res.status(200).json("Accept report Successfully")
    })
    console.log("pass 3")
}

export const PostReport = (req, res) => {
    const q = "INSERT INTO report (`report_title`, `report_description`, `report_img`, `report_contact`) VALUES (?)"

    const values = [
        req.body.title,
        req.body.description,
        req.body.img,
        req.body.contact
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json("failed to upload", err)

        client.pushMessage(process.env.LINE_USER_ID, [
          {
            type: "text",
            text: `มีลูกค้าแจ้งปัญหาเข้ามา`,
          },
        ]);
        return res.status(200).json("แจ้งปัญหา / สอบถามสำเร็จ")
    })
}