import { Service } from "typedi";
import { DB } from "@database";

import { File } from "@interfaces/file.interface";

@Service()
export class FileService {
  public async uploadSingleFile(user_id: number, file: Express.Multer.File): Promise<File> {
    const fileUpload = await DB.Files.create({
      user_id,
      name: file.filename,
      type: file.mimetype,
      size: file.size
    });

    return fileUpload;
  };

  public async getFilesByUserId(user_id: number): Promise<File[]> {
    const files = await DB.Files.findAll({
      where: {
        user_id
      }
    });

    return files;
  };

  public async getFileByUuid(uuid: string): Promise<File> {
    const file = await DB.Files.findOne({
      where: {
        uuid: uuid
      }
    });

    return file;
  }
};