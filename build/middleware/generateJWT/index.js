var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateJWT = (_a) => __awaiter(void 0, [_a], void 0, function* ({ role, userId, sessionId, }) {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is not set");
        }
        console.info("Generating JWT for user:", userId);
        const payload = { role, userId, sessionId };
        const userAccessToken = jwt.sign(payload, process.env.JWT_SECRET);
        return { userAccessToken };
    }
    catch (error) {
        console.error("Error generating JWT:", error);
        return { userAccessToken: undefined };
    }
});
