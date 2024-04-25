var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        throw new CustomResponse(status, message);
    }
    static response(status, result, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(status).json(result);
        });
    }
    static handleErrorResponse(error, res) {
        const errorMessage = error.message || "Internal server error";
        const errorStatus = error.status || 500;
        const result = { error: errorMessage };
        return this.response(errorStatus, result, res);
    }
}
