import { Router } from "express";
import { Database } from "../../types/database.js";
import { validateData } from "../../middleware/validateData/index.js";
import { signInSchema, signUpSchema } from "../../models/users/schema.js";
import { API_VERSION } from "../../utils/ApiVersions/apiVersion.js";

export const createAuthRouter = ({
   authController,
   validateToken,
}: Pick<Database, "authController" | "validateToken">) => {
   const authRouter = Router();

   authRouter.post(
      `${API_VERSION}/signIn`,
      [validateData(signInSchema)],
      authController.signIn
   );
   authRouter.post(
      `${API_VERSION}/signUp`,
      validateData(signUpSchema),
      authController.signUp
   );
   authRouter.post(
      `${API_VERSION}/signOut`,
      validateToken.validateToken,
      authController.signOut
   );

   return authRouter;
};
