export const userSessionModel = {
   generateToken: jest.fn().mockReturnValue("token"),
   create: jest.fn().mockResolvedValue("hashContrasenia"),
   getIsValidPassword: jest.fn().mockResolvedValue(true),
};
