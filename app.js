const express = require("express");
const app = express();

const { 
    getMessage,
    getCategory
} = require("./controllers/boardgames-controllers");

//app.use(express.json()); ???

app.get("/api", getMessage); // a connection to make sure everything is working as it should.
app.get("/api/categories", getCategory); // a connection that returns an array of category objects.




//Error handling suite 

//Error handling for status 404
app.use("/*", (request, response, next) => {
    response.status(404).send({ msg: "Route not found" });
});


//Error handling for status 500
app.use((error, request, response, next) => {
    response.status(500).send({ msg: "internal server error" });
});


module.exports = app;