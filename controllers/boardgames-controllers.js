const express = require("express");
const app = express();
app.use(express.json());

exports.getMessage = (request, response) => {
    const message = {"message" : "all working well"};
    response.status(200).send(message);
}