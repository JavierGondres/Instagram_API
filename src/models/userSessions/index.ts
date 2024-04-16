import { v4 as uuidv4 } from "uuid";
import { UserSessions } from "../../types/identidades.js";
import { generateJWT } from "../../middleware/generateJWT/index.js";

export class UserSessionModel {
   async generateToken({
      role,
      sessionId,
      userId,
   }: {
      role: string;
      userId: string;
      sessionId: string;
   }) {
      try {
         const { userAccessToken } = await generateJWT({
            role,
            userId,
            sessionId,
         });

         return userAccessToken;
      } catch (error) {
         console.error("Error en generateToke: ", error);
         return null;
      }
   }

   async create(
      payload: Pick<UserSessions, "client" | "userId"> & { role: string }
   ) {
      const { client, userId, role } = payload;
      const sessionId = uuidv4();
      const token = await this.generateToken({ role, sessionId, userId });
      if (!token) return null;

      try {
         const userSession: UserSessions = {
            _id: sessionId,
            userId: userId,
            token,
            createdAt: new Date(),
            client: client,
            isValid: true,
         };

         return userSession;
      } catch (error) {
         console.error("Error creating user:", error);
         return null;
      }
   }
}
