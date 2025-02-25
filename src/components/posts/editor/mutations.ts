import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";
import { PostsPage } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";

interface SubmitPostData {
  content: string;
  mediaIds: string[];
}

export const useSubmitPostMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: async (data: SubmitPostData) => {
      return submitPost(data);
    },

    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({ description: "Successfully posted!", duration: 1500 });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again",
      });
    },
  });

  return mutation;
};
