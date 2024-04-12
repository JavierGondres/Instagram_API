import { Collection } from "mongodb";
import dotenv from "dotenv";
import { createApp } from "../index.js";
import { MongoSingleton } from "../singleton/MongoSingleton.js";
import { DBCollections } from "../types/enum.js";
import { AuthModel } from "../models/auth/index.js";
import { UserSessions, Users } from "../types/identidades.js";
import { AuthController } from "../controllers/auth/index.js";
import { ValidateToken } from "../middleware/verifyJWT/index.js";
dotenv.config();

//AUTH AND USER//
const userCollection = MongoSingleton.getClient()
   .db(process.env.MONGO_DB)
   .collection(DBCollections.USERS) as Collection<Users>;

const userSessionCollection = MongoSingleton.getClient()
   .db(process.env.MONGO_DB)
   .collection(DBCollections.USER_SESSIONS) as Collection<UserSessions>;

const authController = new AuthController(
   new AuthModel(userCollection, userSessionCollection)
);

const validateToken = new ValidateToken(userSessionCollection);

createApp({ authController, validateToken });
