"use strict";

const StatusCode = {
    OK: 200,
    CREATED: 201,
};

const ReasonStatusCode = {
    [StatusCode.OK]: "Success",
    [StatusCode.CREATED]: "Created",
};

class SuccessResponse {
    constructor({message, statusCode = StatusCode.OK, metadata = {}}) {
        this.message = message || ReasonStatusCode[statusCode];
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        if (Object.keys(headers).length > 0) {
            res.set(headers);
        }
        return res.status(this.status).json(this);
    }

    static create(message, statusCode, metadata) {
        return new SuccessResponse(message, statusCode, metadata);
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, statusCode:StatusCode.OK, metadata});
    }

    static create(message, metadata) {
        return new OK(message, metadata);
    }
}

class CREATED extends SuccessResponse {
    constructor({message, metadata, options = {}}) {
      super({message, statusCode:StatusCode.CREATED, metadata});
        this.options = options;
    }

    static create(message, metadata, options) {
        return new CREATED(message, metadata, options);
    }
}

module.exports = {
    SuccessResponse,
    OK,
    CREATED,
};

