"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media, MediaType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import PostMoreButton from "./PostMoreButton";
import { useState } from "react";
import MediaLightbox from "../MediaLightbox";
import { Play } from "lucide-react";
import LikeButton from "@/components/posts/LikeButton";
import BookmarkButton from "./BookmarkButton";
import { MessageSquare } from "lucide-react";
import Comments from "../comments/Comments";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded bg-card p-3 shadow">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning={true}
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        <PostMoreButton owner={post.user.id === user.id} post={post} />
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="grid grid-cols-3 place-items-center gap-5 px-6 lg:px-10">
        <LikeButton
          postId={post.id}
          initialState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some((like) => like.userId === user.id),
          }}
        />
        <CommentButton
          post={post}
          onClick={() => setShowComments(!showComments)}
        />
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
}

type MediaAttachment = Pick<Media, "id" | "type" | "url" | "createdAt">;

interface MediaPreviewsProps {
  attachments: MediaAttachment[];
}

interface MediaPreviewProps {
  media: MediaAttachment;
  onClick?: () => void;
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  return (
    <>
      <div
        className={cn(
          "m-3 grid gap-2 py-3",
          attachments.length > 1 ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {attachments.map((m, index) => (
          <MediaPreview
            key={m.id}
            media={m}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      <MediaLightbox
        media={attachments}
        initialIndex={selectedIndex ?? 0}
        open={selectedIndex !== undefined}
        onOpenChange={(open) => {
          if (!open) setSelectedIndex(undefined);
        }}
      />
    </>
  );
}

function MediaPreview({ media, onClick }: MediaPreviewProps) {
  if (media.type === MediaType.IMAGE) {
    return (
      <div
        onClick={onClick}
        className="mx-auto w-full max-w-2xl overflow-hidden"
      >
        <div className="relative aspect-square">
          <Image
            src={media.url}
            alt="Attachment"
            className="cursor-zoom-in rounded object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          />
        </div>
      </div>
    );
  }

  if (media.type === MediaType.VIDEO) {
    return (
      <div
        onClick={onClick}
        className="mx-auto w-full max-w-2xl overflow-hidden"
      >
        <div className="relative aspect-square">
          <video
            src={media.url}
            className="absolute inset-0 h-full w-full rounded object-cover"
          />
          <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/10 transition-colors hover:bg-black/20">
            <div className="rounded-full bg-black/50 p-3">
              <Play className="h-8 w-8 text-white" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}
function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
      </span>
    </button>
  );
}
