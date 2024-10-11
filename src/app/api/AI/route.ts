import { env } from "@/env";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json();
  const url = "https://chatgpt-vision1.p.rapidapi.com/matagvision2";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-rapidapi-key": env.RAPID_API_KEY,
        "x-rapidapi-host": "chatgpt-vision1.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "write a short description for the image in 1-2 lines.",
              },
              {
                type: "image",
                url: imageUrl,
              },
            ],
          },
        ],
        web_access: false,
      }),
    });
    const data = await response.json();
    return new Response(JSON.stringify(data.result), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
}
