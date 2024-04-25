import { Collection } from "mongodb";
import { UserSessions, Users } from "../../types/identidades.js";
import { CustomResponse } from "../../utils/Reponse/response.js";
import { UserModel } from "../../models/users/index.js";
import { UserRepositories } from "../../repositories/users/users.repositories.js";
import { UserSessionModel } from "../../models/userSessions/index.js";
import { UserSessionsRepositories } from "../../repositories/userSessions/userSessions.repositories.js";
import { SignInPayload, SignUpPayload } from "./types.js";

export class UserService {
   private userModel: UserModel = new UserModel();
   private userSessionModel: UserSessionModel = new UserSessionModel();
   private userRepositories: UserRepositories;
   private userSessionRepositories: UserSessionsRepositories;

   constructor(
      userCollection: Collection<Users>,
      userSessionsCollection: Collection<UserSessions>
   ) {
      this.userRepositories = new UserRepositories(userCollection);
      this.userSessionRepositories = new UserSessionsRepositories(
         userSessionsCollection
      );
   }

   async signUp(payload: SignUpPayload) {
      const { password, email, fullName, profilePicture, role, userName } =
         payload;

      try {
         const existingUser = await this.userRepositories.findUser({
            email: payload.email,
         });
         if (existingUser) {
            CustomResponse.error(400, "User already exists");
         }
         const newUser = await this.userModel.create({
            password,
            email,
            fullName,
            profilePicture,
            role,
            userName,
         });

         await this.userRepositories.insert({
            ...newUser,
         });

         console.info("User created:", newUser.email);
         return CustomResponse.success("User created succesfully", newUser);
      } catch (error) {
         console.error("Error creating user:", error);
         if (error instanceof CustomResponse) throw error;
         else CustomResponse.error(500, "Something went wrong");
      }
   }

   async signIn(payload: SignInPayload): Promise<CustomResponse> {
      try {
         const existingUser = await this.userRepositories.findUser({
            email: payload.email,
         });

         if (!existingUser) {
            CustomResponse.error(404, "User not found");
         }

         const isValidPassword = await this.userModel.getIsValidPassword(
            payload.password,
            existingUser.password
         );

         if (isValidPassword == false) {
            CustomResponse.error(401, "Invalid credentials");
         } else if (isValidPassword == null)
            throw CustomResponse.error(
               500,
               "There was a problem comparing hashed passwords"
            );
         const newUserSession = await this.userSessionModel.create({
            client: payload.client,
            role: existingUser.role,
            userId: existingUser._id,
         });

         if (!newUserSession)
            CustomResponse.error(500, "Couldnt create userSession");

         await this.userSessionRepositories.insert(newUserSession);

         console.info(`User ${existingUser.email} logged in`);
         return CustomResponse.success(
            "Login succesfull",
            newUserSession.token
         );
      } catch (error) {
         console.error("Error creating user session:", error);
         throw error;
      }
   }

   async signOut(sessionId: string) {
      try {
         const updated = await this.userSessionRepositories.updateOne(
            sessionId
         );

         if (!updated) throw CustomResponse.error(500, "Session not found");

         console.info(`Session ${sessionId} signed out`);
         return CustomResponse.success("Sign out successful");
      } catch (error) {
         console.error("Error during sign out:", error);
         throw error;
      }
   }
}
