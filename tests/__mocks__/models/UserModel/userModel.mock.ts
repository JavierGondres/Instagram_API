import { fakeUsers } from "../../identitades/Users";

export const userModelMock = {
   create: jest.fn().mockResolvedValue(fakeUsers[0]),
   getHashPassword: jest.fn().mockResolvedValue("hashContrasenia"),
   getIsValidPassword: jest.fn().mockResolvedValue(true),
};
