import { Collection } from "mongodb";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { UserSessions, Users } from "../../types/identidades.js";
import { generateJWT } from "../../middleware/generateJWT/index.js";
import { SignInPayload, SignUpPayload } from "./types.js";
import { CustomResponse } from "../../utils/Reponse/response.js";

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
         return CustomResponse.error(
            400,
            "User with this email already exists"
         );
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
         return CustomResponse.success("User created succesfully");
      } catch (error) {
         console.error("Error creating user:", error);
         return CustomResponse.error(500, "Something went wrong");
      }
   }

   async signIn(payload: SignInPayload): Promise<CustomResponse> {
      const existingUser = await this.findUser({ email: payload.email });
      if (!existingUser) {
         return CustomResponse.error(404, "User not found");
      }

      const isValidPassword = await bcrypt.compare(
         payload.password.toString(),
         existingUser.password.toString()
      );
      if (!isValidPassword) {
         return CustomResponse.error(401, "Invalid credentials");
      }

      const sessionId = uuidv4();
      const { userAccessToken } = await generateJWT({
         role: existingUser.role,
         userId: existingUser._id.toString(),
         sessionId,
      });

      if (!userAccessToken) {
         return CustomResponse.error(500, "failed to generate accesToken");
      }

      try {
         const userSession: UserSessions = {
            _id: sessionId,
            userId: existingUser._id,
            token: userAccessToken,
            createdAt: new Date(),
            client: payload.client,
            isValid: true,
         };

         await this.userSessionsCollection.insertOne(userSession);
         console.info(`User ${existingUser.email} logged in`);
         return CustomResponse.success("Login succesfull", userAccessToken);
      } catch (error) {
         console.error("Error creating user session:", error);
         return CustomResponse.error(500, "Something went wrong");
      }
   }

   async signOut(sessionId: string) {
      try {
         // Invalidar la sesión marcando isValid como false
         await this.userSessionsCollection.updateOne(
            { _id: sessionId },
            { $set: { isValid: false } }
         );

         console.info(`Session ${sessionId} signed out`);
         return CustomResponse.success("Sign out successful");
      } catch (error) {
         console.error("Error during sign out:", error);
         return CustomResponse.error(500, "Sign out failed");
      }
   }

   private async findUser(query: object) {
      const existingUser = await this.userCollection.findOne(query);
      return existingUser;
   }
}
