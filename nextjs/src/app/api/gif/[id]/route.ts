/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import { NextRequest, NextResponse } from "next/server";
import { GifService } from "@/lib/services/gifs";


interface RouteParams {
  params: Promise<{ id: string }>;
}


export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id || id.length < 7 || !id.startsWith('g')) return NextResponse.json(
      { success: false, error: 'Gif id id invalid' },
      {
        status: 400, headers: {
          'Cache-Control': 'public, max-age=60',
        }
      });

    const gif = await GifService.find(id);
    if (!gif) return NextResponse.json(
      { success: false, error: 'Not found such gif' },
      {
        status: 404, headers: {
          'Cache-Control': 'public, max-age=60',
        }
      });
    return NextResponse.json(
      {
        success: true,
        data: gif
      }, {
      headers: {
        'Cache-Control': 'public, max-age=60',
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
