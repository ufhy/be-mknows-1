import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { FileService } from "@services/files.service";
import { RequestWithUser } from "@interfaces/authentication/token.interface";

import { apiResponse } from "@utils/apiResponse";
import { HttpException } from '@/exceptions/HttpException';
import path from 'path';
import fs from 'fs';

export class FileController {
  private file = Container.get(FileService);

  public uploadFile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const image = req.file as Express.Multer.File;
    const user_id = req.user.pk as number;

    if(!image) throw new HttpException(false, 400, "File is required");

    const response = await this.file.uploadSingleFile(user_id, image);
    res.status(201).json(apiResponse(201, "OK", "Upload Success", response));
  });

  public getFileByUuid = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const uuid = String(req.params.uuid);
    const file = await this.file.getFileByUuid(uuid);
    if (!file) {
      throw new HttpException(false, 404, "File not found");
    }
    
    const filePath = path.join(process.cwd(), `./uploads/${file.name}`)
    if (!fs.existsSync(filePath)) {
      throw new HttpException(false, 404, "File not found");
    }

    res.sendFile(filePath);
  });

  public loginUserFiles = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const response = await this.file.getFilesByUserId(user_id);

    res.status(200).json(apiResponse(200, "OK", "Get Profile Success", response));
  });
}