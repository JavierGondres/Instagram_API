import dotenv from "dotenv";
import request from "supertest";
import express, { json } from "express";
import { createAuthRouter } from "../../src/routes/auth/index.js";
import { IncomingMessage, Server, ServerResponse } from "http";
import { MongoDbTest } from "../dbConnection/MongoDbTest.js";
import { ValidateToken } from "../../src/middleware/verifyJWT/index.js";
import { Collection } from "mongodb";
import { UserSessions, Users } from "../../src/types/identidades.js";
import { userRepositoriesMockProps } from "../__mocks__/repositories/UserRepositories/types.js";
import { userRepositoriesMock } from "../__mocks__/repositories/UserRepositories/userRepositories.mock.js";
import { authControllerMock } from "../__mocks__/controllers/authController/authController.mock.js";
import { userServiceMock } from "../__mocks__/services/UserService/userSevice.mock.js";
import { fakeUsers } from "../__mocks__/identitades/Users/index.js";
import { API_VERSION } from "../../src/utils/ApiVersions/apiVersion.js";

dotenv.config();

describe("Auth", () => {
   let app: express.Application;
   let server: Server<typeof IncomingMessage, typeof ServerResponse>;
   let mongoDbTestInstance: MongoDbTest;
   let userSessionCollection: Collection<UserSessions>;
   let userCollection: Collection<Users>;
   let userRepositoriesMockInstance: userRepositoriesMockProps;

   beforeAll(async () => {
      app = express();
      app.use(json());
      app.disable("x-powered-by");

      mongoDbTestInstance = await MongoDbTest.getInstance();
      userSessionCollection = mongoDbTestInstance.userSessionCollection!;
      userCollection = mongoDbTestInstance.userCollection!;

      const validateToken = new ValidateToken(
         userSessionCollection as Collection<UserSessions>
      );

      userRepositoriesMockInstance = userRepositoriesMock(userCollection);
      const authController = authControllerMock(
         userServiceMock(userRepositoriesMockInstance)
      );

      app.use(
         "/auth",
         createAuthRouter({
            authController: authController as any,
            validateToken,
         })
      );
      const port = 8080;
      server = app.listen(port, () => {
         console.log(`Server listening on port ${port}`);
      });
   });

   beforeEach(async () => {
      await mongoDbTestInstance.clear();
      jest.clearAllMocks();
      userRepositoriesMockInstance.insert.mockReset();
      userRepositoriesMockInstance.findUser.mockReset();
   });

   afterAll(async () => {
      await mongoDbTestInstance.stop();
      server.close();
   });

   describe("Sign up", () => {
      it("When user try to signUp, then the user signUp succesfully", async () => {
         //Arrange
         const user = fakeUsers[0];

         //Act
         const response = await request(app)
            .post(`/auth/${API_VERSION}/signUp`)
            .send(user);

         //Assert
         expect(response.body).toEqual({
            status: 200,
            message: "User created succesfully",
            data: user,
         });
      });

      it("When user tries to signUp twice, then the response would be an error", async () => {
         //Arrange
         const user = fakeUsers[0];
         const responseForCreatUser = await request(app)
            .post(`/auth/${API_VERSION}/signUp`)
            .send(user);

         //Act
         userRepositoriesMockInstance.findUser.mockResolvedValue({ ...user });
         const responseForCreatTheSameUser = await request(app)
            .post(`/auth/${API_VERSION}/signUp`)
            .send(user);

         //Assert
         expect(responseForCreatUser.body).toEqual({
            status: 200,
            message: "User created succesfully",
            data: user,
         });
         expect(responseForCreatTheSameUser.body).toEqual({
            error: "User already exists",
         });
      });

      it("When method findUser fail, then throws an exception", async () => {
         //Arrange
         const user = fakeUsers[0];

         //Act
         userRepositoriesMockInstance.findUser.mockRejectedValue(
            new Error("Failed to find user")
         );
         const response = await request(app)
            .post(`/auth/${API_VERSION}/signUp`)
            .send(user);

         //Assert
         expect(response.body).toEqual({ error: "Failed to find user" });
      });

      it("When method insert fail, then throws an exception", async () => {
         //Arrange
         const user = fakeUsers[0];

         //Act
         userRepositoriesMockInstance.insert.mockRejectedValue(
            new Error("Failed to insert user")
         );
         const response = await request(app)
            .post(`/auth/${API_VERSION}/signUp`)
            .send(user);

         //Assert
         expect(response.body).toEqual({ error: "Failed to insert user" });
      });
   });
});
