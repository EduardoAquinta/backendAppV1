const express = require("express"); //import and utilise the 'Express' module.
const app = express();
app.use(express.json()); //ensure express uses JSON formatting.


//The importing of the varius functions required for the endpoints utility.

const { 
    getMessage,
    getCategory
    } = require("./controllers/category-controllers");//import the category controller functions.

const {
    getReview, 
    patchVoteCount,
    getAllReviews,
    getReviewComment,
    postComment,
    deleteComment
    } = require("./controllers/review-controllers")//import the review controller functions.

const { getUsers } = require("./controllers/users-controllers")// import the user endpoint controller function.

const {
    handlePSQLErrors,
    handle404Errors,
    handleUnknownErrors, 
    handle500Errors,
    handleNullPSQLError,
    handleUndefinedKeyValues
    } = require("./controllers/error-controllers") //import the error handling functions. 

const {
    getEndpoints
    } = require("./controllers/endpoint-controller")//import the endpoint infomation controller function. 


    

//The endpoint utilities.

app.use(express.json()); //ensure express uses JSON formatting.

app.get("/api/test", getMessage); // a connection to make sure everything is working as it should.
app.get("/api/categories", getCategory); // a connection that returns an array of category objects.
app.get("/api/reviews/:review_id", getReview); // a connection that returns an object with information about a review of a particular boardgame. 
app.get("/api/users", getUsers); // a connection that returns an array of user objects.
app.get("/api/reviews", getAllReviews); // a connection that returns an array of review objects.
app.get("/api/reviews/:review_id/comments", getReviewComment)// a connection that returns and array of comments related to a review. 

app.patch("/api/reviews/:review_id", patchVoteCount);// a patch that updates the vote count for a particular review.

app.post("/api/reviews/:review_id/comments",postComment); //a connection that posts a new comment to the correct review_id

app.delete("/api/comments/:comment_id", deleteComment); // a connection that deletes a requested comment via comment_id.

app.get("/api", getEndpoints) // a connection that serves up a json representation of all available endpoints.


//Error handling suite - see ./controllers/error-controllers for further code. 

app.use(handlePSQLErrors); //Error handling for status 400.

app.use(handleNullPSQLError); //Error handling for null returns from PSQL

app.use(handleUndefinedKeyValues);//Error for handling undefined POST keys values

app.use(handle404Errors); //Error handling for status 404.

app.use(handleUnknownErrors); //Error handling for unknown error messages.

app.use(handle500Errors); //Error handling for status 500.

module.exports = app; //export the app functionality to for other files to use. 
