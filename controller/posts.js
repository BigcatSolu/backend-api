  import { db } from "../db.js"
import jwt from 'jsonwebtoken'
import fs from "fs";

export const getPosts = (req, res) => {
    const q = req.query.cate ? "SELECT * FROM posts WHERE cate=?" : "SELECT * FROM posts"
    // const q = "SELECT * FROM category"

    db.query(q, [req.query.cate],(err, data) => {
        if (err) return res.status(500).send(err)

        return res.status(200).json(data)
    })
}

// export const getRemaining = (req, res) => {
//     const q = "SELECT * FROM new_view"; 
    
//     db.query(q, (err, data) => {
//         if (err) return res.status(500).send(err);
//         return res.status(200).json(data);
//     })
// }

export const getRemaining = async (req, res) => {
    const q = "SELECT * FROM new_view WHERE cate=?";

    // const q = req.body.cate
    // ? "SELECT * FROM new_view WHERE cate=? ORDER BY `new_view`.`boxpass_remain` ASC"
    // : "SELECT * FROM new_view ORDER BY `new_view`.`boxpass_remain` ASC";
    // //cate_id
    // console.log("REQUEST: ", req.query.cate);

    db.query(q, [req.query.cate], (err, data) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).json(data);
    });
  };

export const getRemainManage = (req, res) => {

  const q = "SELECT * FROM new_view_manage";

  // const q = req.body.cate
  // ? "SELECT * FROM new_view WHERE cate=? ORDER BY `new_view`.`boxpass_remain` ASC"
  // : "SELECT * FROM new_view ORDER BY `new_view`.`boxpass_remain` ASC";
  // //cate_id
  // console.log("REQUEST: ", req.query.cate);

  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).json(data);
  });
};



  export const StockInfo = async (req, res) => {

    // const q = "SELECT * FROM new_view WHERE cate IN (1,2) ORDER BY `new_view`.`boxpass_remain` ASC"
    
    const hello = "SELECT * FROM new_view WHERE type IN ('id','code') ORDER BY `boxpass_remain` ASC"
    //     const q = req.body.cate
    // ? "SELECT * FROM posts_view WHERE cate = ? ORDER BY `new_view`.`boxpass_remain` ASC"
    // : "SELECT * FROM new_view ORDER WHERE cate IN (1,2) BY `new_view`.`boxpass_remain` ASC";
    //cate_id
    
    console.log("REQUEST: ", req.query.cate);

    db.query(hello, [req.query.cate], (err, data) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).json(data);
    });
  }

export const getAllCategory = (req, res) => {
  // const q = "SELECT * FROM posts_view"
  const q = "SELECT * FROM new_posts_view ORDER BY date DESC"

  db.query(q, (err, data) => {
    if (err) {
      return res.status(404).json("Data not found");
    }
    return res.status(200).json(data);
  })
}

export const getBoxpassView = (req, res) => {
  const q = "SELECT * FROM boxpass_type";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
    const q = "SELECT * FROM new_view WHERE id = ?"
    // const q = "SELECT p.id, `title`, `des`, `img`, `cate`, `warn`, `remaining`, `price`, WHERE p.id = ?"
    console.log(req.params.id)

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err)
        
            return res.status(200).json(data[0]);
    })
}



export const addProduct = (req, res) => {
    const token = req.cookies.access_token;

    if (!token) return res.status(403).json("ไม่สามารถยืนยันตัวตนของคุณได้ โปรดล็อคอินใหม่อีกครั้ง")

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token  is not valid!")
    })

    const q = "INSERT INTO posts (`title`, `des`, `img`, `cate`, `warn`, `price`, `type`, `op1`, `op2`, `op3`, `op4`, `op5`, `op6`, `op7`, `op8`, `start_time`) VALUES (?)"

const values = [
    req.body.title,
    req.body.des,
    req.body.file,
    req.body.cate,
    req.body.warn,
    req.body.price,
    req.body.type,
    req.body.op1,
    req.body.op2,
    req.body.op3,
    req.body.op4,
    req.body.op5,
    req.body.op6,
    req.body.op7,
    req.body.op8,
    req.body.start_time
];

console.log(values);

db.query(q, [values], (err, data) => {
    if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error creating product" });
    }
    console.log("Insertion successful:", data);
    return res.status(200).json({ message: "เพิ่มสินค้าใหม่สำเร็จ" });
});


    // const q = "INSERT INTO posts (`title`, `des`, `img`, `cate`, `warn`, `price`, `type`, `op1`, `op2`, `op3`, `op4`, `op5`, `op6`, `op7`, `op8`, `start_time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ADDTIME(NOW(), SEC_TO_TIME(?)))"

    // // const q = "INSERT INTO posts (`title`, `des`, `img`, `cate`, `warn`, `price`, `type`, `op1`, `op2`, `op3`, `op4`, `op5`, `op6`, `op7`, `op8`, `start_time = ADDTIME(NOW(), SEC_TO_TIME(?))`) VALUES (?)"

    // const value = [
    //     req.body.title,
    //     req.body.des,
    //     req.body.file,
    //     req.body.cate,
    //     req.body.warn,
    //     req.body.price,
    //     req.body.type,
    //     req.body.op1,
    //     req.body.op2,
    //     req.body.op3,
    //     req.body.op4,
    //     req.body.op5,
    //     req.body.op6,
    //     req.body.op7,
    //     req.body.op8,
    //     req.body.start_time
    // ]

    // console.log(value)

    // db.query(q, [value], (err, data) => {
    //     if (err) return res.status(500).json("Error Createing product")
    //       // if (err) console.log(err)
    //     // console.log(done)
    //     return res.json("เพิ่มสินค้าใหม่สำเร็จ")
    // })
}

export const addAccount = (req, res) => {
    const { dataSets } = req.body;
  const values = dataSets.map((dataSet) => [
    dataSet.username,
    dataSet.password,
    dataSet.email,
    dataSet.selectedPost,
  ]);

  const q =
  "INSERT INTO boxpass (boxpass_username, boxpass_password, boxpass_email, box_id) VALUES ?";

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json("error hello");
    return res.json("เพิ่มสต็อกสำเร็จ");
  });

    // const q = "INSERT INTO boxpass (`boxpass_username`, `boxpass_password`, `boxpass_code`, `box_id`) VALUES (?)"

    // const value = [
    //     req.body.username,
    //     req.body.password,
    //     req.body.code,
    //     req.body.postId
    // ]

    // db.query(q, [value], (err, data) => {
    //     if (err) return res.status(500).json("error hello")
    //     return res.json("เพิ่มสต็อกสำเร็จ")
    // })
}

export const addCode = (req, res) => {
    const { dataSets } = req.body;
    const values = dataSets.map((dataSet) => [
      dataSet.code,
      dataSet.selectedPost,
    ]);
    //req.body include  Code and SelectedPost.
    const query = "INSERT INTO boxpass( boxpass_code, box_id) VALUES ?";
    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json("error hello");
      return res.json("เพิ่มสต็อกสำเร็จ");
    });
  };

  export const updateProduct = (req, res) => {
    const q =
      "UPDATE posts SET title= ?,des= ?,img= ?,price= ?,old_price= ?,warn=? WHERE id = ?";

    //   const q =
    // "UPDATE `posts` SET `title`= ?,`des`= ?,`img`= ?,`price`= ?,`old_price`= ?,`warn`=? WHERE `id` = ?";
  
    const values = [
      req.body.title,
      req.body.des,
      req.body.img,
      req.body.price,
      req.body.oldPrice,
      req.body.warn,
      req.params.id,
    ];

    console.log(values)

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json("อัพเดทสินค้าไม่สำเร็จ");
      if (req.body.oldFile !== "") {
        fs.unlink(`../client/public${req.body.oldFile.trim()}`, (err) => {
          // if (err === "ENOENT") {
          //   console.log(err)
          //   // File does not exist, do nothing
          //   console.log(`File not found: ${oldFilePath}`);
          // } else {
          //   throw err;
          // }
          console.log(`../client/public${req.body.oldFile.trim()} was deleted`);
        });
      }
      return res.status(200).json("อัพเดทสินค้าสำเร็จ");
    });
  };

export const updateAccount = (req, res) => {
    const q = "UPDATE boxpass SET boxpass_isSold = 1 WHERE boxpass_id = ?"

    const boxpass_id = req.body.boxpass_id

    console.log(boxpass_id)
    db.query(q, [boxpass_id], (err, data) => {
        if (err) return res.status(500).json("ERROR")

        return res.status(200).json("ซื้อสินค้าสำเร็จ")
    })
}

export const getAccount = (req, res) => {
    const q = "SELECT * FROM boxpass WHERE box_id = ? AND boxpass_isSold = 0  LIMIT ?"

    // const id = req.body.boxId
    // const limit = req.body.LIMIT
    const { boxId, limit } = req.body;

    db.query(q, [boxId, limit], (err, data) => {
        if (err) return res.status(500).send(err);

        if (data.length > 0) {
            // If data is found, send the first item as the response
            return res.status(200).json(data);
        } else {
            // If no data is found, send a 404 response with a message
            return res.status(404).json({ message: "No data found" });
        } // Send the first data item as the response
    });
}

export const displayRecomments = (req, res) => {
  const q = "UPDATE posts SET display_date = CURRENT_DATE(), display_time = CURRENT_TIME() WHERE id = ?"

  db.query(q, [req.body.id], (err, data) => {
    if (err) return res.status(500).json("ERROR display Recomments")

    return res.status(200).json("Display successfully")
  })
}

export const unDisplayRecomments = (req, res) => {
  const q = "UPDATE posts set display_date = NULL, display_time = NULL WHERE id = ?"

  db.query(q, [req.body.id], (err, data) => {
    if (err) return res.status(500).json("ERROR display Recomments")

      return res.status(200).json("UnDisplay successfully")
  })
}

export const deletePosts = (req, res) => {
  const q = "DELETE FROM posts WHERE id = ?"

  console.log(req.body.id)

  db.query(q, req.body.id, (err, data) => {
    if (err) return res.status(500).json("INTERNAL ERROR")
    return res.status(200).json("DELETE SUCCESSFULLY")
  })

}

// export const getRecomments = (req, res) => {
//   const q = "SELECT * FROM new_view WHERE display_date IS NOT NULL AND display_time IS NOT NULL ORDER BY display_date ASC, display_time ASC";

//   db.query(q, (err, data) => {
//     if (err) {
//       console.log("1")
//       console.error("Error retrieving Recomments:", err); // Log the actual errorcat
//       return res.status(500).json("ERROR interval Recomments");
//     }

//     return res.status(200).json(data);
//   });
// }