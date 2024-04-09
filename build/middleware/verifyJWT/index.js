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
export class ValidateToken {
    constructor(userSessionsCollection) {
        this.validateToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const authorizationHeader = req.headers["authorization"];
            if (!authorizationHeader) {
                console.warn("Access token is missing");
                return res.status(401).json({ error: "Access token is missing" });
            }
            const token = authorizationHeader.split(" ")[1];
            try {
                const decoded = yield this.verifyToken(token);
                console.log({ token });
                console.log({ decoded });
                const userSession = yield this.userSessionsCollection.findOne({
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
            }
            catch (error) {
                console.error("Error during token validation:", error);
                return res
                    .status(500)
                    .json({ error: "Something went wrong in authorization" });
            }
        });
        this.verifyToken = (token) => {
            return new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });
        };
        this.userSessionsCollection = userSessionsCollection;
    }
}
