import { Request, Response } from "express";
import { EmailService } from "./EmailService";


export class EmailController {
  constructor(
    public readonly emailService: EmailService
  ) { }

  uploadFiles = (req: Request, res: Response) => {

  }
}