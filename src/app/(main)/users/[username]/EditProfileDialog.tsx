import { useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useToast } from "@/hooks/use-toast";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingButton from "@/components/LoadingButton";
import CropImageDialog from "@/components/CropImageDialog";

// Assets and Icons
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { Camera } from "lucide-react";

// Types and Validation
import { UserData } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

// Mutations and Hooks
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "./mutations";

// Utilities
import Resizer from "react-image-file-resizer";

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileDialog = ({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) => {
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  const mutation = useUpdateProfileMutation();
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const onSubmit = async (values: UpdateUserProfileValues) => {
    try {
      const newAvatarFile = croppedAvatar
        ? new File([croppedAvatar], `avatar_${user.id}.webp`, {
            type: "image/webp",
          })
        : undefined;

      await mutation.mutateAsync({
        values,
        avatar: newAvatarFile,
      });

      setCroppedAvatar(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || avatarPlaceholder
            }
            onImageCropped={setCroppedAvatar}
            isLoading={mutation.isPending}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your display name"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      className="resize-none"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton
                type="submit"
                loading={mutation.isPending}
                disabled={mutation.isPending}
              >
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
  isLoading?: boolean;
}

const AvatarInput = ({ src, onImageCropped, isLoading }: AvatarInputProps) => {
  const [imageToCrop, setImageToCrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const onImageSelected = (image: File | undefined) => {
    if (!image) return;

    // Validate file type
    if (!image.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        description: "Please select an image file.",
      });
      return;
    }

    Resizer.imageFileResizer(
      image,
      512, // width
      512, // height
      "WEBP",
      90, // quality
      0, // rotation
      (uri) => {
        if (uri instanceof File && uri.size > 512 * 1024) {
          toast({
            variant: "destructive",
            description: "Image too large. Please choose a smaller image.",
          });
          return;
        }
        setImageToCrop(uri as File);
      },
      "file",
    );
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
        disabled={isLoading}
      >
        <Image
          src={src}
          alt="Avatar preview"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          {isLoading ? (
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Camera size={24} />
          )}
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
};

export default EditProfileDialog;
