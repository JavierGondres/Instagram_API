import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateJWT = async ({
   role,
   userId,
   sessionId,
}: {
   role: string;
   userId: string;
   sessionId: string;
}): Promise<{ userAccessToken: string | undefined }> => {
   try {
      if (!process.env.JWT_SECRET) {
         throw new Error("JWT_SECRET environment variable is not set");
      }

      console.info("Generating JWT for user:", userId);
      const payload = { role, userId, sessionId };
      const userAccessToken = jwt.sign(payload, process.env.JWT_SECRET);

      return { userAccessToken };
   } catch (error) {
      console.error("Error generating JWT:", error);
      return { userAccessToken: undefined };
   }
};
