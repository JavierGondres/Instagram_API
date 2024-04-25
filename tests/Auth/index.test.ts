import dotenv from "dotenv";
import request from "supertest";
import express, { json } from "express";
import { createAuthRouter } from "../../src/routes/auth/index.js";
import { IncomingMessage, Server, ServerResponse } from "http";
import { MongoDbTest } from "../dbConnection/MongoDbTest.js";
import { AuthController } from "../../src/controllers/auth/index.js";
import { ValidateToken } from "../../src/middleware/verifyJWT/index.js";
import { UserService } from "../../src/services/users/user.service.js";
import { fakeUsers } from "../mocks/identitades/Users/index.js";
import { userServiceMock } from "../mocks/UserService/userSevice.mock.js";
import { Collection } from "mongodb";
import { UserSessions, Users } from "../../src/types/identidades.js";
import {
   userRepositoriesMock,
   userRepositoriesMockProps,
} from "../mocks/repositories/UserRepositories/userRepositories.mock.js";

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
      const authController = new AuthController(
         userServiceMock(userRepositoriesMockInstance) as unknown as UserService
      );

      app.use("/auth", createAuthRouter({ authController, validateToken }));
      const port = 8080;
      server = app.listen(port, () => {
         console.log(`Server listening on port ${port}`);
      });
   });

   beforeEach(async () => {
      await mongoDbTestInstance.clear();
      jest.clearAllMocks();
      userRepositoriesMockInstance.insert.mockReset()
      userRepositoriesMockInstance.findUser.mockReset()
   });

   afterAll(async () => {
      await mongoDbTestInstance.stop();
      server.close();
   });

   describe("Sign up", () => {
      it("should sign up a new user", async () => {
         const user = fakeUsers[0];
         const response = await request(app).post("/auth/v1/signUp").send(user);

         expect(response.body).toEqual({
            status: 200,
            message: "User created succesfully",
            data: user,
         });
      });

      it("should warn user exist", async () => {
         const user = fakeUsers[0];

         const response = await request(app).post("/auth/v1/signUp").send(user);

         expect(response.body).toEqual({
            status: 200,
            message: "User created succesfully",
            data: user,
         });

         userRepositoriesMockInstance.findUser.mockResolvedValue({ ...user });

         const response2 = await request(app)
            .post("/auth/v1/signUp")
            .send(user);

         expect(response2.body).toEqual({
            error: "User already exists",
         });
      });

      it("should fail because method findUser failed from userRepositoriesMock", async () => {
         userRepositoriesMockInstance.findUser.mockRejectedValue(
            new Error("Failed to find user")
         );
         const user = fakeUsers[0];
         const response = await request(app).post("/auth/v1/signUp").send(user);

         expect(response.body).toEqual({ error: "Failed to find user" });
      });

      it("should fail because method insert failed from userRepositoriesMock", async () => {
         userRepositoriesMockInstance.insert.mockRejectedValue(
            new Error("Failed to insert user")
         );
         const user = fakeUsers[0];
         const response = await request(app).post("/auth/v1/signUp").send(user);

         expect(response.body).toEqual({ error: "Failed to insert user" });
      });
   });
});
