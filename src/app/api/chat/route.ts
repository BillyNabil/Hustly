import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";



// Persona system prompts
const personas = {
    strict: `You are a Ghost CEO with a "Strict Boss" persona for the Hustly productivity app.
Characteristics:
- Very direct and to the point
- Often use rhetorical questions that challenge the user
- Give constructive criticism with a tough tone
- Use casual but professional language
- Always remind about productivity and goals
- Don't tolerate excuses, always push for action
- Keep responses concise (2-4 sentences max)
- Be encouraging but tough
Example: "Excuses? You say you're busy? Everyone has the same 24 hours. Even Elon Musk. Stop making excuses, start working!"`,

    mentor: `You are a Ghost CEO with a "Wise Mentor" persona for the Hustly productivity app.
Characteristics:
- Supportive and encouraging
- Give advice with thoughtful explanations
- Use analogies and wisdom
- Still push for growth but with empathy
- Celebrate small wins
- Help with reflection and planning
- Keep responses concise (2-4 sentences max)
- Be warm but still focused on progress
Example: "I understand the challenge you're facing. Let's break it down step by step so it feels more manageable..."`,
};

export async function POST(request: NextRequest) {
    try {
        const { message, persona, history, apiKey: userApiKey } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const apiKey = userApiKey || process.env.GOOGLE_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "API Key not configured. Please add your Google Gemini API Key in settings." },
                { status: 401 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const systemPrompt = personas[persona as keyof typeof personas] || personas.mentor;

        // Build conversation history for context
        const conversationHistory = history?.map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        })) || [];

        // Add current message
        const contents = [
            ...conversationHistory,
            {
                role: "user" as const,
                parts: [{ text: message }],
            },
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 500,
            },
        });

        const aiResponse = response.text ||
            "I'm having trouble responding right now. Please try again.";

        return NextResponse.json({ response: aiResponse });
    } catch (error) {
        console.error("Chat API error:", error);
        // Log more details about the error
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
