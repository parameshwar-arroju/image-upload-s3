import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { imageId, description } = await req.json();
  try {
    const image = await db.images.update({
      where: {
        id: imageId,
      },
      data: {
        description: description,
      },
    });

    if (!image) {
      throw new Error("Failed to update image");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
