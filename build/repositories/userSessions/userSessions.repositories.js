var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomResponse } from "../../utils/Reponse/response.js";
export class UserSessionsRepositories {
    constructor(userSessionsCollection) {
        this.userSessionsCollection = userSessionsCollection;
    }
    insert(newUserSession) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userSessionsCollection.insertOne(newUserSession);
                return newUserSession;
            }
            catch (error) {
                console.error("Error creating user:", error);
                return CustomResponse.error(500, "Something went wrong");
            }
        });
    }
    updateOne(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userSessionsCollection.updateOne({ _id: sessionId }, { $set: { isValid: false } });
                return result.modifiedCount === 1;
            }
            catch (error) {
                console.error("Error in updateOne:", error);
                return false;
            }
        });
    }
    findUserSession(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userSessionsCollection.findOne(query);
                return existingUser;
            }
            catch (error) {
                console.error("Error in findUserSession:", error);
                CustomResponse.error(500, "Failed to find userSession");
            }
        });
    }
}
