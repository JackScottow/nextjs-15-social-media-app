import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";

interface PostProps {
  post: PostData;
}

const Post = ({ post }: PostProps) => {
  return (
    <article className="space-y-3 rounded-md bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-4">
        <Link href={`/users/${post.user.username}`}>
          <UserAvatar avatarUrl={post.user.avatarUrl} className="hover:" />
        </Link>
        <div>
          <Link
            href={`/users/${post.user.username}`}
            className="hover:underline"
          >
            {post.user.displayName}
          </Link>
          <Link
            href={`/posts/${post.id}`}
            className="block text-sm text-muted-foreground hover:underline"
          >
            {formatRelativeDate(post.createdAt)}
          </Link>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
};

export default Post;
