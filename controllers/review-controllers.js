const express = require("express");
const { response } = require("../app");
const app = express();
app.use(express.json());

const {selectReview, updateVoteCount, selectAllReview, selectReviewComment} = require("../models/review-model");


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

//A controller for patching the vote count in a chosen review_id
exports.patchVoteCount = (request, response, next) => {
    const {review_id} = request.params;
    const {inc_votes} = request.body;
    updateVoteCount(review_id, inc_votes).then((review) => {
        response.status(200).send({ review })
    })
    .catch((error) => {
        next(error);
    });
};

//A controller for fetching all of the reviews held in the database
exports.getAllReviews = (request, response) => {
    selectAllReview().then((reviews) => {
        response.status(200).send({ reviews: reviews })
    })
}

//A controller for fetching a comment object based on a review_id
exports.getReviewComment = (request, response, next) => {
    const {review_id} = request.params;
    selectReviewComment(review_id).then((comment) => {
        console.log(Object.keys(comment));
        response.status(200).send({ comment });
    })
    .catch((error) => {
        next(error);
    })
}