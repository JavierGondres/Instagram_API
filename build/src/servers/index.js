import dotenv from "dotenv";
import { createApp } from "../index.js";
import { MongoSingleton } from "../singleton/MongoSingleton.js";
import { DBCollections } from "../types/enum.js";
import { AuthModel } from "../models/auth/index.js";
import { AuthController } from "../controllers/auth/index.js";
dotenv.config();
//AUTH AND USER//
const userCollection = MongoSingleton.getClient()
    .db(process.env.MONGO_DB)
    .collection(DBCollections.USERS);
const userSessionCollection = MongoSingleton.getClient()
    .db(process.env.MONGO_DB)
    .collection(DBCollections.USER_SESSIONS);
const authController = new AuthController(new AuthModel(userCollection, userSessionCollection));
createApp({ authController, userSessionCollection });
