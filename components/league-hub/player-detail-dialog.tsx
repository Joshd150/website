"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Player, PlayerStats, Team } from "@/lib/madden-types"
import { getPlayerStats } from "@/lib/maddenDb" // Corrected import to client-side maddenDb
import { getTeamLogo, getDevTraitLogoUrl } from "@/lib/teamLogos" // Corrected import
import { getPlayerFullName, aggregatePlayerStats, formatAggregatedStats } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { StatProgressBar } from "./stat-progress-bar" // Import StatProgressBar
import Image from "next/image"
import { PlayerSelectionDialog } from "./player-selection-dialog" // Import PlayerSelectionDialog
import { PlayerComparisonBar } from "./player-comparison-bar" // Import PlayerComparisonBar

interface PlayerDetailDialogProps {
  player: Player | null
  teams: Team[] // Pass teams to resolve teamName to abbrName
  leagueId: string
  onClose: () => void
  // New props for comparison
  initialComparePlayer?: Player | null // The first player if opened from comparison context
  onInitiateCompare?: (player1: Player, player2: Player) => void // Callback for when two players are selected for comparison
  onRemoveComparePlayer?: () => void // Callback to remove the second player from comparison
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

export function PlayerDetailDialog({
  player,
  teams = [], // Default to empty array to prevent .find on undefined
  leagueId,
  onClose,
  initialComparePlayer = null,
  onInitiateCompare,
  onRemoveComparePlayer,
}: PlayerDetailDialogProps) {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)
  const [comparePlayerStats, setComparePlayerStats] = useState<PlayerStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [errorStats, setErrorStats] = useState<string | null>(null)
  const [showPlayerSelection, setShowPlayerSelection] = useState(false)
  const [currentComparePlayer, setCurrentComparePlayer] = useState<Player | null>(initialComparePlayer)

  // Fetch stats for the main player
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

  // Fetch stats for the comparison player
  useEffect(() => {
    if (currentComparePlayer) {
      getPlayerStats(leagueId, currentComparePlayer)
        .then((stats) => {
          setComparePlayerStats(stats)
        })
        .catch((err) => {
          console.error("Failed to fetch compare player stats:", err)
          // Don't set global error, just for this player
        })
    } else {
      setComparePlayerStats(null)
    }
  }, [currentComparePlayer, leagueId])

  if (!player) {
    return null
  }

  const mainPlayerFullName = getPlayerFullName(player)
  const mainPlayerTeam = teams.find((t) => t.teamId === player.teamId)
  const mainPlayerTeamLogo = mainPlayerTeam ? getTeamLogo(mainPlayerTeam.abbrName) : "/placeholder.svg"
  const mainPlayerDevTraitLogo = getDevTraitLogoUrl(getDevTraitName(player.devTrait))

  const comparePlayerFullName = currentComparePlayer ? getPlayerFullName(currentComparePlayer) : ""
  const comparePlayerTeam = currentComparePlayer ? teams.find((t) => t.teamId === currentComparePlayer.teamId) : null
  const comparePlayerTeamLogo = comparePlayerTeam ? getTeamLogo(comparePlayerTeam.abbrName) : "/placeholder.svg"
  const comparePlayerDevTraitLogo = currentComparePlayer
    ? getDevTraitLogoUrl(getDevTraitName(currentComparePlayer.devTrait))
    : "/placeholder.svg"

  const heightFeet = Math.floor(player.height / 12)
  const heightInches = player.height % 12
  const formattedHeight = `${heightFeet}'${heightInches}"`

  const compareHeightFeet = currentComparePlayer ? Math.floor(currentComparePlayer.height / 12) : 0
  const compareHeightInches = currentComparePlayer ? currentComparePlayer.height % 12 : 0
  const formattedCompareHeight = currentComparePlayer ? `${compareHeightFeet}'${compareHeightInches}"` : ""

  const aggregatedStats = playerStats ? aggregatePlayerStats(playerStats) : null
  const aggregatedCompareStats = comparePlayerStats ? aggregatePlayerStats(comparePlayerStats) : null

  // Define key ratings to display with progress bars
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
  ] as const // Use 'as const' for type safety

  // Define key stats for comparison (example, adjust as needed for positions)
  const keyComparisonStats = [
    { key: "passYds", label: "Passing Yards", isHigherBetter: true },
    { key: "passTDs", label: "Passing TDs", isHigherBetter: true },
    { key: "passInts", label: "Interceptions", isHigherBetter: false },
    { key: "rushYds", label: "Rushing Yards", isHigherBetter: true },
    { key: "rushTDs", label: "Rushing TDs", isHigherBetter: true },
    { key: "recYds", label: "Receiving Yards", isHigherBetter: true },
    { key: "recTDs", label: "Receiving TDs", isHigherBetter: true },
    { key: "defTotalTackles", label: "Total Tackles", isHigherBetter: true },
    { key: "defSacks", label: "Sacks", isHigherBetter: true },
    { key: "defInts", label: "Interceptions", isHigherBetter: true },
    { key: "fGMade", label: "Field Goals Made", isHigherBetter: true },
    { key: "kickPts", label: "Kicking Points", isHigherBetter: true },
    { key: "puntYds", label: "Punting Yards", isHigherBetter: true },
  ] as const

  const handleSelectComparePlayer = (selectedPlayer: Player) => {
    setCurrentComparePlayer(selectedPlayer)
    setShowPlayerSelection(false)
    if (onInitiateCompare) {
      onInitiateCompare(player, selectedPlayer)
    }
  }

  const handleRemoveComparePlayer = () => {
    setCurrentComparePlayer(null)
    if (onRemoveComparePlayer) {
      onRemoveComparePlayer()
    }
  }

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent
          className={cn(
            "sm:max-w-[600px] max-h-[90vh] flex flex-col bg-zinc-900 border-primary/20 text-foreground",
            currentComparePlayer && "sm:max-w-[900px]", // Wider for comparison
          )}
        >
          <DialogHeader className="pb-4">
            {currentComparePlayer ? (
              <div className="flex justify-between items-start w-full">
                {/* Player 1 Header */}
                <div className="flex flex-col items-start text-left flex-1 pr-2">
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
                    <DialogTitle className="text-2xl font-bold">{mainPlayerFullName}</DialogTitle>
                  </div>
                  <DialogDescription className="text-muted-foreground text-sm flex items-center gap-1 ml-12">
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

                <div className="flex flex-col items-center justify-center bg-primary/20 rounded-lg p-2 min-w-[80px] text-center shadow-md">
                  <span className="text-4xl font-bold text-primary">{player.playerBestOvr}</span>
                  <span className="text-xs text-muted-foreground">OVR</span>
                </div>

                <span className="text-3xl font-bold mx-4 text-primary-foreground self-center">VS</span>

                <div className="flex flex-col items-end text-right flex-1 pl-2">
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-2xl font-bold">{comparePlayerFullName}</DialogTitle>
                    {comparePlayerTeamLogo && (
                      <Image
                        src={comparePlayerTeamLogo || "/placeholder.svg"}
                        alt={`${comparePlayerTeam?.displayName || "Unknown"} logo`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    )}
                  </div>
                  <DialogDescription className="text-muted-foreground text-sm flex items-center gap-1 mr-12">
                    {getDevTraitName(currentComparePlayer.devTrait)}{" "}
                    <Image
                      src={comparePlayerDevTraitLogo || "/placeholder.svg"}
                      alt={`${getDevTraitName(currentComparePlayer.devTrait)} Dev Trait`}
                      width={16}
                      height={16}
                      className="inline-block"
                    />{" "}
                    • {comparePlayerTeam?.displayName || "Free Agent"} • {currentComparePlayer.position}
                  </DialogDescription>
                </div>

                <div className="flex flex-col items-center justify-center bg-secondary/20 rounded-lg p-2 min-w-[80px] text-center shadow-md">
                  <span className="text-4xl font-bold text-secondary">{currentComparePlayer.playerBestOvr}</span>
                  <span className="text-xs text-muted-foreground">OVR</span>
                </div>
              </div>
            ) : (
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
            )}
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="grid gap-4 py-4">
              {currentComparePlayer ? (
                <>
                  {/* Basic Details Comparison */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-left">
                      <h3 className="font-semibold text-lg mb-2">Details</h3>
                      <p>Age: {player.age}</p>
                      <p>Height: {formattedHeight}</p>
                      <p>Weight: {player.weight} lbs</p>
                      <p>Years Pro: {player.yearsPro}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-semibold text-lg mb-2">Details</h3>
                      <p>Age: {currentComparePlayer.age}</p>
                      <p>Height: {formattedCompareHeight}</p>
                      <p>Weight: {currentComparePlayer.weight} lbs</p>
                      <p>Years Pro: {currentComparePlayer.yearsPro}</p>
                    </div>
                  </div>

                  <Separator className="bg-primary/20" />

                  {/* Key Ratings Comparison */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-center">Key Ratings Comparison</h3>
                    <div className="grid gap-2">
                      {keyRatings.map((rating) => {
                        const value1 = player[rating.key as keyof Player] as number | undefined
                        const value2 = currentComparePlayer[rating.key as keyof Player] as number | undefined
                        if (value1 !== undefined && value1 !== null && value2 !== undefined && value2 !== null) {
                          return (
                            <PlayerComparisonBar
                              key={rating.key}
                              label={rating.label}
                              value1={value1}
                              value2={value2}
                              maxValue={99}
                              isHigherBetter={true} // Ratings are generally higher better
                            />
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>

                  <Separator className="bg-primary/20" />

                  {/* Career Stats Comparison */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-center">Career Stats Comparison</h3>
                    {loadingStats ? (
                      <p className="text-muted-foreground text-center">Loading stats...</p>
                    ) : errorStats ? (
                      <div className="text-red-400 bg-red-950/50 border border-red-500/50 rounded-lg p-2 flex items-center gap-2 text-sm text-center">
                        <AlertCircle className="h-4 w-4" />
                        {errorStats}
                      </div>
                    ) : aggregatedStats && aggregatedCompareStats ? (
                      <div className="grid gap-2">
                        {keyComparisonStats.map((stat) => {
                          const value1 = aggregatedStats[stat.key] || 0
                          const value2 = aggregatedCompareStats[stat.key] || 0
                          return (
                            <PlayerComparisonBar
                              key={stat.key}
                              label={stat.label}
                              value1={value1}
                              value2={value2}
                              maxValue={Math.max(value1, value2, 1)} // Max value for bar
                              isHigherBetter={stat.isHigherBetter}
                            />
                          )
                        })}
                        {Object.keys(aggregatedStats).length === 0 &&
                          Object.keys(aggregatedCompareStats).length === 0 && (
                            <p className="text-muted-foreground text-center">
                              No career stats available for these players.
                            </p>
                          )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center">
                        No career stats available for one or both players.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Single Player Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Other Details</h3>
                      <p>First Name: {player.firstName}</p>
                      <p>Last Name: {player.lastName}</p>
                      <p>Position: {player.position}</p>
                      <p>Overall: {player.overall}</p> {/* Explicitly show overall */}
                      <p>Age: {player.age}</p>
                      <p>Height: {formattedHeight}</p>
                      <p>Weight: {player.weight} lbs</p>
                      <p>Years Pro: {player.yearsPro}</p>
                      <p>College: {player.college}</p>
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
                              maxValue={99} // Assuming 99 is max for Madden ratings
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
                </>
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-end p-4 border-t border-zinc-800">
            {currentComparePlayer ? (
              <div className="flex gap-2">
                <Button onClick={handleRemoveComparePlayer} variant="outline">
                  Remove Comparison
                </Button>
                <Button onClick={() => setShowPlayerSelection(true)} className="bg-primary hover:bg-primary/90">
                  Select Another Player
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowPlayerSelection(true)} className="bg-primary hover:bg-primary/90">
                Compare Player
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showPlayerSelection && (
        <PlayerSelectionDialog
          initialPlayer={player} // The player already in the detail dialog
          onSelectPlayer={handleSelectComparePlayer}
          onClose={() => setShowPlayerSelection(false)}
        />
      )}
    </>
  )
}
