"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getTeamLogo } from "@/lib/teamLogos"
import Image from "next/image"
import type { Standing, Team } from "@/lib/madden-types"
import { ArrowDown, ArrowUp } from "lucide-react"

interface LiveStandingsTableProps {
  standings: Standing[]
  teams: Team[]
}

export function LiveStandingsTable({ standings, teams }: LiveStandingsTableProps) {
  const teamMap = useMemo(() => new Map(teams.map((t) => [t.teamId, t])), [teams])

  const [sortColumn, setSortColumn] = useState<string | null>("rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const sortedStandings = useMemo(() => {
    if (!sortColumn) return standings

    return [...standings].sort((a, b) => {
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
  }, [standings, sortColumn, sortDirection])

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc") // Default to ascending for rank, descending for stats
      if (
        [
          "wins",
          "losses",
          "ties",
          "winPct",
          "netPts",
          "ptsFor",
          "ptsAgainst",
          "tODiff",
          "offTotalYds",
          "offPassYds",
          "offRushYds",
          "defTotalYds",
          "defPassYds",
          "defRushYds",
        ].includes(columnKey)
      ) {
        setSortDirection("desc")
      }
    }
  }

  return (
    <div className="rounded-md border overflow-auto mx-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("rank")}>
              <div className="flex items-center gap-1">
                Rank{" "}
                {sortColumn === "rank" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("wins")}>
              <div className="flex items-center gap-1">
                W{" "}
                {sortColumn === "wins" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("losses")}>
              <div className="flex items-center gap-1">
                L{" "}
                {sortColumn === "losses" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("ties")}>
              <div className="flex items-center gap-1">
                T{" "}
                {sortColumn === "ties" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("winPct")}>
              <div className="flex items-center gap-1">
                Win %{" "}
                {sortColumn === "winPct" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("divRecord")}>
              <div className="flex items-center gap-1">
                Div{" "}
                {sortColumn === "divRecord" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("confRecord")}>
              <div className="flex items-center gap-1">
                Conf{" "}
                {sortColumn === "confRecord" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("streak")}>
              <div className="flex items-center gap-1">
                Streak{" "}
                {sortColumn === "streak" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("netPts")}>
              <div className="flex items-center gap-1">
                Net Pts{" "}
                {sortColumn === "netPts" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("ptsFor")}>
              <div className="flex items-center gap-1">
                PF{" "}
                {sortColumn === "ptsFor" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("ptsAgainst")}>
              <div className="flex items-center gap-1">
                PA{" "}
                {sortColumn === "ptsAgainst" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("tODiff")}>
              <div className="flex items-center gap-1">
                TO Diff{" "}
                {sortColumn === "tODiff" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("offTotalYds")}>
              <div className="flex items-center gap-1">
                Off Yds{" "}
                {sortColumn === "offTotalYds" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("defTotalYds")}>
              <div className="flex items-center gap-1">
                Def Yds{" "}
                {sortColumn === "defTotalYds" &&
                  (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStandings.map((standing) => {
            const team = teamMap.get(standing.teamId)
            const winPct =
              standing.wins + standing.losses + standing.ties > 0
                ? (standing.wins + standing.ties / 2) / (standing.wins + standing.losses + standing.ties)
                : 0 // Handle division by zero

            return (
              <TableRow key={standing.teamId}>
                <TableCell className="font-bold">{standing.rank}</TableCell>
                <TableCell>
                  {team ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src={getTeamLogo(team.abbrName) || "/placeholder.svg"}
                        alt={`${team.displayName} logo`}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                      {team.displayName}
                    </div>
                  ) : (
                    standing.teamName || "Unknown Team"
                  )}
                </TableCell>
                <TableCell>{standing.wins}</TableCell>
                <TableCell>{standing.losses}</TableCell>
                <TableCell>{standing.ties}</TableCell>
                <TableCell>{winPct.toFixed(3)}</TableCell>
                <TableCell>{standing.divRecord || "N/A"}</TableCell>
                <TableCell>{standing.confRecord || "N/A"}</TableCell>
                <TableCell>{standing.streak || "N/A"}</TableCell>
                <TableCell>{standing.netPts}</TableCell>
                <TableCell>{standing.ptsFor}</TableCell>
                <TableCell>{standing.ptsAgainst}</TableCell>
                <TableCell>{standing.tODiff}</TableCell>
                <TableCell>{standing.offTotalYds}</TableCell>
                <TableCell>{standing.defTotalYds}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
