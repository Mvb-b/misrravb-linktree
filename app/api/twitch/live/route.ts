import { NextResponse } from 'next/server'

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || ''
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || ''
const CHANNEL_NAME = 'misrravb'

let accessToken: string | null = null
let tokenExpiry: number = 0

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get Twitch access token')
  }

  const data = await response.json()
  accessToken = data.access_token as string
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Cache until 1 min before expiry
  
  return accessToken!
}

export async function GET() {
  try {
    // If no credentials, return fallback (for dev/demo)
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
      return NextResponse.json({
        isLive: false,
        viewers: 0,
        title: '',
        game: '',
        error: 'Twitch credentials not configured',
        fallback: true,
      })
    }

    const token = await getAccessToken()

    // Get user ID from channel name
    const userResponse = await fetch(
      `https://api.twitch.tv/helix/users?login=${CHANNEL_NAME}`,
      {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await userResponse.json()
    const userId = userData.data?.[0]?.id

    if (!userId) {
      return NextResponse.json({
        isLive: false,
        viewers: 0,
        title: '',
        game: '',
      })
    }

    // Check if stream is live
    const streamResponse = await fetch(
      `https://api.twitch.tv/helix/streams?user_id=${userId}`,
      {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!streamResponse.ok) {
      throw new Error('Failed to fetch stream data')
    }

    const streamData = await streamResponse.json()
    const stream = streamData.data?.[0]

    return NextResponse.json({
      isLive: !!stream,
      viewers: stream?.viewer_count || 0,
      title: stream?.title || '',
      game: stream?.game_name || '',
      thumbnail: stream?.thumbnail_url?.replace('{width}', '320').replace('{height}', '180') || '',
      startedAt: stream?.started_at || '',
    })
  } catch (error) {
    console.error('Twitch API error:', error)
    return NextResponse.json(
      {
        isLive: false,
        viewers: 0,
        title: '',
        game: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Cache the response for 30 seconds
export const revalidate = 30
