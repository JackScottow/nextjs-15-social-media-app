"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostschema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export const submitPost = async (input: string) => {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorised");

  const { content } = createPostschema.parse({ content: input });

  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });
};
