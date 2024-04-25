import { Collection, WithId } from "mongodb";
import { Users } from "../../../../src/types/identidades";

export type userRepositoriesMockProps = {
   insert: jest.Mock<Promise<Users>, [newUser: Users], any>;
   findUser: jest.Mock<Promise<WithId<Users> | null>, [query: object], any>;
};
