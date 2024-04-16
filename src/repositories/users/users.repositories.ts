import { Collection } from "mongodb";
import { Users } from "../../types/identidades.js";
import { CustomResponse } from "../../utils/Reponse/response.js";

export class UserRepositories {
   private userCollection: Collection<Users>;

   constructor(userCollection: Collection<Users>) {
      this.userCollection = userCollection;
   }

   async insert(newUser: Users): Promise<Users> {
      try {
         const existingUser = await this.findUser({ email: newUser.email });
         if (existingUser) {
            CustomResponse.error(400, "User already exists");
         }

         await this.userCollection.insertOne(newUser);
         console.info("User created:", newUser.email);
         return newUser;
      } catch (error) {
         console.error("Error creating user:", error);
         CustomResponse.error(500, "Something went wrong");
      }
   }

   async findUser(query: object): Promise<Users | null> {
      try {
         const existingUser = await this.userCollection.findOne(query);
         return existingUser;
      } catch (error) {
         console.error("Error in find user:", error);
         CustomResponse.error(500, "Failed to find user");
      }
   }
}
