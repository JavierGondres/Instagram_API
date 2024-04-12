import express, { json } from "express";
import { Database } from "./types/database.js";
import { createAuthRouter } from "./routes/auth/index.js";
import dotenv from "dotenv";
dotenv.config();

export const createApp = async ({
   authController,
   validateToken,
}: Database) => {
   const app = express();
   app.use(json());
   app.disable("x-powered-by");

   app.use(
      "/auth",
      createAuthRouter({
         authController,
         validateToken,
      })
   );
   const port = process.env.PORT ?? 1234;
   const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
   });

   return server;
};
