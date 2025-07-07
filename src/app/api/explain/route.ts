import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/gemini';
import { NASAImage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const image: NASAImage = body.image;

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    const geminiService = new GeminiService(apiKey);
    const explanation = await geminiService.explainImage(image);

    return NextResponse.json(explanation);

  } catch (error) {
    console.error('Gemini explanation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}
