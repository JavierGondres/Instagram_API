import { Response } from "express";

export class CustomResponse {
   status: number;
   message: string;
   data?: any;

   constructor(status: number, message: string, data?: any) {
      this.status = status;
      this.message = message;
      this.data = data;
   }

   static success(message: string, data?: any): CustomResponse {
      return new CustomResponse(200, message, data);
   }

   static error(status: number, message: string): never {
      throw new CustomResponse(status, message);
   }

   static async response(
      status: number,
      result: any,
      res: Response
   ): Promise<Response> {
      return res.status(status).json(result);
   }

   static handleErrorResponse(error: any, res: Response) {
      const errorMessage = error.message || "Internal server error";
      const errorStatus = error.status || 500;
      const result = { error: errorMessage };
      return this.response(errorStatus, result, res);
   }
}
