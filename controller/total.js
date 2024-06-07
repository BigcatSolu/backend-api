import { db } from "../db.js";

export const getTotal = (req, res) => {
    const query = "SELECT SUM(user_totaltopup) AS totalTopup FROM users";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json("Error occurred while fetching total topup");
    }
    return res.json(result[0].totalTopup);
  });
}