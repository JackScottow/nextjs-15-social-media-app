"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { createPostschema } from "@/lib/validation";

export const submitPost = async (input: string) => {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorised");

  const { content } = createPostschema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: postDataInclude,
  });
  return newPost;
};
