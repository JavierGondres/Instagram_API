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

   static error(status: number, message: string): CustomResponse {
      return new CustomResponse(status, message);
   }

   static async response(
      status: number,
      message: string,
      res: Response
   ): Promise<Response> {
      return res.status(status).json({
         status,
         message,
      });
   }
}
