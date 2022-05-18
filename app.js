const express = require("express"); //import and utilise the 'Express' module.
const app = express();

const { 
    getMessage,
    getCategory, 
    } = require("./controllers/category-controllers");//import the category controller functions.

const {getReview, patchVoteCount} = require("./controllers/review-controllers")//import the review controller functions.

const {
    handlePSQLErrors,
    handle404Errors,
    handleUnknownErrors, 
    handle500Errors,
    handleNullPSQLError
    } = require("./controllers/error-controllers") //import the error handling functions. 

app.use(express.json()); //ensure express uses JSON formatting.

app.get("/api", getMessage); // a connection to make sure everything is working as it should.
app.get("/api/categories", getCategory); // a connection that returns an array of category objects.
app.get("/api/reviews/:review_id", getReview); // a connection that returns an object with information about a review of a particular boardgame. 

app.patch("/api/reviews/:review_id", patchVoteCount);// a patch that updates the vote count for a particular review.



//Error handling suite - see ./controllers/error-controllers for code. 

//Error handling for status 400.
app.use(handlePSQLErrors);

//Error handling for null returns from PSQL
app.use(handleNullPSQLError);

//Error handling for status 404.
app.use(handle404Errors);

//Error handling for unknown error messages.
app.use(handleUnknownErrors);

//Error handling for status 500.
app.use(handle500Errors);

//export the app functionality to for other files to use. 
module.exports = app;