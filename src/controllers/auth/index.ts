import { Request, Response } from "express";
import { Roles } from "../../types/enum.js";
import { SignInPayload, SignUpPayload } from "./types.js";
import { UserService } from "../../services/users/user.service.js";
import { CustomResponse } from "../../utils/Reponse/response.js";

export class AuthController {
   private userService: UserService;

   constructor(userService: UserService) {
      this.userService = userService;
   }

   signIn = async (req: Request, res: Response) => {
      const { email, password }: SignInPayload = req.body;
      const client = req.headers["user-agent"];

      try {
         const result = await this.userService.signIn({
            email,
            password: password.toString(),
            client: client ?? "No client",
         });
         return CustomResponse.response(result.status, result, res);
      } catch (error) {
         console.error("Error during sign-in:", error);
         return CustomResponse.handleErrorResponse(error, res);
      }
   };

   signUp = async (req: Request, res: Response) => {
      const {
         email,
         fullName,
         password,
         userName,
         profilePicture,
         role,
      }: SignUpPayload = req.body;

      try {
         const result = await this.userService.signUp({
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
   };

   signOut = async (req: Request, res: Response) => {
      try {
         const sessionId = req.decodedSessionId;
         if (!sessionId) {
            return res.status(401).json("Missing credentials");
         }

         const result = await this.userService.signOut(sessionId);
         return CustomResponse.response(result.status, result, res);
      } catch (error) {
         console.error("Error during signOut:", error);
         return CustomResponse.handleErrorResponse(error, res);
      }
   };
}
