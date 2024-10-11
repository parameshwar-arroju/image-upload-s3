"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteImage({ imageId }: { imageId: string }) {
  const router = useRouter();
  const HandleDeleteImage = async (imageId: string) => {
    try {
      const res = await fetch("/api/images/delete", {
        method: "POST",
        body: JSON.stringify({ imageId }),
      });
      if (!res.ok) {
        throw new Error("Failed to delete image");
      }
      toast({
        title: "Image deleted successfully",
        description: "Your image has been deleted.",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting image",
        description: "Please try again later.",
      });
    }
  };
  return (
    <Button
      onClick={async () => await HandleDeleteImage(imageId)}
      variant={"outline"}
      className="cursor-pointer px-3"
    >
      <Trash2Icon className="h-4 w-4" />
    </Button>
  );
}
