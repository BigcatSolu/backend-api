import schedule from 'node-schedule'
import { db } from './db.js';

const q = "SELECT * FROM users"

db.query(q, (err, results) => {
    if (err) {
      console.error('Database connection failed:', err);
    } else {
      console.log('Database connection successful:', results);
    }
  });
  

// Schedule the task to run at midnight every day
schedule.scheduleJob('36 15 * * *', () => {
    console.log('Task started at 15:36!');

    const update = "UPDATE payment SET today_topup = 0"
    db.query(update, (err, data) => {
        if (err) console.log(err)
        
        console.log("Reset Payment topup successfully")
    })
  // Your task logic goes here
  console.log('Task executed at midnight!');
});
