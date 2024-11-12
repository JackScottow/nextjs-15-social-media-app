import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { PostsPage } from "@/lib/types";

export const useUpdateProfileMutation = () => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      try {
        // Handle profile update and avatar upload in parallel
        const results = await Promise.all([
          updateUserProfile(values),
          avatar ? startAvatarUpload([avatar]) : Promise.resolve(undefined),
        ]);

        const [updatedUser, uploadResult] = results;
        const avatarUrl = uploadResult?.[0]?.url;

        return {
          user: updatedUser,
          avatarUrl,
        };
      } catch (error) {
        console.error("Error during update:", error);
        throw error;
      }
    },

    onSuccess: async ({ user: updatedUser, avatarUrl }) => {
      // Update feed posts
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      // Update all instances of the user in the feed
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      // Use new avatar URL if available, else keep existing
                      avatarUrl: avatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      // Invalidate user queries
      await queryClient.invalidateQueries({
        queryKey: ["user", updatedUser.username],
      });

      router.refresh();
      toast({ description: "Profile updated" });
    },

    onError(error) {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        description: "Failed to update profile",
      });
    },
  });

  return mutation;
};
