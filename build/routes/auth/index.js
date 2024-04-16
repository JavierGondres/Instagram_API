import { Router } from "express";
import { validateData } from "../../middleware/validateData/index.js";
import { signInSchema, signUpSchema } from "../../models/users/schema.js";
export const createAuthRouter = ({ authController, validateToken, }) => {
    const authRouter = Router();
    authRouter.post("/signIn", [validateData(signInSchema)], authController.signIn);
    authRouter.post("/signUp", validateData(signUpSchema), authController.signUp);
    authRouter.post("/signOut", validateToken.validateToken, authController.signOut);
    return authRouter;
};
