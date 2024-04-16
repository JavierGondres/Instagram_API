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
import { UserModel } from "../../models/users/index.js";
import { UserRepositories } from "../../repositories/users/users.repositories.js";
import { UserSessionModel } from "../../models/userSessions/index.js";
import { UserSessionsRepositories } from "../../repositories/userSessions/userSessions.repositories.js";
export class UserService {
    constructor(userCollection, userSessionsCollection) {
        this.userModel = new UserModel();
        this.userSessionModel = new UserSessionModel();
        this.userRepositories = new UserRepositories(userCollection);
        this.userSessionRepositories = new UserSessionsRepositories(userSessionsCollection);
    }
    signUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email, fullName, profilePicture, role, userName } = payload;
            const existingUser = yield this.userRepositories.findUser({
                email: payload.email,
            });
            if (existingUser) {
                throw CustomResponse.error(400, "User already exists");
            }
            try {
                const newUser = yield this.userModel.create({
                    password,
                    email,
                    fullName,
                    profilePicture,
                    role,
                    userName,
                });
                yield this.userRepositories.insert(Object.assign({}, newUser));
                console.info("User created:", newUser.email);
                return CustomResponse.success("User created succesfully", newUser);
            }
            catch (error) {
                console.error("Error creating user:", error);
                throw CustomResponse.error(500, "Something went wrong");
            }
        });
    }
    signIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepositories.findUser({
                email: payload.email,
            });
            if (!existingUser) {
                CustomResponse.error(404, "User not found");
            }
            const isValidPassword = yield this.userModel.getIsValidPassword(payload.password, existingUser.password);
            if (isValidPassword == false) {
                CustomResponse.error(401, "Invalid credentials");
            }
            else if (isValidPassword == null)
                throw CustomResponse.error(500, "There was a problem comparing hashed passwords");
            try {
                const newUserSession = yield this.userSessionModel.create({
                    client: payload.client,
                    role: existingUser.role,
                    userId: existingUser._id,
                });
                if (!newUserSession)
                    CustomResponse.error(500, "Couldnt create userSession");
                yield this.userSessionRepositories.insert(newUserSession);
                console.info(`User ${existingUser.email} logged in`);
                return CustomResponse.success("Login succesfull", newUserSession.token);
            }
            catch (error) {
                console.error("Error creating user session:", error);
                CustomResponse.error(500, "Something went wrong");
            }
        });
    }
    signOut(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Invalidar la sesión marcando isValid como false
                const updated = yield this.userSessionRepositories.updateOne(sessionId);
                if (!updated)
                    throw CustomResponse.error(500, "Session not found");
                console.info(`Session ${sessionId} signed out`);
                return CustomResponse.success("Sign out successful");
            }
            catch (error) {
                console.error("Error during sign out:", error);
                CustomResponse.error(500, "Sign out failed");
            }
        });
    }
}
