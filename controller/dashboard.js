import { db } from "../db.js";

export const getDashboard = (req, res) => {

    const userQuery = `
    SELECT 
      MONTHNAME(created_at) AS month,
      COUNT(user_id) AS user_count
    FROM 
      users
    GROUP BY 
      MONTH(created_at),
      MONTHNAME(created_at)
    ORDER BY 
      MONTH(created_at);
  `;

  const salesQuery = `
  SELECT 
  MONTHNAME(sale_date) AS month,
  SUM(sale_amount) AS total_profit
FROM 
  sale
GROUP BY 
  MONTH(sale_date),
  MONTHNAME(sale_date)
ORDER BY 
  MONTH(sale_date);
`;

db.query(userQuery, (userError, userResults) => {
    if (userError) {
      return res.status(500).json({ error: userError });
    }

    db.query(salesQuery, (salesError, salesResults) => {
      if (salesError) {
        return res.status(500).json({ error: salesError });
      }

      // Combine the results
      const data = userResults.map(userRow => {
        const salesRow = salesResults.find(s => s.month === userRow.month);
        return {
          name: userRow.month,
          user: userRow.user_count,
          profit: salesRow ? salesRow.total_profit : 0
        };
      });

      res.json(data);
    });
  });
}

export const getUsers = (req, res) => {
    const q = "SELECT COUNT(*) AS total_users FROM users"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json("users not found")
        return res.status(200).json(data)
    })
}

export const getAllSales = (req, res) => {
    const q = "SELECT COUNT(*) AS total_sale FROM sale"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json("sales not found")
        return res.status(200).json(data)
    })
}

export const getAllBoxpass = (req, res) => {
    const q = "SELECT COUNT(*) AS total_boxpass FROM boxpass WHERE boxpass_isSold = 0"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json("boxpass not found")
        return res.status(200).json(data)
    })
}