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

//A model for fetching all the reviews from the database, in decending date order.
exports.selectAllReview = () => {
    return db.query(`SELECT reviews.review_id, reviews.title, reviews.designer,owner, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT (comments.review_id) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = reviews.review_id GROUP BY reviews.review_id  ORDER BY created_at DESC`)
    .then(({ rows }) => {
        return rows;
    })
}

exports.selectReviewComment = async (review_id) => {
    const commentResults = await db.query(`SELECT comments.comment_id, comments.created_at, comments.body, comments.votes, comments.review_id, comments.author FROM comments WHERE comments.review_id = $1 `, [review_id])
        
        
    const reviewResults = await db.query(`SELECT reviews.review_id FROM reviews WHERE reviews.review_id = $1`, [review_id]) 
        
     if (reviewResults.rows.length === 0){
        return Promise.reject({ status: 404, msg: "page not found"})
        }             
        return (commentResults.rows);
       
   


};

exports.insertComment = (username, body, review_id) => {
    console.log(username, body, review_id, "<--- Model input")
    return db.query(`INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`, [username, body, review_id])
    .then((result) => {
        console.log(result.rows, "<--- Model output")
        return result.rows[0];
    })
}