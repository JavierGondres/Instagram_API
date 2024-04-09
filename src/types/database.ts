import { Collection } from "mongodb";
import { UserSessions } from "./identidades.js";

export interface Database {
   authModel: any;
   userSessionCollection: Collection<UserSessions>;
}
