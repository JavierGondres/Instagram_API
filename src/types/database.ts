// import { Collection } from "mongodb";
// import { UserSessions } from "./identidades.js";
import { AuthController } from "../controllers/auth/index.js";
import { ValidateToken } from "../middleware/verifyJWT/index.js";

export interface Database {
   authController: AuthController;
   // userSessionCollection: Collection<UserSessions>;
   validateToken: ValidateToken
}
