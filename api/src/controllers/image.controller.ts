import type {Request, Response} from "express";
import {imageService} from "../services/image.service";
import path from "path";
import fs from "fs";
import { customAlphabet, urlAlphabet } from "nanoid";

const nanoid = customAlphabet(urlAlphabet, 12);

async function uploadFindingImages(req: Request, res: Response) {
  try {
    const projectId = req.params.pid as string;
    const findingId = req.params.id as string;

    const files = req.files as Express.Multer.File[];

    const projectDir = path.join(
      process.cwd(),
      "uploads",
      "projects",
      projectId
    );

    await fs.promises.mkdir(projectDir, { recursive: true });

    for (const file of files) {
      const filenameSplitted = file.originalname.toLowerCase().split(".");
      const mimetypeSplitted = file.mimetype.toLowerCase().split("/");

      let extension = filenameSplitted[filenameSplitted.length - 1];
      extension = "jpg" ? "jpeg" : extension ?? "";

      if (mimetypeSplitted[0] != "image" || !["jpeg", "png", "gif"].includes(extension) || mimetypeSplitted[1] != extension) {
        throw new Error("Invalid file format.");
      }

      const newFilename = `finding-${nanoid()}.${extension}`;

      file.filename = newFilename;

      fs.writeFile(
        path.join(projectDir, newFilename),
        file.buffer, () => {}
      );
    }

    const images = await imageService.uploadFindingImages(files, projectId, findingId);
    res.json(images);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const imageController = {
  uploadFindingImages
};
