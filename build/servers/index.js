import dotenv from "dotenv";
import { createApp } from "../index.js";
import { MongoSingleton } from "../singleton/MongoSingleton.js";
import { DBCollections } from "../types/enum.js";
import { AuthModel } from "../models/auth/index.js";
dotenv.config();
const userCollection = MongoSingleton.getClient()
    .db(process.env.MONGO_DB)
    .collection(DBCollections.USERS);
const userSessionCollection = MongoSingleton.getClient()
    .db(process.env.MONGO_DB)
    .collection(DBCollections.USER_SESSIONS);
createApp({
    authModel: new AuthModel(userCollection, userSessionCollection),
    userSessionCollection: userSessionCollection,
});
