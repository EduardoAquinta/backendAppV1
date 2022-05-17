const express = require("express");
const app = express();

const { 
    getMessage,
    getCategory, 
    } = require("./controllers/category-controllers");

const {getReview, patchVoteCount} = require("./controllers/review-controllers")

app.use(express.json()); 

app.get("/api", getMessage); // a connection to make sure everything is working as it should.
app.get("/api/categories", getCategory); // a connection that returns an array of category objects.
app.get("/api/reviews/:review_id", getReview); // a connection that returns an object with information about a review of a particular boardgame. 

app.patch("/api/reviews/:review_id", patchVoteCount);// a patch that updates the vote count for a particular review.



//Error handling suite 

//Error handling for status 400
app.use((error, request, response, next) => {
    if (error.code ==="22P02") {
        response.status(400).send({ msg: "bad request"});
    } else {
        next(error);
    }
})

//Error handling for status 404
app.use("/*", (request, response, next) => {
    response.status(404).send({ msg: "page not found" });
});

//Error handling for unknown error messages
app.use((error, request, response, next) => {
    response.status(error.status).send( {msg: error.msg });
});

//Error handling for status 500
app.use((error, request, response, next) => {
    response.status(500).send({ msg: "internal server error" });
});


module.exports = app;