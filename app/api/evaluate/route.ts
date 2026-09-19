import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { answer } = await req.json();

    if (!answer || answer.trim().length === 0) {
      return NextResponse.json(
        { error: "No answer provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an interview coach. A candidate was asked "Tell me about yourself" and gave this answer:

"${answer}"

Evaluate this answer and respond with ONLY a JSON object, no other text, no markdown code blocks, no explanation. Just the raw JSON in this exact format:

{"score": 7, "strengths": "short sentence here", "improvements": "short sentence here"}

Now give your evaluation as JSON only:`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("RAW GEMINI RESPONSE:", responseText);

    // Extract JSON even if wrapped in markdown or extra text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("No JSON found in response:", responseText);
      return NextResponse.json(
        { error: "AI response was not in expected format", raw: responseText },
        { status: 500 }
      );
    }

    const feedback = JSON.parse(jsonMatch[0]);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: String(error) },
      { status: 500 }
    );
  }
}
