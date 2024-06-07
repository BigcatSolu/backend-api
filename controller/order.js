import { db } from "../db.js"
import { Client } from "@line/bot-sdk";

const config0 = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.CH_SECRET
}

const config = {
    channelAccessToken: process.env.MAIN_BOT_TOKEN,
    channelSecret: process.env.MAIN_BOT_SECRET
}
const config1 = {
    channelAccessToken: process.env.SECOND_BOT_TOKEN,
    channelSecret: process.env.SECOND_BOT_SECRET
}

const client = new Client(config)
const client2 = new Client(config1)

export const postOrder = (req, res) => {
    const q = "INSERT INTO ordering (`category_id`, `user_id`, `status_id`, `ordering_title`, `ordering_username`, `ordering_password`, `ordering_amount`, `ordering_contact`, `ordering_note`, `ordering_img`, `ordering_type`, `ordering_option`, `ordering_redmail`, `ordering_cookie`, `ordering_warning`, `countdown_duration`) VALUES (?)"

    const values = [
        req.body.category_id,
        req.body.user_id,
        req.body.status_id,
        req.body.ordering_title,
        req.body.ordering_username,
        req.body.ordering_password,
        req.body.ordering_amount,
        req.body.ordering_contact,
        req.body.ordering_note,
        req.body.ordering_img,
        req.body.ordering_type,
        req.body.ordering_option,
        req.body.ordering_redmail,
        req.body.ordering_cookie,
        req.body.ordering_warning,
        req.body.ordering_coundown_duration
    ]
    console.log(values)

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json("INTERNAL SERVER ERROR")

//         client.pushMessage(process.env.MAIN_USER_ID, [
//           {
//             // type: "text",
//             // text: `มีลูกค้าสั่งซื้อสินค้าประเภทออเดอร์  \n ชื่อออเดอร์ ${req.body.ordering_title} \n หมายเหตุของลูกค้า: ${req.body.ordering_note}`,
//             type: "text",
//             text: `มีลูกค้าสั่งซื้อ สินค้า ประเภท: ${req.body.ordering_type} \n
// ชื่อสินค้า ออเดอร์: ${req.body.ordering_title} \n
// ---------- 🟢
// Use: ${req.body.ordering_username}
// Pass: ${req.body.ordering_password}
// Email: eee@com
// ---------- 🟢
// หมายเหตุของลูกค้า: ${req.body.ordering_note}`,
            
//           },
//         ]);
        return res.status(200).json("วางออเดอร์สำเร็จ โปรดรอการติดต่อกลับจากแอดมิน")
    })
}

export const orderOut = (req, res)  => {
    client2.pushMessage(process.env.SECOND_BOT_ID, [
        {
            // type: "text",
            // text: `ออเดอร์ออก สำหรับสินค้าประเภทออเดอร์  \n ชื่อออเดอร์ ${req.body.ordering_title} \n หมายเหตุของลูกค้า: ${req.body.ordering_note}`,

            type: "text",
            text: `ครบเวลาแล้ว สินค้า ประเภท: ${req.body.ordering_type} \n
ชื่อสินค้า ออเดอร์: ${req.body.ordering_title} \n
---------- 🟢
Use: ${req.body.ordering_username}
Pass: ${req.body.ordering_password}
Email: eee@com
---------- 🟢
หมายเหตุของลูกค้า: ${req.body.ordering_note}`,
        }
    ])
    return res.status(200).json("SENT LINE MESSSAGE")
}

export const getOrder = (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  const queryOrdering = `
  SELECT o.*, s.status_name 
  FROM ordering o
  JOIN status s ON o.status_id = s.status_id
  WHERE o.status_id IN (1, 2, 3, 4)
  ORDER BY FIELD(o.status_id,3, 2, 1, 4)
  LIMIT ? OFFSET ?`;

  const queryTotalCount = `
  SELECT COUNT(*) AS totalCount
  FROM ordering
  WHERE status_id = 1 OR status_id = 2 OR status_id = 3 OR status_id = 4`;

  const queryCountdownStart = `
  SELECT countdown_start
  FROM ordering
  WHERE ordering_id = ?`;

  db.query(queryTotalCount, (err, countResult) => {
      if (err) return res.status(500).json("Error fetching total count");
      const totalCount = countResult[0].totalCount;

      db.query(queryOrdering, [parseInt(limit), parseInt(offset)], async (err, data) => {
          if (err) return res.status(404).json("Ordering not found");

          // Fetch countdown_start for each ordering
          for (const ordering of data) {
              try {
                  const countdownStart = await getCountdownStart(ordering.ordering_id);
                  ordering.countdown_starting = countdownStart;
              } catch (error) {
                  console.error('Error fetching countdown start time:', error);
                  ordering.countdown_start = null;
              }
          }

          return res.status(200).json({ ordering: data, totalCount });
      });
  });

  function getCountdownStart(orderingId) {
      return new Promise((resolve, reject) => {
          db.query(queryCountdownStart, [orderingId], (err, result) => {
              if (err) reject(err);
              resolve(result[0].countdown_start);
          });
      });
  }
};

export const updateOrder = (req, res) => {
  const { status_id, ordering_id, countdown_time } = req.body;
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  
  const queryUpdate = 'UPDATE ordering SET status_id = ?, countdown_start = ADDTIME(NOW(), SEC_TO_TIME(?)) WHERE ordering_id = ?';

  if (!countdown_time) {
    
    const queryUpdate = 'UPDATE ordering SET status_id = ? WHERE ordering_id = ?';

    db.query(queryUpdate, [status_id, ordering_id], (err, data) => {
        if (err) return res.status(500).json("Error updating order status with no timer");

        return res.status(200).json("Updated with no timer")
    })

    return
  }

  const [hours, minutes, seconds] = countdown_time.split(':');

  const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

  const timezoneOffset = new Date().getTime();
  console.log(timezoneOffset)

  const adjustedSeconds = totalSeconds + timezoneOffset;
  const unixTimerLeft = adjustedSeconds - timezoneOffset;
  console.log(unixTimerLeft)

  const adjustedDays = Math.floor(unixTimerLeft / (24 * 3600));
  const adjustedHours = Math.floor(unixTimerLeft / 3600) % 24;
  const adjustedMinutes = Math.floor((unixTimerLeft % 3600) / 60);
  const adjustedSecondsResult = unixTimerLeft % 60;

  let formattedCountdownTime = '';
  if (adjustedDays > 0) {
      formattedCountdownTime += `${adjustedDays} day `;
  }

  formattedCountdownTime += `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}:${adjustedSecondsResult.toString().padStart(2, '0')}`;

  console.log(status_id, formattedCountdownTime, ordering_id);

  db.query(queryUpdate, [status_id, totalSeconds, ordering_id], (err, result) => {
      if (err) return res.status(500).json("Error updating order status");

      // Fetch the updated status name
      const queryStatus = 'SELECT status_name FROM status WHERE status_id = ?';

      db.query(queryStatus, [status_id], (err, statusResult) => {
          if (err) return res.status(500).json("Error fetching status name");
          return res.status(200).json({ status_name: statusResult[0].status_name });
      });
  });
};

export const removeCount = (req, res) => {
    const q = "UPDATE ordering SET countdown_duration = NULL WHERE ordering_id = ?"

    db.query(q, req.body.ordering_id, (err, data) => {
        if (err) return res.status(404).json("ORDERING NOT FOUND")
        console.log("REMOVEING", req.body.ordering_id)
        return res.status(200).json("remove countdown_duration successfully")
    })
}

export const getUserOrder = (req,res) => {
  const q = "SELECT * FROM ordering WHERE user_id = ? AND status_id IN (1,2,3,4) ORDER BY countdown_start DESC, status_id IN (1,2,3,4) ASC"

  db.query(q, [req.query.userId], (err, data) => {
    if (err) return res.status(404).json("DATA NOT FOUND")
    return res.status(200).json(data)
  })
}


