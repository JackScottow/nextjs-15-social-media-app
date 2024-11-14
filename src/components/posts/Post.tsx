"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media, MediaType } from "@prisma/client"; // Import MediaType too
import Image from "next/image";
import Link from "next/link";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import PostMoreButton from "./PostMoreButton";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded bg-card p-3 shadow-sm">
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
    </article>
  );
}

// Create a type for the media attachment that matches what we get from the API
type MediaAttachment = Pick<Media, "id" | "type" | "url" | "createdAt">;

interface MediaPreviewsProps {
  attachments: MediaAttachment[];
}

interface MediaPreviewProps {
  media: MediaAttachment;
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === MediaType.IMAGE) {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto aspect-square rounded object-cover hover:cursor-zoom-in"
      />
    );
  }

  if (media.type === MediaType.VIDEO) {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}
