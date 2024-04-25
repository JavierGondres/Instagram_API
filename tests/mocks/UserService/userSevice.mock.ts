import { SignUpPayload } from "../../../src/controllers/auth/types";
import { CustomResponse } from "../../../src/utils/Reponse/response";
import { userModelMock } from "../models/UserModel/userModel.mock";
import { userRepositoriesMockProps } from "../repositories/UserRepositories/userRepositories.mock";

export const userServiceMock = (userRepositoriesMockInstance: userRepositoriesMockProps) => ({
   signUp: jest.fn(async (payload: SignUpPayload) => {
      try {
         const existUser = await userRepositoriesMockInstance.findUser({
            email: payload.email,
         });

         if (existUser) throw CustomResponse.error(400, "User already exists");
         const newUser = await userModelMock.create();

         await userRepositoriesMockInstance.insert({
            ...newUser,
         });
         return CustomResponse.success("User created succesfully", newUser);
      } catch (error) {
         console.error("Error creating user:", error);
         throw error;
      }
   }),

   signIn: jest.fn(async () => {
      // Aquí puedes definir el comportamiento esperado del método signIn durante las pruebas
      // Por ejemplo, puedes devolver una respuesta ficticia
      return CustomResponse.success("Login succesfull", "mocked-token");
   }),

   signOut: jest.fn(async () => {
      // Aquí puedes definir el comportamiento esperado del método signOut durante las pruebas
      // Por ejemplo, puedes devolver una respuesta ficticia
      return CustomResponse.success("Sign out successful");
   }),
});
