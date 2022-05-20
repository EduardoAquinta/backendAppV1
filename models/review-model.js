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
exports.selectAllReview = async (sort_by = "created_at", order = "DESC", category) => {

    const validSortBy = ["created_at", "title", "designer", "owner", "review_img_url", "review_body", "category", "votes" ]
    const validOrder = ["DESC", "ASC"]
    const validCategory = await db.query("SELECT slug FROM categories GROUP BY categories.slug")


    const validCategoryRows = validCategory.rows;
    let categoryList = validCategoryRows.map(category => category.slug);

       
    let queryStr = "SELECT reviews.review_id, reviews.title, reviews.designer,owner, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT (comments.review_id) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id"
   


    if (categoryList.includes(category) && category) {
        queryStr += ` WHERE category = '${category}'`
    }  
    else {
        if(!categoryList.includes(category) && category) {
         return Promise.reject({ status: 404, msg: "page not found"})}
    };


    queryStr += ` GROUP BY reviews.review_id`


    if (validSortBy.includes(sort_by)) {
        queryStr += ` ORDER BY ${sort_by}`;
    }
    if (!validSortBy.includes(sort_by))  {
        return Promise.reject({ status: 400, msg: "bad request"})
    };


    if (validOrder.includes(order)) {
        queryStr += ` ${order}`
    }
    if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "bad request"});
    };

    const reviewResults = await db.query(queryStr)
        return reviewResults.rows;
    
};

//A model for fetching selected comments based on review_id
exports.selectReviewComment = async (review_id) => {
    const commentResults = await db.query(`SELECT comments.comment_id, comments.created_at, comments.body, comments.votes, comments.review_id, comments.author FROM comments WHERE comments.review_id = $1 `, [review_id])
        
        
    const reviewResults = await db.query(`SELECT reviews.review_id FROM reviews WHERE reviews.review_id = $1`, [review_id]) 
        
     if (reviewResults.rows.length === 0){
        return Promise.reject({ status: 404, msg: "page not found"})
        }             
        return (commentResults.rows);
       
   


};

//A model for insert new comments based on review_id
exports.insertComment = (username, body, review_id) => {
    return db.query(`INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`, [username, body, review_id])
    .then((result) => {
        return result.rows[0];
    })
}

//A model for deleting comments based on comment_id
exports.removeCommentById = (comment_id) => {
    console.log(comment_id, "<--- model input")
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then((result) => {
        console.log(result.rows, "<--- model output")
        return result.rows;
    });
};