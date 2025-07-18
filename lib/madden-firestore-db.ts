// lib/madden-firestore-db.ts
// This module contains server-side functions for interacting directly with Firestore.
// It should only be imported by API routes or Server Actions.

import { db } from "./firebase"
import {
  type Player,
  type Team,
  type Standing,
  type PlayerStats,
  type PlayerStatEntry,
  PlayerStatType,
  type MaddenGame,
  type LeagueSettings,
  type TeamStats, // Added TeamStats import
} from "./madden-types"

// Helper to convert Firestore Timestamps and other non-serializable types
export function convertToSerializable<T>(obj: any): T {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (obj instanceof Date) {
    return obj.toISOString() as T // Convert Date objects to ISO strings
  }

  if (obj.toDate && typeof obj.toDate === "function") {
    // Check for Firestore Timestamp objects
    return obj.toDate().toISOString() as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertToSerializable(item)) as T
  }

  const newObj: { [key: string]: any } = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = convertToSerializable(obj[key])
    }
  }
  return newObj as T
}

export async function getLatestPlayersServer(leagueId: string): Promise<Player[]> {
  try {
    const playersRef = db.collection("league_data").doc(leagueId).collection("MADDEN_PLAYER")
    console.log(`[getLatestPlayersServer] Querying collection: ${playersRef.path}`)
    const querySnapshot = await playersRef.get()
    console.log(`[getLatestPlayersServer] Found ${querySnapshot.docs.length} documents.`)
    const players: Player[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return convertToSerializable({
        id: doc.id, // Ensure ID is explicitly added
        leagueId: leagueId,
        ...data,
      }) as Player
    })
    console.log(`[getLatestPlayersServer] Returning ${players.length} players. Sample:`, players.slice(0, 1))
    return players
  } catch (error) {
    console.error("Error fetching latest players (server):", error)
    throw new Error("Failed to fetch latest players.")
  }
}

export async function getLatestTeamsServer(leagueId: string): Promise<Team[]> {
  try {
    const teamsRef = db.collection("league_data").doc(leagueId).collection("MADDEN_TEAM")
    console.log(`[getLatestTeamsServer] Querying collection: ${teamsRef.path}`)
    const querySnapshot = await teamsRef.get()
    console.log(`[getLatestTeamsServer] Found ${querySnapshot.docs.length} documents.`)
    const teams: Team[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return convertToSerializable({
        id: doc.id,
        leagueId: leagueId,
        ...data,
      }) as Team
    })
    console.log(`[getLatestTeamsServer] Returning ${teams.length} teams. Sample:`, teams.slice(0, 1))
    return teams
  } catch (error) {
    console.error("Error fetching latest teams (server):", error)
    throw new Error("Failed to fetch latest teams.")
  }
}

export async function getLatestStandingsServer(leagueId: string): Promise<Standing[]> {
  try {
    const standingsRef = db.collection("league_data").doc(leagueId).collection("MADDEN_STANDING")
    console.log(`[getLatestStandingsServer] Querying collection: ${standingsRef.path}`)
    const querySnapshot = await standingsRef.get()
    console.log(`[getLatestStandingsServer] Found ${querySnapshot.docs.length} documents.`)
    const standings: Standing[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return convertToSerializable({
        id: doc.id,
        leagueId: leagueId,
        ...data,
      }) as Standing
    })
    console.log(`[getLatestStandingsServer] Returning ${standings.length} standings. Sample:`, standings.slice(0, 1))
    return standings
  } catch (error) {
    console.error("Error fetching latest standings (server):", error)
    throw new Error("Failed to fetch latest standings.")
  }
}

export async function getPlayerStatsServer(leagueId: string, rosterId: number): Promise<PlayerStats> {
  const playerStats: PlayerStats = {}
  const statTypes = Object.values(PlayerStatType)

  try {
    for (const statType of statTypes) {
      const statsRef = db.collection("league_data").doc(leagueId).collection(statType)
      console.log(`[getPlayerStatsServer] Querying ${statType} for rosterId ${rosterId} in ${statsRef.path}`)
      const querySnapshot = await statsRef.where("rosterId", "==", rosterId).get()
      console.log(`[getPlayerStatsServer] Found ${querySnapshot.docs.length} documents for ${statType}.`)
      const stats: PlayerStatEntry[] = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return convertToSerializable({
          id: doc.id,
          leagueId: leagueId,
          ...data,
        }) as PlayerStatEntry
      })
      if (stats.length > 0) {
        playerStats[statType] = stats
      }
    }
    console.log(`[getPlayerStatsServer] Returning player stats for ${rosterId}.`)
    return playerStats
  } catch (error) {
    console.error(`Error fetching stats for player ${rosterId} (server):`, error)
    throw new Error(`Failed to fetch stats for player ${rosterId}.`)
  }
}

export async function getLeagueSettingsServer(guildId: string): Promise<LeagueSettings | null> {
  try {
    const settingsDocRef = db.collection("league_settings").doc(guildId)
    console.log(`[getLeagueSettingsServer] Querying document: ${settingsDocRef.path}`)
    const settingsDocSnap = await settingsDocRef.get()

    if (settingsDocSnap.exists) {
      const settings = convertToSerializable(settingsDocSnap.data()) as LeagueSettings
      console.log(
        `[getLeagueSettingsServer] Found settings for guild ${guildId}. Sample:`,
        settings?.commands?.teams?.assignments
          ? Object.keys(settings.commands.teams.assignments).length
          : "N/A assignments",
      )
      return settings
    } else {
      console.log(`[getLeagueSettingsServer] No settings found for guild ${guildId}.`)
      return null
    }
  } catch (error) {
    console.error(`Error fetching league settings for guild ${guildId} (server):`, error)
    throw new Error(`Failed to fetch league settings for guild ${guildId}.`)
  }
}

// Generic stat fetchers for leaderboards (server-side)
export async function getStatsCollectionServer(
  leagueId: string,
  collectionName: PlayerStatType,
): Promise<PlayerStatEntry[]> {
  try {
    const statsRef = db.collection("league_data").doc(leagueId).collection(collectionName)
    console.log(`[getStatsCollectionServer] Querying collection: ${statsRef.path}`)
    const querySnapshot = await statsRef.get()
    console.log(`[getStatsCollectionServer] Found ${querySnapshot.docs.length} documents for ${collectionName}.`)
    const stats = querySnapshot.docs.map(
      (doc) =>
        convertToSerializable({
          id: doc.id,
          leagueId: leagueId,
          ...doc.data(),
        }) as PlayerStatEntry,
    )
    console.log(
      `[getStatsCollectionServer] Returning ${stats.length} stats for ${collectionName}. Sample:`,
      stats.slice(0, 1),
    )
    return stats
  } catch (error) {
    console.error(`Error fetching ${collectionName} stats (server):`, error)
    throw new Error(`Failed to fetch ${collectionName} stats.`)
  }
}

export async function getWeekScheduleServer(
  leagueId: string,
  weekIndex: number,
  seasonIndex: number,
): Promise<MaddenGame[]> {
  try {
    const scheduleRef = db.collection("league_data").doc(leagueId).collection("MADDEN_SCHEDULE")
    console.log(
      `[getWeekScheduleServer] Querying schedule for week ${weekIndex}, season ${seasonIndex} in ${scheduleRef.path}`,
    )
    const querySnapshot = await scheduleRef
      .where("weekIndex", "==", weekIndex)
      .where("seasonIndex", "==", seasonIndex)
      .get()

    console.log(
      `[getWeekScheduleServer] Found ${querySnapshot.docs.length} documents for week ${weekIndex}, season ${seasonIndex}.`,
    )
    const schedule: MaddenGame[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return convertToSerializable({
        id: doc.id,
        leagueId: leagueId,
        ...data,
      }) as MaddenGame
    })
    console.log(`[getWeekScheduleServer] Returning ${schedule.length} games. Sample:`, schedule.slice(0, 1))
    return schedule
  } catch (error) {
    console.error(`Error fetching schedule for week ${weekIndex}, season ${seasonIndex} (server):`, error)
    throw new Error(`Failed to fetch schedule for week ${weekIndex}, season ${seasonIndex}.`)
  }
}

export async function getTeamStatsServer(leagueId: string): Promise<TeamStats[]> {
  try {
    const teamStatsRef = db.collection("league_data").doc(leagueId).collection("MADDEN_TEAM_STAT")
    console.log(`[getTeamStatsServer] Querying collection: ${teamStatsRef.path}`)
    const querySnapshot = await teamStatsRef.get()
    console.log(`[getTeamStatsServer] Found ${querySnapshot.docs.length} documents.`)
    const teamStats: TeamStats[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return convertToSerializable({
        id: doc.id,
        leagueId: leagueId,
        ...data,
      }) as TeamStats // Cast to TeamStats, not Team
    })
    console.log(`[getTeamStatsServer] Returning ${teamStats.length} team stats. Sample:`, teamStats.slice(0, 1))
    return teamStats
  } catch (error) {
    console.error("Error fetching team stats (server):", error)
    throw new Error("Failed to fetch team stats.")
  }
}
