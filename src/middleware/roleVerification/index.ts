import { Request, Response, NextFunction } from "express";
import { Roles } from "../../types/enum.js";
export const roleVerification =
   (roles: Roles[]) => (req: Request, res: Response, next: NextFunction) => {
      if (!req.decodedUserRole)
         return res.status(404).json({
            error: true,
            message: "Missing auth",
         });

      const userHasValidRole = roles.some(
         (role) => req.decodedUserRole?.toLowerCase() === role.toLowerCase()
      );

      if (userHasValidRole) {
         return next();
      } else {
         return res.status(403).send({
            message: `User is not authorized`,
         });
      }
   };
