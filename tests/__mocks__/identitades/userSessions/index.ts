import { faker } from "@faker-js/faker";
import { UserSessions } from "../../../../src/types/identidades";

export class FakeUserSessions {
   static createOne(userId?: string, token?: string): UserSessions {
      return {
         _id: faker.string.uuid(),
         userId: userId ?? faker.string.uuid(),
         token: token ?? "token",
         createdAt: new Date(),
         client: "cliente",
         isValid: true,
      };
   }

   static createMultiple(cantidad: number) {
      const fakeUserSessions = faker.helpers.multiple(this.createOne, {
         count: cantidad,
      });

      return fakeUserSessions;
   }
}
