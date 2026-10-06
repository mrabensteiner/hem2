import {prisma} from "../../lib/prisma";

async function uploadUserImage(file: Express.Multer.File, userId: string) {
  return await prisma.image.upsert({
    where: {
      userId: userId,
    },
    update: {
      filename: file.filename,
      path: `uploads/users/${file.filename}`,
    },
    create: {
      userId: userId,
      filename: file.filename,
      path: `uploads/users/${file.filename}`,
    }
  });
}

async function uploadProjectImage(file: Express.Multer.File, projectId: string) {
  return await prisma.image.upsert({
    where: {
      projectId: projectId,
    },
    update: {
      filename: file.filename,
      path: `uploads/projects/${projectId}/${file.filename}`,
    },
    create: {
      projectId: projectId,
      filename: file.filename,
      path: `uploads/projects/${projectId}/${file.filename}`,
    }
  });
}

async function uploadFindingImages(files: Express.Multer.File[], projectId: string, findingId: string) {
  await prisma.image.createMany({
    data: files.map(file => ({
      filename: file.filename,
      path: `uploads/projects/${projectId}/${file.filename}`,
      findingId: findingId
    })),
  });

  return await prisma.image.findMany({
    where: { findingId: findingId }
  });
}

export const imageService = {
  uploadUserImage,
  uploadProjectImage,
  uploadFindingImages,
};
