import { Collection } from "mongodb";
import dotenv from "dotenv";
import { createApp } from "../index.js";
import { MongoSingleton } from "../singleton/MongoSingleton.js";
import { DBCollections } from "../types/enum.js";
import { AuthModel } from "../models/auth/index.js";
import { UserSessions, Users } from "../types/identidades.js";
dotenv.config();

const userCollection = MongoSingleton.getClient()
   .db(process.env.MONGO_DB)
   .collection(DBCollections.USERS) as Collection<Users>;

const userSessionCollection = MongoSingleton.getClient()
   .db(process.env.MONGO_DB)
   .collection(DBCollections.USER_SESSIONS) as Collection<UserSessions>;

createApp({
   authModel: new AuthModel(userCollection, userSessionCollection),
   userSessionCollection: userSessionCollection,
});
