"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  CREATED: "Created",
  OK: "Success",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reason = ReasonStatusCode.OK,
    metadata = null,
  }) {
    this.message = message || reason;
    this.statusCode = statusCode;
    this.reason = reason;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }

  static create(message, statusCode, metadata) {
    return new SuccessResponse({ message, statusCode, metadata });
  }
}

class OK extends SuccessResponse {
  constructor(
    message = ReasonStatusCode.OK,
    statusCode = StatusCode.OK,
    metadata = null
  ) {
    super({ message, statusCode, reason: ReasonStatusCode.OK, metadata });
  }
  static create(message, statusCode, metadata) {
    return new OK({ message, statusCode, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor(
    message = ReasonStatusCode.CREATED,
    statusCode = StatusCode.CREATED,
    metadata = null
  ) {
    super({ message, statusCode, reason: ReasonStatusCode.CREATED, metadata });
  }
  static create(message, statusCode, metadata) {
    return new CREATED({ message, statusCode, metadata });
  }
}

module.exports = {
  SuccessResponse,
  OK,
  CREATED,
};
