import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload } = useUploadThing("attachment", {
    onUploadProgress: (progress) => {
      setUploadProgress(Math.round(progress));
    },
  });

  const startMediaUpload = async (files: File[]) => {
    // Check file limits
    if (attachments.length + files.length > 5) {
      throw new Error("Maximum 5 attachments allowed");
    }

    // Add files to attachments with uploading state
    const newAttachments = files.map((file) => ({
      file,
      isUploading: true,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    setIsUploading(true);

    try {
      const uploadResults = await startUpload(files);

      if (uploadResults) {
        // Update attachments with mediaIds
        setAttachments((prev) => {
          const updatedAttachments = [...prev];
          let uploadIndex = 0;

          return updatedAttachments.map((attachment) => {
            if (attachment.isUploading && uploadResults[uploadIndex]) {
              const result = uploadResults[uploadIndex];
              uploadIndex++;
              return {
                ...attachment,
                mediaId: result.serverData.id,
                isUploading: false,
              };
            }
            return attachment;
          });
        });
      }
    } catch (error) {
      // Remove failed uploads from attachments
      setAttachments((prev) => prev.filter((a) => !files.includes(a.file)));
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(undefined);
    }
  };

  const removeAttachment = (fileName: string) => {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  };

  const reset = () => {
    setAttachments([]);
    setIsUploading(false);
    setUploadProgress(undefined);
  };

  return {
    attachments,
    isUploading,
    uploadProgress,
    startUpload: startMediaUpload,
    removeAttachment,
    reset,
  };
}
