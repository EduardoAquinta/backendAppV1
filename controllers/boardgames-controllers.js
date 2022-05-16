const express = require("express");
const app = express();
app.use(express.json());

const {selectCategory} = require("../models/boardgames-models");

//A controller that returns a working OK message
exports.getMessage = (request, response) => {
    const message = {"message" : "all working well"};
        response.status(200).send(message);
};

//A controller for fetching the category table contents
exports.getCategory = (request, response) => {
    selectCategory().then((categories) => {
        response.status(200).send({categories: categories});
        });
};
