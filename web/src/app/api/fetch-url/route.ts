import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    const html = await response.text();

    // Get the base URL for resolving relative paths
    const baseUrl = new URL(url).origin;

    // Replace relative URLs with absolute URLs
    const processedHtml = html
      .replace(/href="\//g, `href="${baseUrl}/`)
      .replace(/src="\//g, `src="${baseUrl}/`)
      .replace(/url\(['"]?\//g, `url('${baseUrl}/`)
      .replace(/url\(['"]?\.\//g, `url('${baseUrl}/`)
      .replace(/url\(['"]?\.\.\//g, `url('${baseUrl}/`);

    return NextResponse.json({ html: processedHtml });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch URL' },
      { status: 500 }
    );
  }
} 