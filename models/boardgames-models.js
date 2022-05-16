const db = require("../db/connection");

//A model for requesting the category data from the database. 
exports.selectCategory = () => {
    return db.query('SELECT * FROM categories').then ((result) => {
        return result.rows;
    })
}
exports.selectReview = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
    .then ((result) => {
    return result.rows[0];
    });
}