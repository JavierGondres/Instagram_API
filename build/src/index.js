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
export const createApp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userSessionCollection, authController, }) {
    const app = express();
    app.use(json());
    app.disable("x-powered-by");
    app.use("/auth", createAuthRouter({
        authController,
        userSessionCollection,
    }));
    const server = app.listen(0, () => {
        const port = server.address().port;
        console.log(`Server listening on port ${port}`);
    });
    return server;
});
