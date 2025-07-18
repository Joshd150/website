import type React from "react"
import { Youtube } from "lucide-react"
import { DiscordIcon } from "./discord-icon"
import { TikTokIcon } from "./tiktok-icon"
import { InstagramIcon } from "./instagram-icon"

// X (Twitter) Icon Component
export function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// Twitter Icon (alias for X Icon for backward compatibility)
export function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return <XIcon {...props} />
}

// YouTube Icon (imported from lucide-react)
export const YoutubeIcon = Youtube

// Twitch Icon Component
export function TwitchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m4 4V7" />
    </svg>
  )
}

// Re-export all individual icons for easy importing
export { DiscordIcon, TikTokIcon, InstagramIcon }

// Export all icons as a group for convenience
export const SocialIcons = {
  Discord: DiscordIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  Twitch: TwitchIcon,
  Twitter: TwitterIcon,
  X: XIcon,
  YouTube: YoutubeIcon,
  Youtube: YoutubeIcon, // Alternative naming
}