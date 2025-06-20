import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) {
    return NextResponse.json({ reply: 'Missing query' }, { status: 400 });
  }

  try {
    const response = await genAI.models.generateContent({
        model:"gemini-2.5-flash",
        contents:`Act like an agriculture expert in India. Answer simply in Hindi.\n\nUser: ${query}`
    })
    const reply = response.text;
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Gemini Error:', error.message);
    return NextResponse.json({ reply: 'Gemini API failed. Try again later.' }, { status: 500 });
  }
}
