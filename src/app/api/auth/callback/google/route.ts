import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  let returnUrl = '/dashboard/donor';
  if (state) {
    try {
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
      if (decodedState?.returnUrl) {
        returnUrl = decodedState.returnUrl;
      }
    } catch {
      // Keep default returnUrl if decode fails
    }
  }

  // Handle Google OAuth cancellation or error
  if (error || !code) {
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Google Sign-In Cancelled — DropOfLife</title>
        <style>
          body {
            margin: 0;
            background: #09090b;
            color: #fff;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
          }
          .box {
            padding: 30px;
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 20px;
            max-width: 400px;
          }
          h3 { color: #f43f5e; margin: 0 0 10px; }
          p { color: #a1a1aa; font-size: 13px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="box">
          <h3>Authentication Cancelled</h3>
          <p>${error || 'Google login was interrupted or closed.'}</p>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              message: '${error || 'Sign-in cancelled'}'
            }, window.location.origin);
            setTimeout(() => window.close(), 1200);
          } else {
            setTimeout(() => { window.location.href = '/login'; }, 1500);
          }
        </script>
      </body>
      </html>
    `;
    return new Response(errorHtml, {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  try {
    const clientId =
      process.env.GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const baseUrl =
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/callback/google`;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials missing on server.');
    }

    // 1. Exchange OAuth code for Google Access Token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Google token exchange failed:', errorData);
      throw new Error('Google token exchange failed. Please verify credentials.');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch User Profile from Google
    const profileResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!profileResponse.ok) {
      throw new Error('Failed to retrieve Google profile data.');
    }

    const googleProfile = await profileResponse.json();
    const { sub: googleId, email, name, picture: avatarUrl } = googleProfile;

    // 3. Communicate with DropOfLife Backend
    const backendApiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1';

    const backendRes = await fetch(`${backendApiUrl}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        avatarUrl,
        googleId,
      }),
    });

    const backendJson = await backendRes.json();
    const authData = backendJson.data;

    let responsePayload: any;
    let setTokenCookie = false;

    if (authData?.token && authData?.user && authData?.isProfileComplete) {
      // Existing User With Complete Profile
      responsePayload = {
        type: 'GOOGLE_AUTH_SUCCESS',
        status: 'AUTHENTICATED',
        user: authData.user,
        token: authData.token,
        returnUrl: returnUrl || `/dashboard/${authData.user.role || 'donor'}`,
      };
      setTokenCookie = true;
    } else {
      // New User Or Incomplete Profile -> Needs Step 2
      responsePayload = {
        type: 'GOOGLE_AUTH_SUCCESS',
        status: 'NEEDS_STEP_2',
        googleUser: {
          name: name || 'Google Lifesaver',
          email,
          avatarUrl: avatarUrl || '',
          googleId,
        },
        returnUrl,
      };
    }

    const htmlBridge = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Connecting DropOfLife...</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: #09090b;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
            text-align: center;
          }
          .droplet-glow {
            position: relative;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #9f1239 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 40px rgba(225, 29, 72, 0.7);
            animation: pulseWave 1.6s infinite ease-in-out;
          }
          @keyframes pulseWave {
            0% { transform: scale(0.94); box-shadow: 0 0 20px rgba(225,29,72,0.6); }
            50% { transform: scale(1.06); box-shadow: 0 0 50px rgba(225,29,72,0.9); }
            100% { transform: scale(0.94); box-shadow: 0 0 20px rgba(225,29,72,0.6); }
          }
          .title {
            margin-top: 24px;
            font-size: 17px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #ffffff;
          }
          .subtitle {
            margin-top: 6px;
            font-size: 12px;
            color: #a1a1aa;
          }
        </style>
      </head>
      <body>
        <div class="droplet-glow">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#ffffff" stroke="none">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
        </div>
        <div class="title">Google Verification Complete</div>
        <div class="subtitle">Syncing emergency lifesaver session...</div>

        <script>
          const payload = ${JSON.stringify(responsePayload)};

          if (window.opener) {
            window.opener.postMessage(payload, window.location.origin);
            setTimeout(() => {
              window.close();
            }, 500);
          } else {
            // Full browser window redirect fallback
            if (payload.status === 'AUTHENTICATED') {
              window.location.href = payload.returnUrl || '/dashboard/donor';
            } else {
              const u = payload.googleUser;
              window.location.href = '/register?google_step2=true&name=' +
                encodeURIComponent(u.name) +
                '&email=' + encodeURIComponent(u.email) +
                '&avatar=' + encodeURIComponent(u.avatarUrl) +
                '&googleId=' + encodeURIComponent(u.googleId || '');
            }
          }
        </script>
      </body>
      </html>
    `;

    const response = new Response(htmlBridge, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

    if (setTokenCookie && authData?.token) {
      response.headers.append(
        'Set-Cookie',
        `token=${authData.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
          7 * 24 * 60 * 60
        }`
      );
    }

    return response;
  } catch (err: any) {
    console.error('Google Callback Error:', err);
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Google Authentication Error — DropOfLife</title>
        <style>
          body {
            margin: 0;
            background: #09090b;
            color: #fff;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
          }
          .box {
            padding: 32px;
            background: #18181b;
            border: 1px solid #e11d48;
            border-radius: 20px;
            max-width: 440px;
            box-shadow: 0 10px 40px rgba(225,29,72,0.2);
          }
          h3 { color: #f43f5e; margin: 0 0 10px; font-size: 18px; }
          p { color: #a1a1aa; font-size: 13px; line-height: 1.6; }
          button {
            margin-top: 18px;
            padding: 10px 20px;
            background: #e11d48;
            color: #fff;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h3>Authentication Failed</h3>
          <p>${err.message || 'Unable to complete Google OAuth sign-in.'}</p>
          <button onclick="window.close()">Close Window</button>
        </div>
      </body>
      </html>
    `;
    return new Response(errorHtml, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
