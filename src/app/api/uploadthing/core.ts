import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { MediaType } from "@prisma/client";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: {
      maxFileSize: "512KB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        // Extract key from the URL - new v7 format
        const key = oldAvatarUrl.split("/").pop();
        if (key) {
          await new UTApi().deleteFiles(key);
        }
      }

      // No need to transform URLs in v7
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: file.url,
        },
      });

      return { avatarUrl: file.url };
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url,
          type: file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
            ? MediaType.IMAGE
            : MediaType.VIDEO,
        },
      });

      return {
        id: media.id,
        url: media.url,
        type: media.type,
      };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
