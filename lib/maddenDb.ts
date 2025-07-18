// lib/maddenDb.ts
// This module is intended for use in Client Components.
// It fetches data from the /api/madden-data API route.

import type {
  Player,
  Team,
  Standing,
  PlayerStats,
  PlayerStatEntry,
  MaddenGame,
  TeamStats,
  LeagueSettings,
} from "./madden-types"

async function fetchMaddenData<T>(type: string, leagueId: string, params?: Record<string, any>): Promise<T> {
  const queryParams = new URLSearchParams({ type, leagueId, ...params }).toString()
  const apiUrl = `/api/madden-data?${queryParams}`

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 0 }, // Ensure fresh data on every request
    })
    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`[maddenDb] Failed to fetch data for type ${type}:`, error)
    throw new Error(
      `Could not load league data for ${type}. Ensure your /api/madden-data route is accessible. Error: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

async function fetchLeagueSettings(guildId: string): Promise<LeagueSettings | null> {
  const queryParams = new URLSearchParams({ type: "leagueSettings", guildId }).toString()
  const apiUrl = `/api/madden-data?${queryParams}`

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 0 },
    })
    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`[maddenDb] Failed to fetch league settings:`, error)
    throw new Error(
      `Could not load league settings. Ensure your /api/madden-data route is accessible. Error: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

// --- MAIN FETCH FUNCTIONS for Client Components ---

export async function getLatestPlayers(leagueId: string): Promise<Player[]> {
  return fetchMaddenData<Player[]>("players", leagueId)
}

export async function getPlayers(leagueId: string): Promise<Player[]> {
  return fetchMaddenData<Player[]>("players", leagueId)
}

export async function getLatestTeams(leagueId: string): Promise<Team[]> {
  return fetchMaddenData<Team[]>("teams", leagueId)
}

export async function getTeams(leagueId: string): Promise<Team[]> {
  return fetchMaddenData<Team[]>("teams", leagueId)
}

export async function getLatestStandings(leagueId: string): Promise<Standing[]> {
  return fetchMaddenData<Standing[]>("standings", leagueId)
}

export async function getStandings(leagueId: string): Promise<Standing[]> {
  return fetchMaddenData<Standing[]>("standings", leagueId)
}

export async function getPlayerStats(leagueId: string, player: Player): Promise<PlayerStats> {
  return fetchMaddenData<PlayerStats>("playerStats", leagueId, { rosterId: player.rosterId.toString() })
}

export async function getPassingStats(leagueId: string): Promise<PlayerStatEntry[]> {
  return fetchMaddenData<PlayerStatEntry[]>("passingStats", leagueId)
}

export async function getRushingStats(leagueId: string): Promise<PlayerStatEntry[]> {
  return fetchMaddenData<PlayerStatEntry[]>("rushingStats", leagueId)
}

export async function getReceivingStats(leagueId: string): Promise<PlayerStatEntry[]> {
  return fetchMaddenData<PlayerStatEntry[]>("receivingStats", leagueId)
}

export async function getDefensiveStats(leagueId: string): Promise<PlayerStatEntry[]> {
  return fetchMaddenData<PlayerStatEntry[]>("defensiveStats", leagueId)
}

export async function getKickingStats(leagueId: string): Promise<PlayerStatEntry[]> {
  return fetchMaddenData<PlayerStatEntry[]>("kickingStats", leagueId)
}

export async function getPuntingStats(leagueId: string): Promise<PlayerStatEntry[]> {
  return fetchMaddenData<PlayerStatEntry[]>("puntingStats", leagueId)
}

// Added functions for schedule and team stats
export async function getWeekSchedule(leagueId: string, weekIndex: number, seasonIndex: number): Promise<MaddenGame[]> {
  return fetchMaddenData<MaddenGame[]>("weekSchedule", leagueId, {
    weekIndex: weekIndex.toString(),
    seasonIndex: seasonIndex.toString(),
  })
}

export async function getTeamStats(leagueId: string): Promise<TeamStats[]> {
  return fetchMaddenData<TeamStats[]>("teamStats", leagueId)
}

export { fetchLeagueSettings }
