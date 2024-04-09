import { Collection } from "mongodb";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { UserSessions, Users } from "../../types/identidades.js";
import { CustomError } from "../../utils/CustomErrors/index.js";
import { generateJWT } from "../../middleware/generateJWT/index.js";
import { SignInPayload, SignUpPayload } from "./types.js";

export class AuthModel {
   private userCollection: Collection<Users>;
   private userSessionsCollection: Collection<UserSessions>;

   constructor(
      userCollection: Collection<Users>,
      userSessionsCollection: Collection<UserSessions>
   ) {
      this.userCollection = userCollection;
      this.userSessionsCollection = userSessionsCollection;
   }

   async signUp(payload: SignUpPayload) {
      const { password, _id, ...rest } = payload;
      const passwordHash = await bcrypt.hash(password, 8);

      const existingUser = await this.findUser({ email: payload.email });
      if (existingUser) {
         throw new CustomError("User with this email already exists", 400);
      }

      const newUser: Users = {
         ...rest,
         password: passwordHash,
         role: rest.role || "User",
         _id,
      };

      try {
         await this.userCollection.insertOne(newUser);
         console.info("User created:", newUser.email);
         return { error: false, message: "User created successfully" };
      } catch (error) {
         console.error("Error creating user:", error);
         throw new CustomError("Something went wrong", 500);
      }
   }

   async signIn(payload: SignInPayload) {
      const existingUser = await this.findUser({ email: payload.email });
      if (!existingUser) {
         throw new CustomError("User not found", 404);
      }

      const isValidPassword = await bcrypt.compare(
         payload.password.toString(),
         existingUser.password.toString()
      );
      if (!isValidPassword) {
         throw new CustomError("Invalid credentials", 401);
      }

      const sessionId = uuidv4();
      const { userAccessToken } = await generateJWT({
         role: existingUser.role,
         userId: existingUser._id.toString(),
         sessionId,
      });

      if (!userAccessToken) {
         throw new CustomError("Failed to generate access token", 500);
      }

      try {
         const userSession: UserSessions = {
            _id: sessionId,
            userId: existingUser._id,
            token: userAccessToken,
            createdAt: new Date(),
         };

         await this.userSessionsCollection.insertOne(userSession);
         console.info(`User ${existingUser.email} logged in`);
         return {
            error: false,
            message: "Login successful",
            token: userAccessToken,
         };
      } catch (error) {
         console.error("Error creating user session:", error);
         throw new CustomError("Something went wrong", 500);
      }
   }

   async signOut(sessionId: string) {
      try {
         await this.userSessionsCollection.deleteOne({
            _id: sessionId,
         });
         console.info(`Session ${sessionId} signed out`);
         return { error: false, message: "Sign out successful" };
      } catch (error) {
         console.error("Error during sign out:", error);
         throw new CustomError("Sign out failed", 500);
      }
   }

   private async findUser(query: object) {
      const existingUser = await this.userCollection.findOne(query);
      return existingUser;
   }
}
