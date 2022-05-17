const db = require("../db/connection");


//A model for selecting a specific review from the database
exports.selectReview = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
    .then (({rows}) => {
        if(!rows.length) {
            return Promise.reject({ status: 404, msg: "page not found"})
            }
            return rows[0];
    });
}