import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const MODELS = [
  "black-forest-labs/FLUX.1-schnell",
  "stabilityai/stable-diffusion-xl-base-1.0",
];

async function callHuggingFace(
  model: string,
  prompt: string,
  hfToken: string,
  width: number,
  height: number,
  steps: number
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${hfToken}`,
  };

  const body: Record<string, unknown> = { inputs: prompt };

  if (model.includes("FLUX")) {
    body.parameters = { num_inference_steps: steps };
  } else {
    body.parameters = {
      width,
      height,
      num_inference_steps: steps,
    };
  }

  return fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, resolution, steps } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "يرجى إدخال وصف صالح للصورة" },
        { status: 400 }
      );
    }

    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (!hfToken) {
      return NextResponse.json(
        { error: "مفتاح Hugging Face API غير مُعدّ في الخادم." },
        { status: 503 }
      );
    }

    const seed = Math.floor(Math.random() * 2147483647);
    const dims = resolution?.split(" ")[0] || "1024x1024";
    const [width, height] = dims.split("x").map(Number);
    const inferSteps = steps || 4;

    let lastError = "";

    for (const model of MODELS) {
      const response = await callHuggingFace(
        model,
        prompt,
        hfToken,
        width || 1024,
        height || 1024,
        inferSteps
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";

        if (contentType.includes("image")) {
          const imageBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(imageBuffer).toString("base64");
          return NextResponse.json({
            image: base64,
            seed,
            steps: inferSteps,
            resolution: resolution || "1024x1024 ( 1:1 )",
          });
        }

        const jsonResp = await response.json();
        if (Array.isArray(jsonResp) && jsonResp[0]?.generated_image) {
          return NextResponse.json({
            image: jsonResp[0].generated_image,
            seed,
            steps: inferSteps,
            resolution: resolution || "1024x1024 ( 1:1 )",
          });
        }

        lastError = `Unexpected response format from ${model}`;
        continue;
      }

      const errText = await response.text();
      console.error(`HF ${model} error:`, response.status, errText);

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: "مفتاح API غير صالح. تحقق من صلاحية HUGGINGFACE_API_KEY." },
          { status: 403 }
        );
      }

      if (response.status === 503) {
        let parsed;
        try {
          parsed = JSON.parse(errText);
        } catch {
          /* ignore */
        }
        if (parsed?.estimated_time) {
          lastError = `النموذج ${model} قيد التحميل (${Math.ceil(parsed.estimated_time)} ثانية). جارٍ تجربة نموذج آخر...`;
          continue;
        }
      }

      lastError = `خطأ من ${model}: ${response.status} - ${errText.slice(0, 200)}`;
      continue;
    }

    return NextResponse.json(
      { error: lastError || "فشلت جميع النماذج. حاول مجدداً بعد قليل." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      {
        error: `خطأ غير متوقع: ${error instanceof Error ? error.message : "unknown"}`,
      },
      { status: 500 }
    );
  }
}
