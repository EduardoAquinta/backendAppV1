//Error handling for status 400
exports.handlePSQLErrors = (error, request, response, next) => {
    if (error.code ==="22P02") {
        response.status(400).send({ msg: "bad request"});
    } else {
        next(error);
    }
};

exports.handleNullPSQLError = (error, request, response, next) => {
    if (error.code === "23502") {
        response.status(400).send({ msg: "bad request"});
    } else {
        next(error);
    }
}

//Error handling for status 404
exports.handle404Errors = ("/*", (request, response, next) => {
    response.status(404).send({ msg: "page not found" });
});

//Error handling for unknown error messages
exports.handleUnknownErrors = ((error, request, response, next) => {
    response.status(error.status).send( {msg: error.msg });
});

//Error handling for status 500
exports.handle500Errors = ((error, request, response, next) => {
    response.status(500).send({ msg: "internal server error" });
});
