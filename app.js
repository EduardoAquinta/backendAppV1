const express = require("express");
const app = express();

const { 
    getMessage
} = require("./controllers/boardgames-controllers");

app.use(express.json());

app.get("/api", getMessage);

module.exports = app;