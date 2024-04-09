import express, { json } from "express";
import { Database } from "./types/database.js";
import { createAuthRouter } from "./routes/auth/index.js";

export const createApp = async ({ authModel, userSessionCollection }: Database) => {
   const app = express();
   app.use(json());
   app.disable("x-powered-by");

   app.use(
      "/auth",
      createAuthRouter({
         authModel: authModel,
         userSessionCollection: userSessionCollection,
      })
   );
   const port = process.env.PORT || 1234;

   app.listen(port, () => console.log("Server listening on port", port));
};
