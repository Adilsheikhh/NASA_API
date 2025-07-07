import { NextRequest, NextResponse } from 'next/server';
import { NASAService } from '@/services/nasa';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NASA API key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    const nasaService = new NASAService(apiKey);

    // Get images in date range
    if (startDate && endDate) {
      const images = await nasaService.getImagesInRange(startDate, endDate);
      return NextResponse.json(images);
    }

    // Get image by specific date
    if (date) {
      const image = await nasaService.getImageByDate(date);
      return NextResponse.json(image);
    }

    // Get today's image
    const image = await nasaService.getImageOfTheDay();
    return NextResponse.json(image);

  } catch (error) {
    console.error('NASA API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NASA data' },
      { status: 500 }
    );
  }
}
