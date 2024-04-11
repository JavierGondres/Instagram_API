export class CustomResponse {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
    static success(message, data) {
        return new CustomResponse(200, message, data);
    }
    static error(status, message) {
        return new CustomResponse(status, message);
    }
}
