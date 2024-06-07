import { db } from "../db.js"

export const getCategory = (req, res) => {
    const q = "SELECT * FROM category WHERE category_isDisplay = 0 ORDER BY category_date ASC, category_time ASC"

    db.query(q, (err, data) => {
        if (err) return res.status(500).send(err)
        
        return res.status(200).json(data)
    })
}

export const getCategoryAdmin = (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;


    const q = "SELECT * FROM category LIMIT ? OFFSET ?"

    const total = "SELECT COUNT(*) AS totalCount FROM category"

    db.query(total, (err, data)=> {
        if (err) return res.status(500).json("Error fetching total count");
        const totalCount = data[0].totalCount

        db.query(q, [parseInt(limit), parseInt(offset)], (err, data) => {
            if (err) return res.status(404).json("category not found");
            return res.status(200).json({ category: data, totalCount });
        })
    })
}

export const getCategoryDetails = (req, res) => {
    const q = "SELECT * FROM category WHERE category_id = ?"

    db.query(q, req.params.id, (err, data) => {
        if (err) return res.status(500).json("ERROR category fetching")

    return res.status(200).json(data)
    })
}

export const getSubCategory = (req, res) => {
    console.log("Hello");
}

export const addCategory = (req, res) => {
    const q = "INSERT INTO category (`category_name`, `category_img`) VALUES (?)"

    const values = [
        req.body.cateName,
        req.body.cateImg
    ]

    console.log(values)

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json("ERROR INSERTING category")

        return res.status(200).json("Add category Successfully")
    })
}

export const displayCategory = (req, res) => {
    const q = "UPDATE category SET category_isDisplay = 0, category_date = CURRENT_DATE(), category_time = CURRENT_TIME() WHERE category_id = ?";

    const categoryId = req.body.id; // Assuming req.body.id contains the category ID

    db.query(q, [categoryId], (err, data) => {
        if (err) return res.status(500).json("ERROR UPDATING category");

        return res.status(200).json("Display Category Changed");
    });
}


export const unDisplayCategory = (req, res) => {
    const q = "UPDATE category SET category_isDisplay = 1, category_date = NULL, category_time = NULL WHERE category_id = ?";

    const categoryId = req.body.id; // Assuming req.body.id contains the category ID

    db.query(q, [categoryId], (err, data) => {
        if (err) return res.status(500).json("ERROR UPDATING category");

        return res.status(200).json("Display Category Changed");
    });
    
}


export const updateCategory = (req, res) => {
    console.log("Hi")

    const q = "UPDATE category SET category_name = ?, category_img = ? WHERE category_id = ?"

    const name = req.body.cateName
    const img = req.body.cateImg
    const id = req.body.category_id

    console.log(name)
    console.log(img)
    console.log(id)

    db.query(q, [name, img, id], (err, data) => {
        if (err) return res.status(500).json("INTERNAL ERROR")
        return res.status(200).json("Edit successfully")
    })
}

export const deleteCategory = (req, res) => {
    const q = "DELETE FROM category WHERE category_id = ?";

    const categoryId = req.query.id;

    // Check if categoryId is provided and valid
    if (!categoryId) {
        return res.status(400).json("Category ID is required");
    }

    db.query(q, [categoryId], (err, data) => {
        if (err) return res.status(500).json("INTERNAL ERROR");
        return res.status(200).json("Delete successfully");
    });
}