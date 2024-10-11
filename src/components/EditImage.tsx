"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditImage({
  imageId,
  setImage,
}: {
  imageId: string;
  setImage: any;
}) {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUploady] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImage((prev: any) => ({
        ...prev,
        imageUrl: URL.createObjectURL(selectedFile),
      }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("createdById", session?.user.id as string);
    formData.append("imageId", imageId);

    try {
      const response = await fetch("/api/images/edit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Image uploaded successfully",
          description: "Your image has been updated.",
        });
        router.refresh();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setFile(null);
    }
  };

  return (
    <Button variant="ghost" className="cursor-pointer" asChild>
      <label htmlFor="file-upload" className="cursor-pointer">
        <Edit className="h-4 w-4" />
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e)}
        />
      </label>
    </Button>
  );
}
