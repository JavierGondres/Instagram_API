import { Collection } from "mongodb";
import { UserSessions } from "../../types/identidades.js";
import { CustomResponse } from "../../utils/Reponse/response.js";

export class UserSessionsRepositories {
   private userSessionsCollection: Collection<UserSessions>;

   constructor(userSessionsCollection: Collection<UserSessions>) {
      this.userSessionsCollection = userSessionsCollection;
   }

   async insert(newUserSession: UserSessions): Promise<UserSessions> {
      try {
         await this.userSessionsCollection.insertOne(newUserSession);
         return newUserSession;
      } catch (error) {
         console.error("Error creating user:", error);
         return CustomResponse.error(500, "Something went wrong");
      }
   }

   async updateOne(sessionId: string): Promise<boolean> {
      try {
         const result = await this.userSessionsCollection.updateOne(
            { _id: sessionId },
            { $set: { isValid: false } }
         );

         return result.modifiedCount === 1;
      } catch (error) {
         console.error("Error in updateOne:", error);
         return false;
      }
   }

   async findUserSession(query: object): Promise<UserSessions | null> {
      try {
         const existingUser = await this.userSessionsCollection.findOne(query);
         return existingUser;
      } catch (error) {
         console.error("Error in findUserSession:", error);
         CustomResponse.error(500, "Failed to find userSession")
      }
   }
}
