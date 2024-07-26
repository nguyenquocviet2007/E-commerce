'use strict'

const StatusCode = {
    FORBIDEN: 403,
    CONFLICT: 409,
}

const ReasonStatusCode = {
    FORBIDEN: 'Bad Request Error',
    CONFLICT: 'Conflict Error',
}

class ErrorResponse extends Error {

    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {

    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}
class BadRequestRequestError extends ErrorResponse {

    constructor(message = ReasonStatusCode.FORBIDEN, statusCode = StatusCode.FORBIDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestRequestError
}