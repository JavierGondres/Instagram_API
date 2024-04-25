var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class UserRepositories {
    constructor(userCollection) {
        this.userCollection = userCollection;
    }
    insert(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userCollection.insertOne(newUser);
                return newUser;
            }
            catch (error) {
                console.error("Error creating user:", error);
                throw error;
            }
        });
    }
    findUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userCollection.findOne(query);
                return existingUser;
            }
            catch (error) {
                console.error("Error in find user:", error);
                throw error;
            }
        });
    }
}
