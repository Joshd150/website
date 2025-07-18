"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import type { Player, Team } from "@/lib/madden-types"
import { getTeamLogo } from "@/lib/teamLogos"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp } from "lucide-react" // Import icons for sort indicator

// Define a new type for aggregated player stats for the table
interface AggregatedPlayerStatEntry {
  rosterId: number
  player: Player
  team: Team | undefined // Team can be undefined if player is a Free Agent
  [statKey: string]: any // For aggregated stat values
}

interface PlayerStatsTableProps {
  stats: AggregatedPlayerStatEntry[] // Now expects aggregated stats
  players: Player[] // Still needed for PlayerDetailDialog
  teams: Team[] // Still needed for PlayerDetailDialog
  columns: { key: string; header: string }[]
  onPlayerClick: (player: Player) => void // Changed from onPlayerSelect
  leagueId: string
}

export function PlayerStatsTable({
  stats,
  players, // Keep for PlayerDetailDialog
  teams, // Keep for PlayerDetailDialog
  columns,
  onPlayerClick, // Use new prop
  leagueId,
}: PlayerStatsTableProps) {
  const [search, setSearch] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const sortedAndFilteredStats = useMemo(() => {
    const currentStats = stats // Use the already filtered and aggregated stats from props

    // Apply local search filter if needed (though parent already filters by name)
    const filtered = currentStats.filter((item) => {
      if (!search) return true
      const playerName = `${item.player?.firstName || ""} ${item.player?.lastName || ""}`.toLowerCase()
      return playerName.includes(search.toLowerCase())
    })

    // Apply local sort
    if (sortColumn) {
      return [...filtered].sort((a, b) => {
        const aValue = (a as any)[sortColumn]
        const bValue = (b as any)[sortColumn]

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }
        return 0
      })
    }
    return filtered
  }, [stats, search, sortColumn, sortDirection])

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("desc") // Default to descending for new sort
    }
  }

  // Helper to format stat values
  const formatStatValue = (key: string, value: any) => {
    if (typeof value !== "number") return value

    // Specific formatting for percentages and averages
    if (["passPercent", "rushYdsPerAtt", "recYdsPerCatch", "puntYdsPerAtt", "puntNetYdsPerAtt"].includes(key)) {
      return value.toFixed(1) // One decimal place for averages/percentages
    }
    return value.toFixed(0) // No decimal places for whole numbers
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search player in table..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Pos</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("overall")}>
                <div className="flex items-center gap-1">
                  OVR{" "}
                  {sortColumn === "overall" &&
                    (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                </div>
              </TableHead>
              {columns.map((col) => (
                <TableHead key={col.key} className="cursor-pointer" onClick={() => handleSort(col.key)}>
                  <div className="flex items-center gap-1">
                    {col.header}{" "}
                    {sortColumn === col.key &&
                      (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredStats.length > 0 ? (
              sortedAndFilteredStats.map((item) => (
                <TableRow key={item.rosterId}>
                  <TableCell>
                    <Button variant="link" onClick={() => item.player && onPlayerClick(item.player)}>
                      {item.player?.firstName} {item.player?.lastName}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {item.team ? (
                      <div className="flex items-center gap-2">
                        <Image
                          src={getTeamLogo(item.team.abbrName) || "/placeholder.svg"}
                          alt={`${item.team.displayName} logo`}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        {item.team.abbrName}
                      </div>
                    ) : (
                      "FA"
                    )}
                  </TableCell>
                  <TableCell>{item.player?.position}</TableCell>
                  <TableCell>{item.player?.overall}</TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{formatStatValue(col.key, (item as any)[col.key])}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 4} className="text-center">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
