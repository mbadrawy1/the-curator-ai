import { NextRequest, NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

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

    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (!hfToken) {
      return NextResponse.json(
        { error: "مفتاح Hugging Face API غير مُعدّ في الخادم." },
        { status: 503 }
      );
    }

    const client = new InferenceClient(hfToken);
    const seed = Math.floor(Math.random() * 2147483647);
    const inferSteps = steps || 4;

    const result: unknown = await client.textToImage({
      provider: "auto",
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
      parameters: {
        num_inference_steps: inferSteps,
        seed,
      },
    });

    let base64: string;
    if (typeof result === "string") {
      base64 = result;
    } else if (result && typeof (result as Blob).arrayBuffer === "function") {
      const arrayBuffer = await (result as Blob).arrayBuffer();
      base64 = Buffer.from(arrayBuffer).toString("base64");
    } else {
      throw new Error("استجابة غير متوقعة من خدمة توليد الصور");
    }

    return NextResponse.json({
      image: base64,
      seed,
      steps: inferSteps,
      resolution: resolution || "1024x1024 ( 1:1 )",
    });
  } catch (error) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error ? error.message : "خطأ غير معروف";

    if (message.includes("401") || message.includes("403") || message.includes("token")) {
      return NextResponse.json(
        { error: "مفتاح API غير صالح. تحقق من صلاحية HUGGINGFACE_API_KEY." },
        { status: 403 }
      );
    }

    if (message.includes("503") || message.includes("loading")) {
      return NextResponse.json(
        { error: "النموذج قيد التحميل، يرجى المحاولة بعد لحظات." },
        { status: 503 }
      );
    }

    if (message.includes("credits") || message.includes("limit")) {
      return NextResponse.json(
        { error: "تم استنفاد رصيد الاستخدام المجاني. يرجى ترقية حساب Hugging Face." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `حدث خطأ: ${message}` },
      { status: 500 }
    );
  }
}
