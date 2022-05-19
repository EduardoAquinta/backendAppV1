const db = require("../db/connection");


//A model for selecting a specific review from the database, with added comment_count functionality.
exports.selectReview = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT (comments.review_id) ::INT AS comment_count FROM comments LEFT JOIN reviews ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id`, [review_id])
    .then (({rows}) => {
        if(!rows.length) {
            return Promise.reject({ status: 404, msg: "page not found"})
            }
            return rows[0];
    });
};

//A model for patching the vote count for a chosen review.
exports.updateVoteCount = (review_id, inc_votes) => {
    return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;', [inc_votes, review_id])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({ status: 404, msg: "page not found"});
        }
        return rows[0];
    });
};

