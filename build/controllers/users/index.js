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
                return res.status(result.status).json(result);
            }
            catch (e) {
                console.error(e);
                return res.status(501).json("Internal server error");
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
                return res.status(result.status).json(result);
            }
            catch (e) {
                console.error(e);
                return res.status(501).json("Internal server error");
            }
        });
        this.signOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = req.decodedSessionId;
                if (!sessionId) {
                    return res.status(401).json("Missing credentials");
                }
                const result = yield this.userService.signOut(sessionId);
                return res.status(result.status).json(result);
            }
            catch (e) {
                console.error(e);
                return res.status(501).json("Internal server error");
            }
        });
        this.userService = userService;
    }
}
