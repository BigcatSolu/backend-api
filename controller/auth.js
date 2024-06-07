import { db } from '../db.js'
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'

export const register = (req, res) => {

  console.log(req.body.username)
  console.log(req.body.password)
  console.log(req.body.email)
  console.log(req.body.phonefb)
  // console.log(req.body.username)

    // CHECK EXISTING USER
    // const q = "SELECT * FROM users WHERE username = ? AND email = ?"
    const q = "SELECT * FROM users WHERE user_username = ? AND user_email = ?"
  
    db.query(q, [req.body.username, req.body.email], (err, data) => {
        if (err) return res.status(404).json("ERROR:", err)
        if (data.length) return res.status(409).json("ไอดีนี้สมัครสมาชิกไว้อยู่แล้ว โปรดล็อคอิน")

        console.log("Passed")

        // Hash the password and create a user

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)

        // const q = "INSERT INTO users (`username`, `password`, `email`, `phonefb`, `role`, `balance`) VALUES (?)"

        const q = "INSERT INTO users (`user_email`, `user_username`, `user_password`, `user_contact`, `user_balance`) VALUES (?)"
        const values = [
            req.body.email,
            req.body.username,
            hash,
            req.body.phonefb,
            0
        ]
        console.log("Passed2")

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json({ error: "Internal Server error"})
              console.log("Passed3")
            return res.status(200).json("สมัครสมาชิกสำเร็จ")
        })
    })
}

export const login = (req, res) => {
    
    // Check user 
    const q = "SELECT * FROM users WHERE user_username = ? "

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 0) return res.status(404).json("ไม่มีบัญชีผู้ใช้ที่คุณกรอก")

        // check password 
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].user_password)

        if (!isPasswordCorrect) return res.status(404).json("บัญชีหรือรหัสผ่านไม่ถูกต้อง")
        
        const token = jwt.sign({id: data[0].id}, "jwtkey")

        const {user_password, ...other} = data[0]
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other)
    })
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out")
}

export const chanagePassword = (req, res) => {
  console.log(req.body.password)
  console.log(req.body.newPassword)
  const query = "SELECT * FROM users WHERE user_id = ? ";

  db.query(query, [req.body.userId], (err, data) => {
    if (err) {
        console.log(err)
        return res.status(404).json(err);
    } 
    // console.log(data)

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].user_password
    );

    if (!isPasswordCorrect)
      return res.status(404).json("รหัสผ่านปัจจุบันไม่ถูกต้อง");

    

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.newPassword, salt);

    const q = "UPDATE users SET user_password = ? WHERE user_id = ?";

    db.query(q, [hash, req.body.userId], (err, data) => {
      if (err) {
        console.log(err)
        return res.status(400).json({ message: "ERROR updating password" });
      }
      return res.status(200).json("Hello new Pass");
    });
  });
};

  export const updateEmail = (req, res) => {

    const query = "SELECT * FROM users WHERE user_id = ?"

    db.query(query, [req.body.userId], (err, data) => {
      if (err) return res.status(404).json(err)

        if (data.length === 0) {
          return res.status(404).json("User not found");
        }

      const update = "UPDATE users SET user_email = ?, user_contact = ? WHERE user_id = ?"

      db.query(update, [req.body.email, req.body.contact, req.body.userId], (err, data) => {
        if (err) return res.status(500).json("INTERVAL SERVER ERROR")

        return res.status(200).json("อัปเดตอีเมล ข้อมูลติดต่อของคุณสำเร็จ")
      })
    })
  }

  export const updateProfile = (req, res) => {
    const img = req.body.user_img
    const id = req.body.userId
    const username = req.body.username

    console.log(img)
    console.log(id)

    if (!img || !id) {
      return res.status(400).json("Bad Request: Missing user_img or userId");
  }

    const q = "UPDATE users SET user_img = ? WHERE user_id = ?"

    const announce = "UPDATE announce SET announce_user_img = ? WHERE announce_username = ?"

    db.query(q, [img, id], (err, data) => {
      if (err) return res.status(500).json("INTERVAL ERROR")
      
      
      db.query(announce, [img, username], (err, data) => {
        if (err) return res.status(500).json("INTERVAL ERROR1")

          return res.status(200).json("Updated")
      })
      
    })
    
  }