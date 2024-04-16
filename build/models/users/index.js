var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { CustomResponse } from "../../utils/Reponse/response.js";
export class UserModel {
    getHashPassword(password, saltOrRounds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordHash = yield bcrypt.hash(password, saltOrRounds);
                return passwordHash;
            }
            catch (error) {
                console.error("Error, couldnt hash password: ", error);
                CustomResponse.error(500, "couldnt hash password");
            }
        });
    }
    getIsValidPassword(unHashedPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValidPassword = yield bcrypt.compare(unHashedPassword, hashedPassword);
                return isValidPassword;
            }
            catch (error) {
                console.error("Error, couldnt validate password: ", error);
                CustomResponse.error(500, "Error, couldnt validate password: ");
            }
        });
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = payload, rest = __rest(payload, ["password"]);
                const passwordHash = yield this.getHashPassword(password, 8);
                const _id = uuidv4();
                const newUser = Object.assign(Object.assign({}, rest), { password: passwordHash, role: rest.role || "User", _id });
                return newUser;
            }
            catch (error) {
                console.error("Error creating user:", error);
                CustomResponse.error(500, "couldnt create user");
            }
        });
    }
}
