import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email"),
  username: requiredString.regex(/^[a-zA-Z0-9]+$/, "Only letters & numbers"),
  password: requiredString.min(8, "Must be atleast 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z
  .object({
    content: z.string().trim(),
    mediaIds: z
      .array(z.string())
      .max(5, "Cannot have more than 5 attachments")
      .optional(),
  })
  .refine(
    (data) =>
      data.content.length > 0 || (data.mediaIds && data.mediaIds.length > 0),
    {
      message: "Post must have either text or media",
    },
  );

export type CreatePostValues = z.infer<typeof createPostSchema>;

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be 1000 characters or less"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
