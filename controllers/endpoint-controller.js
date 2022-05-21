const express = require("express");
const app = express();
app.use(express.json());

const endpoints = require("../endpoints.json")

const {} = require("../models/endpoint-model")

// A controller to fetch the endpoint list from endpints.json file. 
exports.getEndpoints = (request, response, next) => {
    response.status(200).send(endpoints)    
    .catch((error) => {
        next(error);
    });
};