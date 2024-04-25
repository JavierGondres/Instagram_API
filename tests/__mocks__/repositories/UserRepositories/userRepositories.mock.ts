import { Collection, WithId } from "mongodb";
import { Users } from "../../../../src/types/identidades";
import { userRepositoriesMockProps } from "./types";

export const userRepositoriesMock = (
   userCollection: Collection<Users>
): userRepositoriesMockProps => {
   // Configura el comportamiento predeterminado del mock findUser
   const defaultFindUserMock = jest.fn(
      async (query: object): Promise<WithId<Users> | null> => {
         try {
            const existUser = await userCollection.findOne(query);
            return existUser ? { ...existUser } : null;
         } catch (error) {
            console.error("Error in findUser:", error);
            throw error;
         }
      }
   );

   // Configura el comportamiento predeterminado del mock insert
   const defaultInsertMock = jest.fn(async (newUser: Users): Promise<Users> => {
      try {
         await userCollection.insertOne(newUser);
         console.info("User created:", newUser.email);
         return newUser;
      } catch (error) {
         console.error("Error creating user:", error);
         throw error;
      }
   });

   return {
      insert: defaultInsertMock,
      findUser: defaultFindUserMock,
   };
};
