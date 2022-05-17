const express = require("express");
const app = express();

const { 
    getMessage,
    getCategory, 
    } = require("./controllers/category-controllers");

const {getReview, patchVoteCount} = require("./controllers/review-controllers")

const {handlePSQLErrors, handle404Errors, handleUnknownErrors, handle500Errors} = require("./controllers/error-controllers")

app.use(express.json()); 

app.get("/api", getMessage); // a connection to make sure everything is working as it should.
app.get("/api/categories", getCategory); // a connection that returns an array of category objects.
app.get("/api/reviews/:review_id", getReview); // a connection that returns an object with information about a review of a particular boardgame. 

app.patch("/api/reviews/:review_id", patchVoteCount);// a patch that updates the vote count for a particular review.



//Error handling suite - see ./controllers/error-controllers for code. 

//Error handling for status 400
app.use(handlePSQLErrors);

//Error handling for status 404
app.use(handle404Errors);

//Error handling for unknown error messages
app.use(handleUnknownErrors);

//Error handling for status 500
app.use(handle500Errors);


module.exports = app;