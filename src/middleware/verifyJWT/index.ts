import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { Collection } from "mongodb";
import { UserSessions } from "../../types/identidades.js";
import { DecodedToken } from "./types.js";

export class ValidateToken {
   private userSessionsCollection: Collection<UserSessions>;

   constructor(userSessionsCollection: Collection<UserSessions>) {
      this.userSessionsCollection = userSessionsCollection;
   }

   validateToken = async (req: Request, res: Response, next: NextFunction) => {
      const authorizationHeader = req.headers["authorization"];

      if (!authorizationHeader) {
         console.warn("Access token is missing");
         return res.status(401).json({ error: "Access token is missing" });
      }

      const token = authorizationHeader.split(" ")[1];

      try {
         const decoded = await this.verifyToken(token);
         console.log({ token });
         console.log({ decoded });
         const userSession = await this.userSessionsCollection.findOne({
            _id: decoded.sessionId,
         });

         if (!userSession) {
            console.warn("Session does not exist");
            return res.status(403).json({ error: "Session does not exist" });
         }

         req.decodedUserRole = decoded.role;
         req.decodedUserId = decoded.userId;
         req.decodedSessionId = decoded.sessionId;

         next();
      } catch (error) {
         console.error("Error during token validation:", error);
         return res
            .status(500)
            .json({ error: "Something went wrong in authorization" });
      }
   };

   private verifyToken = (token: string): Promise<DecodedToken> => {
      return new Promise((resolve, reject) => {
         jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
            if (err) {
               reject(err);
            } else {
               resolve(decoded as DecodedToken);
            }
         });
      });
   };
}
