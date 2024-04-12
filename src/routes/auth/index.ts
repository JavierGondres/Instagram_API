import { Router } from "express";
import { Database } from "../../types/database.js";
import { validateData } from "../../middleware/validateData/index.js";
import { signInSchema, signUpSchema } from "../../models/auth/schema.js";

export const createAuthRouter = ({
   authController,
   validateToken,
}: Pick<Database, "authController" | "validateToken">) => {
   const authRouter = Router();

   authRouter.post(
      "/signIn",
      [validateData(signInSchema)],
      authController.signIn
   );
   authRouter.post(
      "/signUp",
      validateData(signUpSchema),
      authController.signUp
   );
   authRouter.post(
      "/signOut",
      validateToken.validateToken,
      authController.signOut
   );

   return authRouter;
};
