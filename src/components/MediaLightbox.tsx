"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MediaType } from "@prisma/client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MediaLightboxProps {
  media: {
    id: string;
    url: string;
    type: MediaType;
  }[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MediaLightbox({
  media,
  initialIndex = 0,
  open,
  onOpenChange,
}: MediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentMedia = media[currentIndex];

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen max-h-screen max-w-screen-lg border-none bg-transparent p-0 shadow-none">
        <div className="relative flex h-full w-full items-center justify-center">
          {media.length > 1 && (
            <>
              <button
                onClick={showPrevious}
                className="absolute left-4 z-50 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={showNext}
                className="absolute right-4 z-50 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 z-50 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
          >
            <X className="size-6" />
          </button>
          <div className="flex h-full w-full items-center justify-center p-4">
            {currentMedia.type === MediaType.IMAGE ? (
              <div className="relative h-full max-h-[80vh] w-full">
                <Image
                  src={currentMedia.url}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              </div>
            ) : (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="mx-auto h-full max-h-[80vh] w-full"
              />
            )}
          </div>
        </div>
        {media.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {media.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "h-2 w-2 rounded-full bg-background/80 backdrop-blur-sm transition-all",
                  i === currentIndex && "w-4 bg-background",
                )}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
