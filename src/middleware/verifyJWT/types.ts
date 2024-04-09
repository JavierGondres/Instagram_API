interface CustomRequest extends Request {
   decodedUserRole?: string;
   decodedUserId?: string;
   decodedSessionId?: string;
}

declare global {
   namespace Express {
      interface Request extends CustomRequest {}
   }
}

export interface DecodedToken {
   role: string;
   userId: string;
   sessionId: string;
}
