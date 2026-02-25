import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MisrraVB - Streamer Fracasado'
export const size = { width: 1200, height: 630 }
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
            height: '8px',
            background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #ff006e)',
          }}
        />
        
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              marginRight: '24px',
              border: '4px solid rgba(255,255,255,0.1)',
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
                fontSize: '72px',
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: '-2px',
                fontFamily: 'system-ui',
              }}
            >
              MisrraVB
            </span>
            <span
              style={{
                fontSize: '28px',
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
            borderRadius: '16px',
            padding: '20px 40px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span
            style={{
              fontSize: '32px',
              color: '#e2e8f0',
              fontFamily: 'system-ui',
            }}
          >
            🎮 Seguime en todas mis redes
          </span>
        </div>

        {/* Social icons row */}
        <div
          style={{
            display: 'flex',
            marginTop: '40px',
            gap: '20px',
          }}
        >
          {['Twitch', 'TikTok', 'Instagram', 'YouTube', 'X'].map((platform) => (
            <div
              key={platform}
              style={{
                background: 'rgba(124, 58, 237, 0.3)',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '18px',
                color: '#ffffff',
                fontWeight: '600',
                border: '1px solid rgba(124, 58, 237, 0.5)',
                fontFamily: 'system-ui',
              }}
            >
              {platform}
            </div>
          ))}
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
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
