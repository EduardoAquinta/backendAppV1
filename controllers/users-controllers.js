const express = require("express");
const app = express();
app.use(express.json());

const { selectUser} = require("../models/users-models")

//A controller for fetching the user table contents
exports.getUsers = (request, response, next) => {
        selectUser().then((users) => {
        response.status(200).send({users: users});
    })
};