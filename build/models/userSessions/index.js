var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuidv4 } from "uuid";
import { generateJWT } from "../../middleware/generateJWT/index.js";
export class UserSessionModel {
    generateToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ role, sessionId, userId, }) {
            try {
                const { userAccessToken } = yield generateJWT({
                    role,
                    userId,
                    sessionId,
                });
                return userAccessToken;
            }
            catch (error) {
                console.error("Error en generateToke: ", error);
                return null;
            }
        });
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, userId, role } = payload;
            const sessionId = uuidv4();
            const token = yield this.generateToken({ role, sessionId, userId });
            if (!token)
                return null;
            try {
                const userSession = {
                    _id: sessionId,
                    userId: userId,
                    token,
                    createdAt: new Date(),
                    client: client,
                    isValid: true,
                };
                return userSession;
            }
            catch (error) {
                console.error("Error creating user:", error);
                return null;
            }
        });
    }
}
