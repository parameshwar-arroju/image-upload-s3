import { db } from "@/server/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { imageId } = await req.json();
  const HandleDeleteImage = async (imageId: string) => {
    console.log(imageId);
    try {
      await db.images.delete({
        where: {
          id: imageId,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete image");
    }
  };
  return new Response(JSON.stringify(await HandleDeleteImage(imageId)), {
    status: 200,
  });
}
