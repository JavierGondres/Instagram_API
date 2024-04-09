import { Router } from "express";
import { AuthController } from "../../controllers/auth/index.js";
import { validateData } from "../../middleware/validateData/index.js";
import { signInSchema, signUpSchema } from "../../models/auth/schema.js";
import { ValidateToken } from "../../middleware/verifyJWT/index.js";
export const createAuthRouter = ({ authModel, userSessionCollection, }) => {
    const authRouter = Router();
    const authController = new AuthController(authModel);
    const validateToken = new ValidateToken(userSessionCollection);
    authRouter.post("/signIn", [validateData(signInSchema)], authController.signIn);
    authRouter.post("/signUp", validateData(signUpSchema), authController.signUp);
    authRouter.post("/signOut", validateToken.validateToken, authController.signOut);
    return authRouter;
};