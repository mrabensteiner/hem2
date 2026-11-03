import type {Request, Response} from "express";
import {importService} from "../services/import.service";

async function projectJson(req: Request, res: Response) {
  try {
    const file = (req.files as Express.Multer.File[])[0] as Express.Multer.File;

    const filenameSplitted = file.originalname.toLowerCase().split(".");
    const mimetype = file.mimetype.toLowerCase();

    let extension = filenameSplitted[filenameSplitted.length - 1];

    if (mimetype != "application/json" || extension != "json") {
      throw new Error("Invalid file format.");
    }

    const fileJson = JSON.parse(file.buffer.toString());
    const id = await importService.importProject(fileJson, req.user);

    res.json({
      id: id,
      success: `Imported project "${fileJson.title}" successfully.`,
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const importController = {
  projectJson
};
