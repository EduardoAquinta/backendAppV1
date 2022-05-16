const db = require("../db/connection");

//A model for requesting the category data from the database. 
exports.selectCategory = () => {
    return db.query('SELECT * FROM categories').then ((result) => {
        return result.rows;
    })
}