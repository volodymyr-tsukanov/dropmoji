/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/lib/sec/auth";
import { GifService } from "@/lib/services/gifs";


export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = verifyRequest(req);
    if (payload instanceof NextResponse) return payload;
    else {
      const searchParams = req.nextUrl.searchParams;
      const query = searchParams.get('q');
      let limit = parseInt(searchParams.get('l') || searchParams.get('limit') || '18');
      if (limit < 0 || limit > 30) limit = 6;

      const gifs = await (query ? GifService.search(query, limit) : GifService.trending(limit));
      return NextResponse.json({
        success: true,
        data: gifs,
        count: gifs.length
      }, {
        headers: {
          'Cache-Control': 'public, max-age=120',
        }
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
