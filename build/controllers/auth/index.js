var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Roles } from "../../types/enum.js";
import { CustomResponse } from "../../utils/Reponse/response.js";
export class AuthController {
    constructor(userService) {
        this.signIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const client = req.headers["user-agent"];
            try {
                const result = yield this.userService.signIn({
                    email,
                    password: password.toString(),
                    client: client !== null && client !== void 0 ? client : "No client",
                });
                return CustomResponse.response(result.status, result, res);
            }
            catch (error) {
                console.error("Error during sign-in:", error);
                return CustomResponse.handleErrorResponse(error, res);
            }
        });
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, fullName, password, userName, profilePicture, role, } = req.body;
            try {
                const result = yield this.userService.signUp({
                    userName,
                    email,
                    fullName,
                    password: password.toString(),
                    profilePicture,
                    role: role || Roles.USER,
                });
                return CustomResponse.response(result.status, result, res);
            }
            catch (error) {
                console.error("Error during signUp:", error);
                return CustomResponse.handleErrorResponse(error, res);
            }
        });
        this.signOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = req.decodedSessionId;
                if (!sessionId) {
                    return res.status(401).json("Missing credentials");
                }
                const result = yield this.userService.signOut(sessionId);
                return CustomResponse.response(result.status, result, res);
            }
            catch (error) {
                console.error("Error during signOut:", error);
                return CustomResponse.handleErrorResponse(error, res);
            }
        });
        this.userService = userService;
    }
}
