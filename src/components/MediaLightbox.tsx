"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MediaType } from "@prisma/client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const currentMedia = media[currentIndex];

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[100dvh] max-h-[100dvh] w-full max-w-none border-none bg-black/80 p-0 backdrop-blur-sm md:p-6">
        <div className="relative flex h-full w-full items-center justify-center">
          {media.length > 1 && (
            <>
              <button
                onClick={showPrevious}
                className="absolute left-2 z-50 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background md:left-8"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={showNext}
                className="absolute right-2 z-50 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background md:right-8"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          <div className="h-full w-full p-2 md:p-0">
            {currentMedia.type === MediaType.IMAGE ? (
              <div className="relative flex h-full items-center justify-center">
                <Image
                  src={currentMedia.url}
                  alt=""
                  width={1920}
                  height={1080}
                  className="max-h-[85vh] w-auto rounded object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <video
                  src={currentMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[85vh] w-auto rounded"
                />
              </div>
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
