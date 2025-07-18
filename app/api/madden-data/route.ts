// app/api/madden-data/route.ts
// This is an API route that client components can fetch data from.
// It calls server-side functions from madden-firestore-db.ts.

import { NextResponse } from "next/server"
import {
  getLatestPlayersServer,
  getLatestTeamsServer,
  getLatestStandingsServer,
  getPlayerStatsServer,
  getLeagueSettingsServer,
  getStatsCollectionServer,
  getWeekScheduleServer, // Added
  getTeamStatsServer, // Added
} from "@/lib/madden-firestore-db" // Corrected imports
import { PlayerStatType } from "@/lib/madden-types"

// Define a type for the expected query parameters
interface MaddenDataQueryParams {
  type: string // e.g., 'players', 'teams', 'playerStats', 'leagueSettings', 'passingStats', etc.
  leagueId?: string
  rosterId?: string
  guildId?: string
  weekIndex?: string // Added
  seasonIndex?: string // Added
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const { type, leagueId, rosterId, guildId, weekIndex, seasonIndex } = Object.fromEntries(
    searchParams.entries(),
  ) as MaddenDataQueryParams

  console.log(
    `[API Route] Received request for type: ${type}, leagueId: ${leagueId}, rosterId: ${rosterId}, guildId: ${guildId}, weekIndex: ${weekIndex}, seasonIndex: ${seasonIndex}`,
  )

  if (!type) {
    console.error("[API Route] Missing 'type' parameter.")
    return NextResponse.json({ error: "Missing 'type' parameter" }, { status: 400 })
  }

  // Ensure leagueId is present for most data types
  if (type !== "leagueSettings" && !leagueId) {
    console.error(`[API Route] Missing 'leagueId' parameter for type: ${type}.`)
    return NextResponse.json({ error: "Missing 'leagueId' parameter" }, { status: 400 })
  }

  try {
    let data: any
    switch (type) {
      case "players":
        if (!leagueId) throw new Error("leagueId is required for players.")
        data = await getLatestPlayersServer(leagueId)
        console.log(`[API Route] Fetched ${data.length} players.`)
        return NextResponse.json(data)
      case "teams":
        if (!leagueId) throw new Error("leagueId is required for teams.")
        data = await getLatestTeamsServer(leagueId)
        console.log(`[API Route] Fetched ${data.length} teams.`)
        return NextResponse.json(data)
      case "standings":
        if (!leagueId) throw new Error("leagueId is required for standings.")
        data = await getLatestStandingsServer(leagueId)
        console.log(`[API Route] Fetched ${data.length} standings.`)
        return NextResponse.json(data)
      case "playerStats":
        if (!leagueId || !rosterId) throw new Error("leagueId and rosterId are required for playerStats.")
        data = await getPlayerStatsServer(leagueId, Number.parseInt(rosterId))
        console.log(`[API Route] Fetched player stats for rosterId ${rosterId}.`)
        return NextResponse.json(data)
      case "leagueSettings":
        if (!guildId) throw new Error("guildId is required for leagueSettings.")
        data = await getLeagueSettingsServer(guildId)
        console.log(`[API Route] Fetched league settings for guildId ${guildId}.`)
        return NextResponse.json(data)
      case "passingStats":
        if (!leagueId) throw new Error("leagueId is required for passingStats.")
        data = await getStatsCollectionServer(leagueId, PlayerStatType.PASSING)
        console.log(`[API Route] Fetched ${data.length} passing stats.`)
        return NextResponse.json(data)
      case "rushingStats":
        if (!leagueId) throw new Error("leagueId is required for rushingStats.")
        data = await getStatsCollectionServer(leagueId, PlayerStatType.RUSHING)
        console.log(`[API Route] Fetched ${data.length} rushing stats.`)
        return NextResponse.json(data)
      case "receivingStats":
        if (!leagueId) throw new Error("leagueId is required for receivingStats.")
        data = await getStatsCollectionServer(leagueId, PlayerStatType.RECEIVING)
        console.log(`[API Route] Fetched ${data.length} receiving stats.`)
        return NextResponse.json(data)
      case "defensiveStats":
        if (!leagueId) throw new Error("leagueId is required for defensiveStats.")
        data = await getStatsCollectionServer(leagueId, PlayerStatType.DEFENSE)
        console.log(`[API Route] Fetched ${data.length} defensive stats.`)
        return NextResponse.json(data)
      case "kickingStats":
        if (!leagueId) throw new Error("leagueId is required for kickingStats.")
        data = await getStatsCollectionServer(leagueId, PlayerStatType.KICKING)
        console.log(`[API Route] Fetched ${data.length} kicking stats.`)
        return NextResponse.json(data)
      case "puntingStats":
        if (!leagueId) throw new Error("leagueId is required for puntingStats.")
        data = await getStatsCollectionServer(leagueId, PlayerStatType.PUNTING)
        console.log(`[API Route] Fetched ${data.length} punting stats.`)
        return NextResponse.json(data)
      case "weekSchedule": // Added
        if (!leagueId || weekIndex === undefined || seasonIndex === undefined)
          throw new Error("leagueId, weekIndex, and seasonIndex are required for weekSchedule.")
        data = await getWeekScheduleServer(leagueId, Number.parseInt(weekIndex), Number.parseInt(seasonIndex))
        console.log(`[API Route] Fetched ${data.length} schedule entries for week ${weekIndex}, season ${seasonIndex}.`)
        return NextResponse.json(data)
      case "teamStats": // Added
        if (!leagueId) throw new Error("leagueId is required for teamStats.")
        data = await getTeamStatsServer(leagueId)
        console.log(`[API Route] Fetched ${data.length} team stats.`)
        return NextResponse.json(data)
      default:
        console.error(`[API Route] Unknown data type: ${type}.`)
        return NextResponse.json({ error: `Unknown data type: ${type}` }, { status: 400 })
    }
  } catch (error: any) {
    console.error(`Error in /api/madden-data for type ${type}:`, error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
