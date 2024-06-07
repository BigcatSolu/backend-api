import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import postsRoutes from './routes/posts.js'
import saleRoutes from './routes/sale.js'
import categoryRoutes from './routes/category.js'
import topupRoutes from './routes/topup.js'
import totalRoutes from './routes/total.js'
import bannersRoutes from './routes/banners.js'
import cookieParser from 'cookie-parser'
import multer from 'multer';
import paymentRoutes from './routes/payment.js'
import reportRoutes from './routes/report.js'
import noticeRoutes from './routes/notice.js'
import orderRoutes from './routes/order.js'
import orderStatusRoutes from './routes/orderStatus.js'
import adminRoutes from './routes/dashboard.js'
import announceRoutes from './routes/announce.js'
import profilesRoutes from './routes/profiles.js'
import recommentsRoutes from './routes/recomments.js'
import optionRoutes from './routes/idoption.js'
import posterRoutes from './routes/poster.js'

import env from 'dotenv'
import { db } from './db.js';
import schedule from 'node-schedule'

env.config()
const app = express()

const corsOptions = {
    origin: 'http://localhost:5173', // Specify allowed origin(s)
    methods: ['POST', 'GET', 'OPTIONS'], // Specify allowed method(s)
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Authorization'], // Specify allowed header(s)
  };cors(corsOptions),

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({ storage })

app.post('/api/uploads',cors(corsOptions), upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).send("no file uploaded")
    }
    const files = req.file
    res.status(200).json(files.filename)
})

schedule.scheduleJob('0 0 1 * *', () => {
    console.log('Task started at 15:40!');

    const update = "UPDATE payment SET payment_count = 0, today_topup = 0"
    db.query(update, (err, data) => {
        if (err) console.log(err)
        
        console.log("Reset Payment topup successfully")
    })
  // Your task logic goes here
  console.log('Task executed at midnight!');
});



app.get('/api/testing', (req, res) => {
    const q = "SELECT * FROM form"
    console.log('start test')
    db.query(q, (err, data) => {
        if (err) return res.status(404).json("test not found")
        console.log('get test')
        return res.status(200).json(data)
    })
})


// app.use("/api/category") 
app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/sale", saleRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/topup', topupRoutes)
app.use('/api/totaltopup', totalRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/banners', bannersRoutes)
app.use('/api/report', reportRoutes)
app.use('/api/notice', noticeRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/orderstatus', orderStatusRoutes)
app.use('/api/admindashboard', adminRoutes)
app.use('/api/announce', announceRoutes)
app.use('/api/profiles', profilesRoutes)
app.use('/api/recomments', recommentsRoutes)
app.use('/api/option', optionRoutes)
app.use('/api/poster', posterRoutes)

app.listen(8800, () => {
    console.log("Connected")
})