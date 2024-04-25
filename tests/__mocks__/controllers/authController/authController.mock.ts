import { Request, Response } from "express";
import {
   SignInPayload,
   SignUpPayload,
} from "../../../../src/controllers/auth/types";
import { CustomResponse } from "../../../../src/utils/Reponse/response";
import { Roles } from "../../../../src/types/enum";
import { userServiceMockProps } from "../../services/UserService/types";

export const authControllerMock = (userService: userServiceMockProps) => ({
   signUp: jest.fn(async (req: Request, res: Response) => {
      const {
         email,
         fullName,
         password,
         userName,
         profilePicture,
         role,
      }: SignUpPayload = req.body;

      try {
         const result = await userService.signUp({
            userName,
            email,
            fullName,
            password: password.toString(),
            profilePicture,
            role: role || Roles.USER,
         });

         return CustomResponse.response(result.status, result, res);
      } catch (error) {
         console.error("Error during signUp:", error);
         return CustomResponse.handleErrorResponse(error, res);
      }
   }),

   signIn: jest.fn(async (req: Request, res: Response) => {
      const { email, password }: SignInPayload = req.body;
      const client = req.headers["user-agent"];

      try {
         const result = await userService.signIn({
            email,
            password: password.toString(),
            client: client ?? "No client",
         });
         return CustomResponse.response(result.status, result, res);
      } catch (error) {
         console.error("Error during sign-in:", error);
         return CustomResponse.handleErrorResponse(error, res);
      }
   }),

   signOut: jest.fn(async (req: Request, res: Response) => {
      try {
         const sessionId = (req as any).decodedSessionId;
         if (!sessionId) {
            return res.status(401).json("Missing credentials");
         }

         const result = await userService.signOut(sessionId);
         return CustomResponse.response(result.status, result, res);
      } catch (error) {
         console.error("Error during signOut:", error);
         return CustomResponse.handleErrorResponse(error, res);
      }
   }),
});
