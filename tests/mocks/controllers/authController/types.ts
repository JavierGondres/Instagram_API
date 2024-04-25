import { Request, Response } from 'express';

export interface authControllerMockProps {
    signUp: jest.Mock<any, [req: Request<any, any, any, any, any>, res: Response<any>]>;
    signIn: jest.Mock<any, [req: Request<any, any, any, any, any>, res: Response<any>]>;
    signOut: jest.Mock<any, [req: Request<any, any, any, any, any>, res: Response<any>]>;
}
