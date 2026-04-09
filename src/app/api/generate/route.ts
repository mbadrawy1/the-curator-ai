import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { prompt, resolution, steps } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "يرجى إدخال وصف صالح للصورة" },
        { status: 400 }
      );
    }

    const seed = Math.floor(Math.random() * 2147483647);
    const dims = resolution?.split(" ")[0] || "1024x1024";
    const [width, height] = dims.split("x").map(Number);

    const hfToken = process.env.HUGGINGFACE_API_KEY;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (hfToken) {
      headers["Authorization"] = `Bearer ${hfToken}`;
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: width || 1024,
            height: height || 1024,
            num_inference_steps: steps || 4,
            seed,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("HF API error:", response.status, errText);

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error:
              "مفتاح API غير صالح أو مفقود. يرجى إعداد HUGGINGFACE_API_KEY.",
          },
          { status: 503 }
        );
      }
      if (response.status === 503) {
        return NextResponse.json(
          { error: "النموذج قيد التحميل، يرجى المحاولة بعد قليل." },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "حدث خطأ أثناء توليد الصورة. حاول مجدداً." },
        { status: 500 }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");

    return NextResponse.json({
      image: base64,
      seed,
      steps: steps || 4,
      resolution: resolution || "1024x1024 ( 1:1 )",
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع. حاول مجدداً." },
      { status: 500 }
    );
  }
}
