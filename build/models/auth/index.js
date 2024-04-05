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
import { CustomError } from "../../utils/CustomErrors/index.js";
import { generateJWT } from "../../middleware/generateJWT/index.js";
export class AuthModel {
    constructor(userCollection, userSessionsCollection) {
        this.userCollection = userCollection;
        this.userSessionsCollection = userSessionsCollection;
    }
    signUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, _id } = payload, rest = __rest(payload, ["password", "_id"]);
            const passwordHash = yield bcrypt.hash(password, 8);
            const existingUser = yield this.findUser({ email: payload.email });
            if (existingUser) {
                throw new CustomError("User with this email already exists", 400);
            }
            const newUser = Object.assign(Object.assign({}, rest), { password: passwordHash, role: rest.role || "User", _id });
            try {
                yield this.userCollection.insertOne(newUser);
                console.info("User created:", newUser.email);
                return { error: false, message: "User created successfully" };
            }
            catch (error) {
                console.error("Error creating user:", error);
                throw new CustomError("Something went wrong", 500);
            }
        });
    }
    signIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.findUser({ email: payload.email });
            if (!existingUser) {
                throw new CustomError("User not found", 404);
            }
            const isValidPassword = yield bcrypt.compare(payload.password.toString(), existingUser.password.toString());
            if (!isValidPassword) {
                throw new CustomError("Invalid credentials", 401);
            }
            const sessionId = uuidv4();
            const { userAccessToken } = yield generateJWT({
                role: existingUser.role,
                userId: existingUser._id.toString(),
                sessionId,
            });
            if (!userAccessToken) {
                throw new CustomError("Failed to generate access token", 500);
            }
            try {
                const userSession = {
                    _id: sessionId,
                    userId: existingUser._id,
                    token: userAccessToken,
                    createdAt: new Date(),
                };
                yield this.userSessionsCollection.insertOne(userSession);
                console.info(`User ${existingUser.email} logged in`);
                return {
                    error: false,
                    message: "Login successful",
                    token: userAccessToken,
                };
            }
            catch (error) {
                console.error("Error creating user session:", error);
                throw new CustomError("Something went wrong", 500);
            }
        });
    }
    signOut(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userSessionsCollection.deleteOne({
                    _id: sessionId,
                });
                console.info(`Session ${sessionId} signed out`);
                return { error: false, message: "Sign out successful" };
            }
            catch (error) {
                console.error("Error during sign out:", error);
                throw new CustomError("Sign out failed", 500);
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
