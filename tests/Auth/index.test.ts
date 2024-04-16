import dotenv from "dotenv";
import { Collection } from "mongodb";
import request from "supertest";
import { DBCollections } from "../../src/types/enum.js";
import { UserSessions, Users } from "../../src/types/identidades.js";
import express, { json } from "express";
import { createAuthRouter } from "../../src/routes/auth/index.js";
import { AddressInfo } from "net";
import { IncomingMessage, Server, ServerResponse } from "http";
import { MongoDbTest } from "../dbConnection/MongoDbTest.js";
import { createMultipleRandomUsers } from "../mocks/Users/index.js";
import { AuthController } from "../../src/controllers/auth/index.js";
import { ValidateToken } from "../../src/middleware/verifyJWT/index.js";
// import { CustomResponse } from "../../src/utils/Reponse/response.js";
import { UserService } from "../../src/services/users/user.service.js";

dotenv.config();

const setupMongoMemoryServer = async () => {
   const clientDb = await MongoDbTest.start();
   const userCollection = clientDb
      .db(process.env.MONGO_DB_TEST)
      .collection(DBCollections.USERS) as Collection<Users>;
   const userSessionCollection = clientDb
      .db(process.env.MONGO_DB_TEST)
      .collection(DBCollections.USER_SESSIONS) as Collection<UserSessions>;

   return { userCollection, userSessionCollection };
};

const users = createMultipleRandomUsers(5);
// const token = "token";
// jest.mock("../../src/models/auth/index.js", () => {
//    return {
//       UserModel: jest.fn().mockImplementation(() => ({
//          signUp: jest
//             .fn()
//             .mockResolvedValue(
//                CustomResponse.success("User created succesfully", users[0])
//             ),
//          signIn: jest
//             .fn()
//             .mockResolvedValue(
//                CustomResponse.success("Login succesfull", token)
//             ),
//          signOut: jest
//             .fn()
//             .mockResolvedValue(CustomResponse.success("Sign out successful")),
//          findUser: jest.fn().mockResolvedValue(users[0]),
//       })),
//    };
// });

describe("Auth", () => {
   let app: express.Application;
   let server: Server<typeof IncomingMessage, typeof ServerResponse>;
   let userCollection: Collection<Users>;
   let userSessionCollection: Collection<UserSessions>;

   beforeAll(async () => {
      app = express();
      app.use(json());
      app.disable("x-powered-by");

      const { userCollection: uc, userSessionCollection: usc } =
         await setupMongoMemoryServer();
      userCollection = uc;
      userSessionCollection = usc;

      const authController = new AuthController(
         new UserService(userCollection, userSessionCollection)
      );

      const validateToken = new ValidateToken(userSessionCollection);

      app.use(
         "/auth",
         createAuthRouter({
            authController,
            validateToken,
         })
      );
      server = app.listen(0, () => {
         const port = (server.address() as AddressInfo).port;
         console.log(`Server listening on port ${port}`);
      });
   });

   afterAll(async () => {
      await MongoDbTest.clear();
      await MongoDbTest.stop();
      server.close();
   });

   describe("Sign up", () => {
      it("should sign up new users successfully", async () => {
         const expected = 200;
         for (const user of users) {
            const response = await request(app).post("/auth/signUp").send(user);
            // const userResponse = response.body as {
            //    status: number;
            //    message: string;
            //    data: Users;
            // };

            const userResponse = response.body.data as Users;
            const insertedUser = await userCollection.findOne({
               _id: userResponse._id,
            });

            console.log(userResponse);
            expect(response.status).toBe(expected);
            expect(insertedUser).toEqual(userResponse);
         }
      });

      it("should warn that user already exist", async () => {
         const expected = 400;
         for (const user of users) {
            const response = await request(app).post("/auth/signUp").send(user);

            expect(response.status).toBe(expected);
            expect(response.body).toEqual({
               status: 400,
               message: "User already exists",
            });
         }
      });
   });

   describe("Sign in", () => {
      it("should sign in an existing user successfully", async () => {
         const expected = 200;

         const response = await request(app).post("/auth/signIn").send({
            email: users[0].email,
            password: users[0].password,
         });

         expect(response.status).toBe(expected);
      });

      it("should warn that user doesnt exist", async () => {
         const expected = 404;

         const response = await request(app).post("/auth/signIn").send({
            email: "javierpapaito@gmail.com",
            password: 111111,
         });
         expect(response.status).toBe(expected);
      });

      it("should throw an error because credentials are invalid", async () => {
         const expected = 401;

         const response = await request(app).post("/auth/signIn").send({
            email: users[0].email,
            password: 111111,
         });
         expect(response.status).toBe(expected);
      });
   });
});
