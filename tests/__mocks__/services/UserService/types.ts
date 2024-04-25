import {
   SignInPayload,
   SignUpPayload,
} from "../../../../src/services/users/types";
import { CustomResponse } from "../../../../src/utils/Reponse/response";

export interface userServiceMockProps {
   signUp: jest.Mock<Promise<CustomResponse>, [payload: SignUpPayload], any>;
   signIn: jest.Mock<Promise<CustomResponse>, [payload: SignInPayload], any>;
   signOut: jest.Mock<Promise<CustomResponse>, [sessionId: string]>;
}
