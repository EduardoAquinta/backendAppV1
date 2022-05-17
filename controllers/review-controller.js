const express = require("express");
const app = express();
app.use(express.json());

const {selectReview} = require("../models/review-model");


//A controller for fetching a review inputted in the url by the user
exports.getReview = (request, response, next) => {
    const {review_id} = request.params;
    selectReview(review_id).then((review) => {
        response.status(200).send({ review });
    })
    .catch((error) => {
        next(error);
        
    });
};