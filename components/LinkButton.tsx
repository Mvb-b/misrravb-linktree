'use client'

import { PlatformIcon, SocialPlatform, platformColors } from './Icon'
import { ExternalLink } from 'lucide-react'

interface LinkButtonProps {
  platform: SocialPlatform
  title: string
  url: string
  username?: string
}

const platformLabels: Record<SocialPlatform, string> = {
  twitch: 'Twitch',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  twitter: 'Twitter',
  youtube: 'YouTube',
  facebook: 'Facebook',
}

export function LinkButton({ platform, title, url, username }: LinkButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-platform={platform}
      className="link-button flex items-center gap-4 p-4 md:p-5 rounded-xl group"
    >
      {/* Shine effect */}
      <span className="shine-effect" />
      
      {/* Icon */}
      <div className={`flex-shrink-0 icon-glow ${platformColors[platform]}`}>
        <PlatformIcon platform={platform} size={28} className="transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 text-left">
        <h3 className="font-display font-semibold text-white group-hover:text-fire-orange transition-colors">
          {title}
        </h3>
        {username && (
          <p className="text-xs md:text-sm text-gray-500 truncate">
            {username}
          </p>
        )}
      </div>

      {/* External link indicator */}
      <ExternalLink size={18} className="text-gray-600 group-hover:text-fire-orange transition-colors opacity-0 group-hover:opacity-100" />
    </a>
  )
}
