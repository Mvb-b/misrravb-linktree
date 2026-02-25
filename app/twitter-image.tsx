import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MisrraVB - Streamer Fracasado'
export const size = { width: 1200, height: 600 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #16213e 100%)',
          padding: '60px',
        }}
      >
        {/* Gaming accent lines */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #ff006e)',
          }}
        />
        
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '42px',
              fontWeight: 'bold',
              color: 'white',
              marginRight: '20px',
              border: '3px solid rgba(255,255,255,0.1)',
            }}
          >
            M
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: '64px',
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: '-1px',
                fontFamily: 'system-ui',
              }}
            >
              MisrraVB
            </span>
            <span
              style={{
                fontSize: '24px',
                color: '#00d4ff',
                fontWeight: '600',
                fontFamily: 'system-ui',
              }}
            >
              Streamer Fracasado
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px 32px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span
            style={{
              fontSize: '28px',
              color: '#e2e8f0',
              fontFamily: 'system-ui',
            }}
          >
            🎮 Links oficiales - Twitch, TikTok, Instagram y más
          </span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #ff006e, #7c3aed, #00d4ff)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
