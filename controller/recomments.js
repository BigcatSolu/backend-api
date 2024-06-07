import { db } from "../db.js";

export const getRecomments = (req, res) => {
    const q = "SELECT * FROM new_view WHERE display_date IS NOT NULL AND display_time IS NOT NULL ORDER BY display_date DESC, display_time DESC";
  
    db.query(q, (err, data) => {
      if (err) {
        console.log("1")
        console.error("Error retrieving Recomments:", err); // Log the actual error
        return res.status(500).json("ERROR interval Recomments");
      }
  
      return res.status(200).json(data);
    });
  }