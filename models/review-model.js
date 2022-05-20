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

//A model for fetchig all the reviews from the database, in decending date order.
exports.selectAllReview = () => {
    return db.query(`SELECT reviews.review_id, reviews.title, reviews.designer,owner, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT (comments.review_id) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = reviews.review_id GROUP BY reviews.review_id  ORDER BY created_at DESC`)
    .then(({ rows }) => {
        return rows;
    })
}

exports.selectReviewComment = async (review_id) => {
    const result = await db.query(`SELECT comments.comment_id, comments.created_at, comments.body, comments.votes, comments.review_id, comments.author FROM comments WHERE comments.review_id = $1 `, [review_id])
        
        
    const result2 = await db.query(`SELECT reviews.review_id FROM reviews GROUP BY reviews.review_id`) 
        
         
    if (review_id > result2.rowCount){
        return Promise.reject({ status: 404, msg: "page not found"})
        }

    if (!result.rows.length) {
        return ([]);
       }            
      
        return (result.rows)
            
};