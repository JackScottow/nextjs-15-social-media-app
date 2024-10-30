"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export const deletePost = async (postId: string) => {
  // Authenticate the user
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorised");

  // Check if the post exists and if the user is the author
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) throw new Error("Post not found");

  if (post.userId !== user.id)
    throw new Error("Unauthorised to delete this post");

  const deletedPost = await prisma.post.delete({
    where: { id: postId },
    include: postDataInclude,
  });

  return deletedPost;
};
