import type React from "react"
import { Youtube } from "lucide-react"
import { DiscordIcon } from "./discord-icon"
import { TikTokIcon } from "./tiktok-icon"
import { InstagramIcon } from "./instagram-icon"

export function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export { DiscordIcon, Youtube as YouTubeIcon, XIcon as TwitterIcon, TikTokIcon, InstagramIcon }
