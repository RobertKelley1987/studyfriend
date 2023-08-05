class ExpressError extends Error {
    constructor(statusCode, name, message) {
        super();
        this.statusCode = statusCode;
        this.name = name;
        this.message = message;
    }
}

module.exports = ExpressError;