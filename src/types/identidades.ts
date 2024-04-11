export interface Users {
   _id: string;
   userName: string;
   fullName: string;
   password: string;
   email: string;
   role: string;
   profilePicture: string | null;
}

export interface UserSessions {
   _id: string;
   userId: string;
   token: string;
   createdAt: Date;
   client: string;
   isValid: boolean;
}
