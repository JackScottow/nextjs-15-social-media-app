"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

interface PostInput {
  content: string;
  mediaIds: string[];
}

export const submitPost = async ({ content, mediaIds }: PostInput) => {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorised");

  const validatedData = createPostSchema.parse({ content, mediaIds });

  const newPost = await prisma.post.create({
    data: {
      content: validatedData.content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: {
      ...getPostDataInclude(user.id),
      attachments: true,
    },
  });

  return newPost;
};
