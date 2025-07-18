"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Player, type PlayerStatEntry, PlayerStatType, type Team } from "@/lib/madden-types"
import { getTeamLogo } from "@/lib/teamLogos" // Corrected import
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

interface PlayerCompareDialogProps {
  players: Player[]
  allTeams: Team[]
  allStats: Record<PlayerStatType, PlayerStatEntry[]>
  onRemovePlayer: (player: Player) => void
}

export function PlayerCompareDialog({ players, allTeams, allStats, onRemovePlayer }: PlayerCompareDialogProps) {
  const teamMap = useMemo(() => {
    return new Map(allTeams.map((team) => [team.teamId, team]))
  }, [allTeams])

  const getPlayerStatsForType = (player: Player, statType: PlayerStatType): PlayerStatEntry[] => {
    return allStats[statType]?.filter((s) => s.rosterId === player.rosterId) || []
  }

  const formatStatValue = (value: number | undefined, defaultValue = "-") => {
    return value !== undefined ? value.toLocaleString() : defaultValue
  }

  const getPlayerStatSummary = (player: Player, statType: PlayerStatType) => {
    const stats = getPlayerStatsForType(player, statType)
    if (stats.length === 0) return null

    // For simplicity, aggregate all entries for a player for a given stat type
    // In a real app, you might want to sum or average across seasons/weeks
    const aggregated = stats.reduce((acc, curr) => {
      if (statType === PlayerStatType.PASSING) {
        acc.passYds = (acc.passYds || 0) + (curr.passYds || 0)
        acc.passTDs = (acc.passTDs || 0) + (curr.passTDs || 0)
        acc.passInts = (acc.passInts || 0) + (curr.passInts || 0)
        acc.passComp = (acc.passComp || 0) + (curr.passComp || 0)
        acc.passAtt = (acc.passAtt || 0) + (curr.passAtt || 0)
      } else if (statType === PlayerStatType.RUSHING) {
        acc.rushYds = (acc.rushYds || 0) + (curr.rushYds || 0)
        acc.rushTDs = (acc.rushTDs || 0) + (curr.rushTDs || 0)
        acc.rushAtt = (acc.rushAtt || 0) + (curr.rushAtt || 0)
      } else if (statType === PlayerStatType.RECEIVING) {
        acc.recYds = (acc.recYds || 0) + (curr.recYds || 0)
        acc.recTDs = (acc.recTDs || 0) + (curr.recTDs || 0)
        acc.recCatches = (acc.recCatches || 0) + (curr.recCatches || 0)
      } else if (statType === PlayerStatType.DEFENSE) {
        acc.defTotalTackles = (acc.defTotalTackles || 0) + (curr.defTotalTackles || 0)
        acc.defSacks = (acc.defSacks || 0) + (curr.defSacks || 0)
        acc.defInts = (acc.defInts || 0) + (curr.defInts || 0)
      } else if (statType === PlayerStatType.KICKING) {
        acc.fGMade = (acc.fGMade || 0) + (curr.fGMade || 0)
        acc.fGAtt = (acc.fGAtt || 0) + (curr.fGAtt || 0)
        acc.xPMade = (acc.xPMade || 0) + (curr.xPMade || 0)
        acc.xPAtt = (acc.xPAtt || 0) + (curr.xPAtt || 0)
      } else if (statType === PlayerStatType.PUNTING) {
        acc.puntYds = (acc.puntYds || 0) + (curr.puntYds || 0)
        acc.puntAtt = (acc.puntAtt || 0) + (curr.puntAtt || 0)
      }
      return acc
    }, {} as PlayerStatEntry)

    // Determine the display title for the stat type
    const statTitle = statType.replace(/_STAT$/, "").replace(/_/g, " ")

    if (statType === PlayerStatType.PASSING) {
      return (
        <>
          <h4 className="font-semibold mb-2">{statTitle} Stats</h4>
          <p>Yds: {formatStatValue(aggregated.passYds)}</p>
          <p>TD: {formatStatValue(aggregated.passTDs)}</p>
          <p>INT: {formatStatValue(aggregated.passInts)}</p>
          <p>
            Comp/Att: {formatStatValue(aggregated.passComp)}/{formatStatValue(aggregated.passAtt)}
          </p>
        </>
      )
    } else if (statType === PlayerStatType.RUSHING) {
      return (
        <>
          <h4 className="font-semibold mb-2">{statTitle} Stats</h4>
          <p>Yds: {formatStatValue(aggregated.rushYds)}</p>
          <p>TD: {formatStatValue(aggregated.rushTDs)}</p>
          <p>Att: {formatStatValue(aggregated.rushAtt)}</p>
        </>
      )
    } else if (statType === PlayerStatType.RECEIVING) {
      return (
        <>
          <h4 className="font-semibold mb-2">{statTitle} Stats</h4>
          <p>Yds: {formatStatValue(aggregated.recYds)}</p>
          <p>TD: {formatStatValue(aggregated.recTDs)}</p>
          <p>Rec: {formatStatValue(aggregated.recCatches)}</p>
        </>
      )
    } else if (statType === PlayerStatType.DEFENSE) {
      return (
        <>
          <h4 className="font-semibold mb-2">{statTitle} Stats</h4>
          <p>Tkl: {formatStatValue(aggregated.defTotalTackles)}</p>
          <p>Sck: {formatStatValue(aggregated.defSacks)}</p>
          <p>Int: {formatStatValue(aggregated.defInts)}</p>
        </>
      )
    } else if (statType === PlayerStatType.KICKING) {
      return (
        <>
          <h4 className="font-semibold mb-2">{statTitle} Stats</h4>
          <p>
            FGM/A: {formatStatValue(aggregated.fGMade)}/{formatStatValue(aggregated.fGAtt)}
          </p>
          <p>
            XPM/A: {formatStatValue(aggregated.xPMade)}/{formatStatValue(aggregated.xPAtt)}
          </p>
        </>
      )
    } else if (statType === PlayerStatType.PUNTING) {
      return (
        <>
          <h4 className="font-semibold mb-2">{statTitle} Stats</h4>
          <p>Yds: {formatStatValue(aggregated.puntYds)}</p>
          <p>Att: {formatStatValue(aggregated.puntAtt)}</p>
        </>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {players.map((player) => {
        const team = teamMap.get(player.teamId)
        return (
          <Card key={player.rosterId}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                {team && (
                  <Image
                    src={getTeamLogo(team.teamAbbr) || "/placeholder.svg"}
                    alt={`${team.teamName} logo`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <CardTitle className="text-xl">
                  {player.firstName} {player.lastName} ({player.position})
                </CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemovePlayer(player)}>
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Remove player</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Overall: {player.overall}</p>
                <p>Age: {player.age}</p>
                <p>
                  Height: {Math.floor(player.height / 12)}'{player.height % 12}"
                </p>
                <p>Weight: {player.weight} lbs</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(PlayerStatType).map((statType) => {
                  const summary = getPlayerStatSummary(player, statType)
                  if (!summary) return null
                  return (
                    <div key={statType} className="border rounded-md p-3">
                      {summary}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
