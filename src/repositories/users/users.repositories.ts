import { Collection } from "mongodb";
import { Users } from "../../types/identidades.js";

export class UserRepositories {
   private userCollection: Collection<Users>;

   constructor(userCollection: Collection<Users>) {
      this.userCollection = userCollection;
   }

   async insert(newUser: Users): Promise<Users> {
      try {
         await this.userCollection.insertOne(newUser);
         return newUser;
      } catch (error) {
         console.error("Error creating user:", error);
         throw error;
      }
   }

   async findUser(query: object): Promise<Users | null> {
      try {
         const existingUser = await this.userCollection.findOne(query);
         return existingUser;
      } catch (error) {
         console.error("Error in find user:", error);
         throw error;
      }
   }
}
