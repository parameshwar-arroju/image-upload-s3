"use client";

import DeleteImage from "@/components/DeleteImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Check, Edit, Loader2, Stars } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AccountComponent({
  imageData,
}: {
  imageData: {
    id: string;
    name: string;
    createdById: string;
    description: string | null;
    imageUrl: string;
    createdAt: Date;
  };
}) {
  const [image, setImage] = useState(imageData);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(imageData.name);
  const [description, setDescription] = useState(imageData.description || "");
  const [SaveDescBtn, setSaveDescBtn] = useState(false);
  const [SaveTitleBtn, setSaveTitleBtn] = useState(false);
  const [AIBtn, setAIBtn] = useState(true);
  const [uploadBtn, setUploadBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [description]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImage((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(selectedFile),
      }));
      setUploadBtn(true);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageId", imageData.id);

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
        setOpen(false); // Close the dialog after successful upload
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
      setUploadBtn(false);
    }
  };

  return (
    <Dialog key={imageData.id} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer">
          <CardContent className="p-2">
            <img
              src={imageData.imageUrl}
              alt={imageData.name}
              className="aspect-video object-cover"
            />
          </CardContent>
          <CardFooter className="relative mx-2 flex items-center overflow-hidden p-0 py-1">
            <p className="line-clamp-1 truncate text-sm font-medium">
              {imageData.name}
            </p>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        <div className="relative aspect-video w-full">
          <img
            src={image.imageUrl}
            alt={image.name}
            className="aspect-video h-full w-full object-cover"
          />
        </div>
        <div className="px-4 pb-2">
          <DialogHeader>
            <DialogTitle className="relative">
              <Input
                autoFocus={false}
                value={title}
                type="text"
                className="pr-3"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaveTitleBtn(true);
                }}
              />
              {SaveTitleBtn && (
                <Button
                  variant={"outline"}
                  className="absolute right-0 top-0 p-2"
                  onClick={async () => {
                    setSaveTitleBtn(false);
                    try {
                      const response = await fetch("/api/title", {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ imageId: image.id, title }),
                      });
                      if (!response.ok) {
                        throw new Error("Failed to update title");
                      }
                      toast({
                        title: "Title saved successfully",
                        description: "Your title has been updated.",
                      });
                      router.refresh();
                      setOpen(false);
                    } catch (error) {
                      toast({
                        title: "Error saving title",
                        description: "Please try again later.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </DialogTitle>
            <DialogDescription className="relative">
              <Textarea
                ref={textareaRef}
                value={description}
                className="h-fit w-full resize-none overflow-hidden border-0 bg-transparent pb-10 pr-5 pt-1 text-foreground"
                onChange={(e) => {
                  setDescription(e.target.value);
                  setSaveDescBtn(true);
                }}
                placeholder="Add a description..."
              />
              {SaveDescBtn && (
                <Button
                  variant={"outline"}
                  className="absolute bottom-0 right-0 p-2"
                  onClick={async () => {
                    setSaveDescBtn(false);
                    try {
                      const response = await fetch("/api/description", {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          imageId: image.id,
                          description,
                        }),
                      });
                      if (!response.ok) {
                        throw new Error("Failed to update title");
                      }
                      toast({
                        title: "Description saved successfully",
                        description: "Your Description has been updated.",
                      });
                      router.refresh();
                      setOpen(false);
                    } catch (error) {
                      toast({
                        title: "Error saving Description",
                        description: "Please try again later.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant={"outline"}
                className={`absolute bottom-0 right-0 p-2 ${SaveDescBtn ? "right-10" : ""} ${AIBtn ? "" : "hidden"}`}
                onClick={async () => {
                  setLoading(true);
                  setSaveDescBtn(false);
                  try {
                    const response = await fetch("/api/AI", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ imageUrl: image.imageUrl }),
                    });
                    const data = await response.json();
                    setDescription(data);
                    setSaveDescBtn(true);
                    setAIBtn(false);
                  } catch (error) {
                    toast({
                      title: "Error saving Description",
                      description: "Please try again later.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Stars
                  className={`relative h-4 w-4 ${loading ? "hidden" : ""}`}
                />
                <Loader2
                  className={`relative h-4 w-4 ${loading ? "animate-spin" : "hidden"}`}
                />
              </Button>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-start">
            <Button
              variant="outline"
              size="icon"
              className="focus-visible:ring-0"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <Edit className="h-4 w-4" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden focus:ring-0"
                  onChange={handleFileChange}
                />
              </label>
              <span className="sr-only">Edit</span>
            </Button>
            <div>
              <DeleteImage imageId={image.id} />
              <span className="sr-only">Delete</span>
            </div>
            {uploadBtn && <Button onClick={handleUpload}>Save</Button>}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
