const db = require("../db/connection")

//A model for requesting the user data from the database
exports.selectUser = () => {
    return db.query('SELECT * FROM users')
    .then (({ rows }) => {
        return rows;
    });
};