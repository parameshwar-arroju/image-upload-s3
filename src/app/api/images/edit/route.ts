import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/server/db";

const s3Client = new S3Client({
  region: env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const imageId = formData.get("imageId");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "File is required and must be a valid file." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name);

    const image = await db.images.update({
      where: {
        id: imageId as string,
      },
      data: {
        imageUrl: `https://uploadimgs3.s3.ap-south-1.amazonaws.com/${fileName}`,
      },
    });

    if (!image) {
      throw new Error("Failed to upload image");
    }

    return NextResponse.json({ success: true, fileName });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function uploadFileToS3(file: Buffer, fileName: string) {
  const fileBuffer = file;

  const ext = fileName.split(".").at(-1);
  const uid = uuidv4().replace(/-/g, "");
  const fileNameId = `${uid}${ext ? "." + ext : ""}`;

  const params = {
    Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: fileNameId,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileNameId;
}
