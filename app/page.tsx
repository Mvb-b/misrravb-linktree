import { Profile } from '../components/Profile'
import { LinkButton } from '../components/LinkButton'
import { NewsletterButton } from '../components/NewsletterButton'
import { Footer } from '../components/Footer'

const socialLinks = [
  { platform: 'twitch' as const, title: 'Twitch', url: 'https://www.twitch.tv/misrravb', username: '@misrravb' },
  { platform: 'tiktok' as const, title: 'TikTok', url: 'https://www.tiktok.com/@misrravb', username: '@misrravb' },
  { platform: 'instagram' as const, title: 'Instagram', url: 'https://www.instagram.com/misrravb', username: '@misrravb' },
  { platform: 'twitter' as const, title: 'Twitter / X', url: 'https://twitter.com/misrravb', username: '@misrravb' },
  { platform: 'youtube' as const, title: 'YouTube', url: 'https://www.youtube.com/@MisrraVB', username: '@MisrraVB' },
  { platform: 'facebook' as const, title: 'Facebook', url: 'https://www.facebook.com/MisrraVB', username: 'MisrraVB' },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Profile Section */}
        <Profile 
          name="MisrraVB" 
          subtitle="Streamer Fracasado"
          bio="Misrain Sebastián Valencia Bustos | Contenido de streams y gaming"
          avatarUrl="/avatar.jpg"
        />

        {/* Links Section */}
        <div className="space-y-3 px-2 mt-2">
          {/* Newsletter Button - Highlighted */}
          <NewsletterButton />
          
          {/* Social Links */}
          {socialLinks.map((link) => (
            <LinkButton
              key={link.platform}
              platform={link.platform}
              title={link.title}
              url={link.url}
              username={link.username}
            />
          ))}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}
