import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get('returnUrl') || '/dashboard/donor';

  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      {
        error: 'Google Client ID is missing. Please configure GOOGLE_CLIENT_ID in .env.local',
      },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  const statePayload = JSON.stringify({ returnUrl });
  const encodedState = Buffer.from(statePayload).toString('base64');

  const googleAuthParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state: encodedState,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${googleAuthParams.toString()}`;

  return NextResponse.redirect(googleAuthUrl);
}
