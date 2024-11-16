"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MediaType } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
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
      <DialogHeader>
        <DialogTitle>
          <DialogContent className="h-[100dvh] max-h-[100dvh] w-full max-w-none border-none bg-black/80 p-0 backdrop-blur-sm md:p-6">
            <div className="relative flex h-full w-full items-center justify-center">
              {media.length > 1 && (
                <>
                  <button
                    onClick={showPrevious}
                    className="absolute left-2 z-50 rounded-xl p-1 text-white md:left-8"
                  >
                    <ChevronLeft className="size-8" />
                  </button>
                  <button
                    onClick={showNext}
                    className="absolute right-2 z-50 rounded-xl p-1 text-white md:right-8"
                  >
                    <ChevronRight className="size-8" />
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
          </DialogContent>
        </DialogTitle>
      </DialogHeader>
    </Dialog>
  );
}
