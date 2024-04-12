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
import { generateJWT } from "../../middleware/generateJWT/index.js";
import { CustomResponse } from "../../utils/Reponse/response.js";
export class AuthModel {
    constructor(userCollection, userSessionsCollection) {
        this.userCollection = userCollection;
        this.userSessionsCollection = userSessionsCollection;
    }
    getHashPassword(password, saltOrRounds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordHash = yield bcrypt.hash(password, saltOrRounds);
                return passwordHash;
            }
            catch (error) {
                console.error(error);
                return null;
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
                console.error(error);
                return null;
            }
        });
    }
    signUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, _id } = payload, rest = __rest(payload, ["password", "_id"]);
            const passwordHash = yield this.getHashPassword(password, 8);
            if (!passwordHash)
                return CustomResponse.error(500, "Something went wrong hashing password");
            const existingUser = yield this.findUser({ email: payload.email });
            if (existingUser) {
                return CustomResponse.error(400, "User already exists");
            }
            const newUser = Object.assign(Object.assign({}, rest), { password: passwordHash, role: rest.role || "User", _id });
            try {
                yield this.userCollection.insertOne(newUser);
                console.info("User created:", newUser.email);
                return CustomResponse.success("User created succesfully", newUser);
            }
            catch (error) {
                console.error("Error creating user:", error);
                return CustomResponse.error(500, "Something went wrong");
            }
        });
    }
    signIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.findUser({ email: payload.email });
            if (!existingUser) {
                return CustomResponse.error(404, "User not found");
            }
            const isValidPassword = yield this.getIsValidPassword(payload.password, existingUser.password);
            if (isValidPassword == false) {
                return CustomResponse.error(401, "Invalid credentials");
            }
            else if (isValidPassword == null)
                return CustomResponse.error(500, "There was a problem comparing hashed passwords");
            const sessionId = uuidv4();
            const { userAccessToken } = yield generateJWT({
                role: existingUser.role,
                userId: existingUser._id.toString(),
                sessionId,
            });
            if (!userAccessToken) {
                return CustomResponse.error(500, "failed to generate accesToken");
            }
            try {
                const userSession = {
                    _id: sessionId,
                    userId: existingUser._id,
                    token: userAccessToken,
                    createdAt: new Date(),
                    client: payload.client,
                    isValid: true,
                };
                yield this.userSessionsCollection.insertOne(userSession);
                console.info(`User ${existingUser.email} logged in`);
                return CustomResponse.success("Login succesfull", userAccessToken);
            }
            catch (error) {
                console.error("Error creating user session:", error);
                return CustomResponse.error(500, "Something went wrong");
            }
        });
    }
    signOut(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Invalidar la sesión marcando isValid como false
                yield this.userSessionsCollection.updateOne({ _id: sessionId }, { $set: { isValid: false } });
                console.info(`Session ${sessionId} signed out`);
                return CustomResponse.success("Sign out successful");
            }
            catch (error) {
                console.error("Error during sign out:", error);
                return CustomResponse.error(500, "Sign out failed");
            }
        });
    }
    findUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userCollection.findOne(query);
            return existingUser;
        });
    }
}
