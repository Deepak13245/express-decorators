export class HttpResponse {
    constructor(body, status = 200, headers = {}) {
        this.status = status;
        this.body = body;
        this.headers = headers;
    }
}

export class HttpError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
