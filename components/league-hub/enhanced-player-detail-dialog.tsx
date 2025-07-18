"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Player, PlayerStats, Team } from "@/lib/madden-types"
import { getPlayerStats } from "@/lib/maddenDb"
import { getTeamLogo, getDevTraitLogoUrl } from "@/lib/teamLogos"
import { getPlayerFullName, aggregatePlayerStats, formatAggregatedStats } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

interface EnhancedPlayerDetailDialogProps {
  player: Player | null
  teams: Team[]
  leagueId: string
  onClose: () => void
}

function getDevTraitName(trait: number) {
  switch (trait) {
    case 0:
      return "Normal"
    case 1:
      return "Star"
    case 2:
      return "Superstar"
    case 3:
      return "X-Factor"
    default:
      return "Normal"
  }
}

interface StatProgressBarProps {
  label: string
  value: number
  maxValue?: number
  className?: string
}

function StatProgressBar({ label, value, maxValue = 99, className }: StatProgressBarProps) {
  const percentage = Math.min(100, (value / maxValue) * 100)

  const getColorClass = () => {
    if (value >= 90) return "bg-green-500"
    if (value >= 80) return "bg-yellow-500"
    if (value >= 70) return "bg-orange-500"
    if (value >= 60) return "bg-yellow-700"
    return "bg-red-500"
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-bold text-white">{value}</span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative">
        <div 
          className={cn("absolute top-0 left-0 h-2 rounded-full transition-all duration-500", getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function EnhancedPlayerDetailDialog({
  player,
  teams = [],
  leagueId,
  onClose,
}: EnhancedPlayerDetailDialogProps) {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [errorStats, setErrorStats] = useState<string | null>(null)

  useEffect(() => {
    if (player) {
      setLoadingStats(true)
      setErrorStats(null)
      getPlayerStats(leagueId, player)
        .then((stats) => {
          setPlayerStats(stats)
        })
        .catch((err) => {
          console.error("Failed to fetch player stats:", err)
          setErrorStats("Failed to load player stats.")
        })
        .finally(() => {
          setLoadingStats(false)
        })
    } else {
      setPlayerStats(null)
    }
  }, [player, leagueId])

  if (!player) {
    return null
  }

  const mainPlayerFullName = getPlayerFullName(player)
  const mainPlayerTeam = teams.find((t) => t.teamId === player.teamId)
  const mainPlayerTeamLogo = mainPlayerTeam ? getTeamLogo(mainPlayerTeam.abbrName) : "/placeholder.svg"
  const mainPlayerDevTraitLogo = getDevTraitLogoUrl(getDevTraitName(player.devTrait))

  const heightFeet = Math.floor(player.height / 12)
  const heightInches = player.height % 12
  const formattedHeight = `${heightFeet}'${heightInches}"`

  const aggregatedStats = playerStats ? aggregatePlayerStats(playerStats) : null

  const keyRatings = [
    { key: "overall", label: "Overall" },
    { key: "speedRating", label: "Speed" },
    { key: "accelRating", label: "Accel" },
    { key: "agilityRating", label: "Agility" },
    { key: "awareRating", label: "Awareness" },
    { key: "strengthRating", label: "Strength" },
    { key: "throwPowerRating", label: "THP" },
    { key: "throwAccShortRating", label: "TAS" },
    { key: "throwAccMidRating", label: "TAM" },
    { key: "throwAccDeepRating", label: "TAD" },
    { key: "catchRating", label: "Catch" },
    { key: "runBlockRating", label: "RBK" },
    { key: "passBlockRating", label: "PBK" },
    { key: "tackleRating", label: "Tackle" },
    { key: "manCoverRating", label: "MCV" },
    { key: "zoneCoverRating", label: "ZCV" },
    { key: "kickPowerRating", label: "KPW" },
    { key: "kickAccRating", label: "KAC" },
  ] as const

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col bg-zinc-900 border-primary/20 text-foreground">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {mainPlayerTeamLogo && (
                <Image
                  src={mainPlayerTeamLogo || "/placeholder.svg"}
                  alt={`${mainPlayerTeam?.displayName || "Unknown"} logo`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div className="flex flex-col items-start">
                <DialogTitle className="text-2xl font-bold">{mainPlayerFullName}</DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm flex items-center gap-1">
                  {mainPlayerTeam?.displayName || "Free Agent"} • {player.position} •{" "}
                  <Image
                    src={mainPlayerDevTraitLogo || "/placeholder.svg"}
                    alt={`${getDevTraitName(player.devTrait)} Dev Trait`}
                    width={16}
                    height={16}
                    className="inline-block"
                  />{" "}
                  {getDevTraitName(player.devTrait)}
                </DialogDescription>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-primary/20 rounded-lg p-2 min-w-[80px] text-center shadow-md">
              <span className="text-4xl font-bold text-primary">{player.playerBestOvr}</span>
              <span className="text-xs text-muted-foreground">OVR</span>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Player Details</h3>
                <p>First Name: {player.firstName}</p>
                <p>Last Name: {player.lastName}</p>
                <p>Position: {player.position}</p>
                <p>Overall: {player.overall}</p>
                <p>Age: {player.age}</p>
                <p>Height: {formattedHeight}</p>
                <p>Weight: {player.weight} lbs</p>
                <p>Years Pro: {player.yearsPro}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Contract</h3>
                <p>Status: {player.isFreeAgent ? "Free Agent" : "Signed"}</p>
                {!player.isFreeAgent && (
                  <>
                    <p>
                      Length: {player.contractYearsLeft}/{player.contractLength} yrs
                    </p>
                    <p>Salary: ${player.contractSalary.toLocaleString()}</p>
                    <p>Cap Hit: ${player.capHit.toLocaleString()}</p>
                    <p>Bonus: ${player.contractBonus.toLocaleString()}</p>
                    <p>Savings: ${player.capReleaseNetSavings.toLocaleString()}</p>
                    <p>Penalty: ${player.capReleasePenalty.toLocaleString()}</p>
                  </>
                )}
              </div>
            </div>

            <Separator className="bg-primary/20" />

            <div>
              <h3 className="font-semibold text-lg mb-2">Key Ratings</h3>
              <div className="grid grid-cols-2 gap-2">
                {keyRatings.map((rating) => {
                  const value = player[rating.key as keyof Player] as number | undefined
                  if (value !== undefined && value !== null) {
                    return (
                      <StatProgressBar
                        key={rating.key}
                        label={rating.label}
                        value={value}
                        maxValue={99}
                      />
                    )
                  }
                  return null
                })}
              </div>
            </div>

            <Separator className="bg-primary/20" />

            <div>
              <h3 className="font-semibold text-lg mb-2">Career Stats</h3>
              {loadingStats ? (
                <p className="text-muted-foreground">Loading stats...</p>
              ) : errorStats ? (
                <div className="text-red-400 bg-red-950/50 border border-red-500/50 rounded-lg p-2 flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errorStats}
                </div>
              ) : aggregatedStats && Object.keys(aggregatedStats).length > 0 ? (
                <div className="grid gap-1 text-sm">
                  {formatAggregatedStats(aggregatedStats).map((statLine, index) => (
                    <p key={index}>{statLine}</p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No career stats available for this player.</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}