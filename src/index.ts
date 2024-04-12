import express, { json } from "express";
import { Database } from "./types/database.js";
import { createAuthRouter } from "./routes/auth/index.js";
import { AddressInfo } from "net";

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
   const server = app.listen(0, () => {
      const port = (server.address() as AddressInfo).port;
      console.log(`Server listening on port ${port}`);
   });

   return server;
};
