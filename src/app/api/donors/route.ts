import { NextRequest, NextResponse } from 'next/server';
import donorsData from '@/lib/databaseDonors.json';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bg = searchParams.get('bloodGroup');
    const division = searchParams.get('division');
    const district = searchParams.get('district');
    const excludeUserId = searchParams.get('excludeUserId');

    // First attempt to fetch live from backend API if configured and reachable
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const queryString = searchParams.toString();
      const liveRes = await fetch(`${backendUrl}/donors${queryString ? `?${queryString}` : ''}`, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (liveRes.ok) {
        const liveJson = await liveRes.json();
        const liveDonors = liveJson?.data?.donors;
        if (Array.isArray(liveDonors) && liveDonors.length >= 10) {
          return NextResponse.json(liveJson);
        }
      }
    } catch (liveErr) {
      // Gracefully fall back to bundled 260 database donors
    }

    // Filter bundled dataset
    let result = [...donorsData];

    if (excludeUserId) {
      result = result.filter(
        (u: any) => (u._id || u.id)?.toString() !== excludeUserId.toString()
      );
    }
    if (bg && bg !== 'ALL') {
      result = result.filter((u: any) => u.bloodGroup?.trim().toUpperCase() === bg.trim().toUpperCase());
    }
    if (division && division !== 'ALL') {
      result = result.filter((u: any) => u.division?.trim().toLowerCase() === division.trim().toLowerCase());
    }
    if (district && district !== 'ALL') {
      const qDist = district.trim().toLowerCase();
      result = result.filter(
        (u: any) =>
          u.district?.trim().toLowerCase() === qDist ||
          u.district?.trim().toLowerCase().includes(qDist)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        total: result.length,
        donors: result,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      data: {
        total: donorsData.length,
        donors: donorsData,
      },
    });
  }
}
