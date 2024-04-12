var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
import request from "supertest";
import { AuthModel } from "../src/models/auth/index.js";
import { DBCollections } from "../src/types/enum.js";
import express, { json } from "express";
import { createAuthRouter } from "../src/routes/auth/index.js";
import { MongoDbTest } from "./dbConnection/MongoDbTest.js";
import { createMultipleRandomUsers } from "./mocks/Users/index.js";
dotenv.config();
const setupMongoMemoryServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const clientDb = yield MongoDbTest.start();
    const userCollection = clientDb
        .db(process.env.MONGO_DB_TEST)
        .collection(DBCollections.USERS);
    const userSessionCollection = clientDb
        .db(process.env.MONGO_DB_TEST)
        .collection(DBCollections.USER_SESSIONS);
    return { userCollection, userSessionCollection };
});
describe("Auth", () => {
    let app;
    let server;
    let userCollection;
    let userSessionCollection;
    const users = createMultipleRandomUsers(5);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = express();
        app.use(json());
        app.disable("x-powered-by");
        const { userCollection: uc, userSessionCollection: usc } = yield setupMongoMemoryServer();
        userCollection = uc;
        userSessionCollection = usc;
        app.use("/auth", createAuthRouter({
            authModel: new AuthModel(userCollection, userSessionCollection),
            userSessionCollection: userSessionCollection,
        }));
        server = app.listen(0, () => {
            const port = server.address().port;
            console.log(`Server listening on port ${port}`);
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield MongoDbTest.clear();
        yield MongoDbTest.stop();
        server.close();
    }));
    describe("Sign up", () => {
        it("should sign up new users successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const expected = 200;
            for (const user of users) {
                const response = yield request(app).post("/auth/signUp").send(user);
                const userResponse = response.body.data;
                const insertedUser = yield userCollection.findOne({
                    _id: userResponse._id,
                });
                console.log(userResponse);
                expect(response.status).toBe(expected);
                expect(insertedUser).toEqual(userResponse);
            }
        }));
        it("should warn that user already exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const expected = 400;
            for (const user of users) {
                const response = yield request(app).post("/auth/signUp").send(user);
                expect(response.status).toBe(expected);
                expect(response.body).toEqual({
                    status: 400,
                    message: "User already exists",
                });
            }
        }));
    });
    describe("Sign in", () => {
        it("should sign in an existing user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const expected = 200;
            const response = yield request(app).post("/auth/signIn").send({
                email: users[0].email,
                password: users[0].password,
            });
            expect(response.status).toBe(expected);
        }));
    });
});
