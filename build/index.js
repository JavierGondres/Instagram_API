var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express, { json } from "express";
import { createAuthRouter } from "./routes/auth/index.js";
import dotenv from "dotenv";
dotenv.config();
export const createApp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ authController, validateToken, }) {
    var _b;
    const app = express();
    app.use(json());
    app.disable("x-powered-by");
    app.use("/auth", createAuthRouter({
        authController,
        validateToken,
    }));
    const port = (_b = process.env.PORT) !== null && _b !== void 0 ? _b : 1234;
    const server = app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    return server;
});
