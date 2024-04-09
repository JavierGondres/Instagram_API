var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 } from "uuid";
import { Roles } from "../../types/enum.js";
import { CustomError } from "../../utils/CustomErrors/index.js";
export class AuthController {
    constructor(authModel) {
        this.signIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            let result = {
                error: false,
                message: "Something went wrong",
            };
            try {
                result = yield this.authModel.signIn({ email, password });
                return res.status(result.error ? 400 : 200).json(result);
            }
            catch (e) {
                console.error(e);
                result.error = true;
                result.message = "Internal server error";
                return res.status(501).json(result);
            }
        });
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, fullName, password, userName, profilePicture, role, } = req.body;
            let result = {
                error: false,
                message: "Something went wrong",
            };
            try {
                const _id = v4();
                result = yield this.authModel.signUp({
                    _id,
                    userName,
                    email,
                    fullName,
                    password,
                    profilePicture,
                    role: role || Roles.USER,
                });
                return res.status(result.error ? 400 : 200).json(result);
            }
            catch (e) {
                console.error(e);
                result.error = true;
                result.message = "Internal server error";
                return res.status(501).json(result);
            }
        });
        this.signOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = {
                error: false,
                message: "Sign out successful",
            };
            try {
                const sessionId = req.decodedSessionId;
                if (!sessionId) {
                    throw new CustomError("Session ID not found", 400);
                }
                result = yield this.authModel.signOut(sessionId);
                return res.status(result.error ? 400 : 200).json(result);
            }
            catch (e) {
                if (e instanceof CustomError) {
                    return res
                        .status(e.statusCode)
                        .json({ error: true, message: e.message });
                }
                console.error(e);
                result.error = true;
                result.message = "Internal server error";
                return res.status(501).json(result);
            }
        });
        this.authModel = authModel;
    }
}
