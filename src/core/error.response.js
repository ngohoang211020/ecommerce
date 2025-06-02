'use strict'

const StatusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
}

const ReasonStatusCode = {
  FORBIDDEN: 'Bad request error',
  CONFLICT: 'Conflict error',
}

class ErrorResponse extends Error {
  constructor( message, status ) {
    super(message)
    this.status = status
  }

}


class ConflictError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode );
  }
}
class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.BAD_REQUEST) {
    super( message, statusCode );
  }
}
class NotFoundError extends ErrorResponse {
  constructor(message = 'Not Found', statusCode = StatusCode.NOT_FOUND) {
    super( message, statusCode );
  }
}
class InternalServerError extends ErrorResponse {
  constructor(message = 'Internal Server Error', statusCode = StatusCode.INTERNAL_SERVER_ERROR) {
    super( message, statusCode );
  }
}
class UnauthorizedError extends ErrorResponse {
  constructor(message = 'Unauthorized', statusCode = StatusCode.UNAUTHORIZED) {
    super( message, statusCode );
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super( message, statusCode );
  }
}
class AcceptedError extends ErrorResponse {
  constructor(message = 'Accepted', statusCode = StatusCode.ACCEPTED) {
    super( message, statusCode );
  }
}


module.exports = {
  ErrorResponse,
  ConflictError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
  UnauthorizedError,
  ForbiddenError,
  AcceptedError
};