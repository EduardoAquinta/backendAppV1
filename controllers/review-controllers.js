const express = require("express");
const { response } = require("../app");
const app = express();
app.use(express.json());

const {selectReview, updateVoteCount, selectAllReview, selectReviewComment, insertComment} = require("../models/review-model");


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
        response.status(200).send({ comment });
    })
    .catch((error) => {
        next(error);
    })
}

// Acontroller that posts a new comment the request review_id
exports.postComment = (request, response, next) => {
    const username = request.body.username;
    const body = request.body.body;
    const {review_id} = request.params;
    insertComment(username, body, review_id).then((comment) => {
        response.status(201).send ({ comment });
    })
    .catch((error) => {
        console.log(error);
        next(error)
    });
};