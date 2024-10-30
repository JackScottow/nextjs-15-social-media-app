import { PostData } from "@/lib/types";
import { useState } from "react";
import DeletePostDialog from "../DeletePostDialog";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";

interface PostMoreButtonProps {
  post: PostData;
  className?: string;
  owner: boolean;
}

const PostMoreButton = ({ post, className, owner }: PostMoreButtonProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleShare = async () => {
    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post!",
          text: "I found this great post for you to read.",
          url: window.location.href, // or any specific URL you want to share
        });
        console.log("Content shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.warn("Web Share API is not supported in this browser.");
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleShare}>Share</DropdownMenuItem>
          {owner && (
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
              <span className="flex items-center gap-3 text-destructive">
                <Trash2 className="size-4" />
                Delete
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
};

export default PostMoreButton;
