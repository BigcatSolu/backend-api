import { db } from "../db.js"

export const getPayment = (req, res) => {
    const q = "SELECT * FROM payment ORDER BY today_topup DESC"

    db.query(q, (err, data) => {
        if (err) return res.status(500).send(err)

        return res.status(200).json(data)
    })
}

export const getTruewallet = (req, res) => {
    const type = "True Wallet"
    const q = "SELECT * FROM payment WHERE payment_type = 'True Wallet' AND payment_count < payment_count_limit AND today_topup < payment_limit LIMIT 1"

    db.query(q, (err, data) => {
        if (err) return res.status(500).send(err)

        return res.status(200).json(data)
    })
}
export const adminGetTruewallet = (req, res) => {
    const q = "SELECT * FROM payment WHERE payment_type = 'True Wallet' ORDER BY add_date ASC, add_time ASC";

    console.log("Hello");

    db.query(q, (err, data) => {
        if (err) return res.status(404).json("TRUEWALLET NOT FOUND");

        // Check if data is an array
        if (!Array.isArray(data)) {
            return res.status(404).json("Data is not an array");
        }

        // Call getStatus with the array of payments
        getStatus(data, res);
    });
};

const getStatus = (payments, res) => {
    let workingFound = false;

    // Loop through each payment
    for (const payment of payments) {
        // Check if payment meets conditions for "Working" status
        if (!workingFound && payment.payment_count < payment.payment_count_limit && payment.today_topup < payment.payment_limit) {
            workingFound = true;
            payment.status = 'Working';
        } else if (payment.payment_count >= payment.payment_count_limit) {
            payment.status = 'Not Available';
        } else {
            payment.status = 'Available';
        }
    }

    // Check if all payments are "Not Available"
    const allNotAvailable = payments.every(payment => payment.status === 'Not Available');

    if (allNotAvailable) {
        // Perform the database update if all are "Not Available"
        const updateQuery = "UPDATE payment SET payment_count = 0 WHERE payment_type = 'True Wallet'";

        db.query(updateQuery, (err, result) => {
            if (err) return res.status(500).json("INTERNAL ERROR");
            console.log("All payments updated to payment_count = 0");
            return res.status(200).json("All payments updated to payment_count = 0");
        });
    } else {
        return res.status(200).json(payments); // Return the updated array of payments if not all are "Not Available"
    }
};


// export const adminGetTruewallet = (req, res) => {
//     const q = "SELECT * FROM payment WHERE payment_type = 'True Wallet' ORDER BY add_date ASC, add_time ASC";

//     console.log("Hello")

//     db.query(q, (err, data) => {
//         if (err) return res.status(404).json("TRUEWALLET NOT FOUND");

//         // Check if data is an array
//         if (!Array.isArray(data)) {
//             return res.status(404).json("Data is not an array");
//         }

//         // Call getStatus with the array of payments
//         const updatedData = getStatus(data);

//         return res.status(200).json(updatedData);
//     });
// };

// const getStatus = (payments) => {
//     let workingFound = false;
//     let notAvailableFound = false;

//     // Loop through each payment
//     for (const payment of payments) {

//         // Check if payment meets conditions for "Working" status
//         if (!workingFound && payment.payment_count < payment.payment_count_limit && payment.today_topup < payment.payment_limit) {
//             workingFound = true;
//             payment.status = 'Working';
//         } else if (!notAvailableFound && payment.payment_count >= payment.payment_count_limit) {
//             // notAvailableFound = true;
//             payment.status = 'Not Available';
//         } else {
//             // If it's not the first one meeting the conditions, classify as "Available"
//             payment.status = 'Available';
//         }

//         if (!workingFound) {
//             for (const payment of payments) {

//                 const q = "UPDATE payment SET payment_count = 0 WHERE ?"
//                 db.query(q, payment.payment_id, (err, data) => {
//                     if (err) return res.status(500).json("INTERNAL ERROR")
//                     console.log(payment.payment_id)
                    
//                 })
                
//             }
//         }
//     }

//     return payments; // Return the updated array of payments
// };

// export const adminGetTruewallet = (req, res) => {
//     const q = "SELECT * FROM payment WHERE payment_type = 'True Wallet' ORDER BY add_date ASC, add_time ASC"

//     db.query(q, (err, data) => {
//         if (err) return res.status(404).json("TRUEWALLET NOT FOUND")
        
//         return res.status(200).json(data)
//     })
// }

export const getKasikorn = (req, res) => {
    const q = "SELECT * FROM payment WHERE payment_type = 'ธนาคารกสิกรไทย'"

    db.query(q, (err, data) => {
        if (err) return res.status(404).json("KASIKORN BANK NOT FOUND")
        return res.status(200).json(data)
    })
}

export const getBankSlip = (req, res) => {
    const type = "ธนาคารกสิกรไทย"
    const q = "SELECT * FROM payment WHERE payment_type = ?"

    db.query(q, [type], (err, data) => {
        if (err) return res.status(500).send(err)

        return res.status(200).json(data)
    })
}

export const getPaymentById = (req, res) => {
    console.log("hello")
    const id = req.params.id

    console.log(id)
    const q = "SELECT * FROM payment WHERE payment_id = ?"

    db.query(q, id, (err, data) => {
        if (err) return res.status(500).send(err)

        return res.status(200).json(data)
    })
}

export const addPayment = (req, res) => {
    const q = "INSERT INTO payment (payment_type, payment_limit,  payment_num, payment_count_limit) VALUES (?)"

    const values = [
        req.body.payment_type,
        req.body.payment_limit,
        req.body.payment_num,
        req.body.payment_count_limit,
        // req.body.payment_image,
        // req.body.payment_acceptname,
    ]
    console.log(values)

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json("INTERNAL ERROR")
        console.log("Hello")

        return res.status(200).json("INSERT successfully")
    })

}

export const updatePayment = (req, res) => {
    const q = "UPDATE payment SET payment_type = ?, payment_limit = ?, payment_count_limit = ?, payment_num = ? WHERE payment_id = ?"
    
    const values = [
        req.body.payment_type,
        req.body.payment_limit,
        req.body.payment_count_limit,
        req.body.payment_num,
        req.body.payment_id
    ]

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json("INTERNAL ERROR")
            console.log("done")
    
        return res.status(200).json("UPDATE successfully")
    })

    console.log(values)

}
    

export const deletePayment = (req, res) => {
    const q = "DELETE FROM payment WHERE payment_id = ?"

    db.query(q, [req.body.payment_id], (err, data) => {
        if (err) return res.status(500).json("INTERNAL ERROR")
            console.log("Hello")
    
            return res.status(200).json("Delete successfully")
    })
}