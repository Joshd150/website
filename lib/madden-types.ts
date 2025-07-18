export const MADDEN_SEASON = 2024

export function getMessageForWeek(week: number) {
  if (week < 1 || week > 23 || week === 22) {
    throw new Error(
      "Invalid week number. Valid weeks are week 1-18 and for playoffs: Wildcard = 19, Divisional = 20, Conference Championship = 21, Super Bowl = 23",
    )
  }
  if (week <= 18) {
    return `Week ${week}`
  } else if (week === 19) {
    return "Wildcard Round"
  } else if (week === 20) {
    return "Divisional Round"
  } else if (week === 21) {
    return "Conference Championship Round"
  } else if (week === 23) {
    return "Super Bowl"
  }
  throw new Error("Unknown week " + week)
}

export enum PlayerStatType {
  PASSING = "MADDEN_PASSING_STAT",
  RUSHING = "MADDEN_RUSHING_STAT",
  RECEIVING = "MADDEN_RECEIVING_STAT",
  DEFENSE = "MADDEN_DEFENSIVE_STAT",
  KICKING = "MADDEN_KICKING_STAT",
  PUNTING = "MADDEN_PUNTING_STAT",
}

export enum DevTrait {
  NORMAL = 0,
  STAR = 1,
  SUPERSTAR = 2,
  XFACTOR = 3,
}

export enum QBStyleTrait {
  BALANCED = 0,
  POCKET = 1,
  SCRAMBLING = 2,
}

export enum SensePressureTrait {
  IDEAL = 0,
  AVERAGE = 1,
  PARANOID = 2,
  TRIGGER_HAPPY = 3,
  OBLIVIOUS = 4,
}

export enum PenaltyTrait {
  DISCIPLINED = 0,
  NORMAL = 1,
  UNDISCIPLINED = 2,
}

export enum YesNoTrait {
  YES = 0,
  NO = 1,
}

export enum PlayBallTrait {
  AGGRESSIVE = 0,
  BALANCED = 1,
  CONSERVATIVE = 2,
}

export enum CoverBallTrait {
  ALWAYS = 0,
  ON_BIG_HITS = 1,
  ON_MEDIUM_HITS = 2,
  FOR_ALL_HITS = 3,
  NEVER = 4,
}

export enum LBStyleTrait {
  BALANCED = 0,
  COVER_LB = 1,
  PASS_RUSH = 2,
}

export enum GameResult {
  NOT_PLAYED = 0,
  AWAY_WIN = 1,
  HOME_WIN = 2,
  TIE = 3,
}

export type Player = {
  rosterId: number
  firstName: string
  lastName: string
  position: string
  overall: number
  teamId: number
  teamAbbr: string
  devTrait: DevTrait
  playerBestOvr: number
  age: number
  yearsPro: number
  height: number
  weight: number
  contractYearsLeft: number
  contractLength: number
  contractSalary: number
  capHit: number
  contractBonus: number
  capReleaseNetSavings: number
  capReleasePenalty: number
  isFreeAgent: boolean
  speedRating: number
  accelRating: number
  agilityRating: number
  awareRating: number
  injuryRating: number
  throwPowerRating: number
  throwAccRating: number
  throwAccDeepRating: number
  throwAccMidRating: number
  throwAccShortRating: number
  throwOnRunRating: number
  playActionRating: number
  throwUnderPressureRating: number
  breakSackRating: number
  impactBlockRating: number
  leadBlockRating: number
  runBlockRating: number
  strengthRating: number
  passBlockRating: number
  truckRating: number
  stiffArmRating: number
  carryRating: number
  breakTackleRating: number
  bCVRating: number
  jukeMoveRating: number
  spinMoveRating: number
  changeOfDirectionRating: number
  cITRating: number
  routeRunShortRating: number
  routeRunMedRating: number
  routeRunDeepRating: number
  specCatchRating: number
  releaseRating: number
  jumpRating: number
  powerMovesRating: number
  finesseMovesRating: number
  tackleRating: number
  blockShedRating: number
  playRecRating: number
  hitPowerRating: number
  pursuitRating: number
  zoneCoverRating: number
  manCoverRating: number
  pressRating: number
  kickPowerRating: number
  kickAccRating: number
  kickRetRating: number
  runBlockPowerRating: number
  runBlockFinesseRating: number
  passBlockPowerRating: number
  passBlockFinesseRating: number
  qBStyleTrait: QBStyleTrait
  sensePressureTrait: SensePressureTrait
  penaltyTrait: PenaltyTrait
  throwAwayTrait: YesNoTrait
  tightSpiralTrait: YesNoTrait
  yACCatchTrait: YesNoTrait
  posCatchTrait: YesNoTrait
  hPCatchTrait: YesNoTrait
  fightForYardsTrait: YesNoTrait
  feetInBoundsTrait: YesNoTrait
  dropOpenPassTrait: YesNoTrait
  dLSwimTrait: YesNoTrait
  dLSpinTrait: YesNoTrait
  dLBullRushTrait: YesNoTrait
  stripBallTrait: YesNoTrait
  highMotorTrait: YesNoTrait
  bigHitTrait: YesNoTrait
  lBStyleTrait: LBStyleTrait
  playBallTrait: PlayBallTrait
  coverBallTrait: CoverBallTrait
  predictTrait: YesNoTrait
  clutchTrait: YesNoTrait
  signatureSlotList: {
    isEmpty: boolean
    signatureAbility?: {
      signatureId: number
      signatureTitle: string
      signatureDescription: string
    }
  }[]
  catchRating: number // Added missing catchRating
}

export type Team = {
  teamId: number
  teamName: string
  teamAbbr: string
  wins: number
  losses: number
  ties: number
  divisionRank: number
  conferenceRank: number
  ownerName: string
  cityName: string
  nickName: string
  displayName: string
  divName: string
  confName: string
}

export type Standing = {
  teamId: number
  teamName: string
  teamAbbr: string
  wins: number
  losses: number
  ties: number
  divisionRank: number
  conferenceRank: number
  rank: number
  netPts: number
  ptsFor: number
  ptsForRank: number
  ptsAgainst: number
  ptsAgainstRank: number
  tODiff: number
  offTotalYds: number
  offTotalYdsRank: number
  offPassYds: number
  offPassYdsRank: number
  offRushYds: number
  offRushYdsRank: number
  defTotalYds: number
  defTotalYdsRank: number
  defPassYds: number
  defPassYdsRank: number
  defRushYds: number
  defRushYdsRank: number
  conferenceName: string
  divRecord?: string // Added missing field
  confRecord?: string // Added missing field
  streak?: string // Added missing field
}

export type PlayerStatEntry = {
  rosterId: number
  scheduleId: number
  weekIndex: number
  seasonIndex: number
  // Common stats
  gamesPlayed?: number
  // Passing stats
  passComp?: number
  passAtt?: number
  passYds?: number
  passTDs?: number
  passInts?: number
  passerRating?: number
  passSacks?: number
  // Rushing stats
  rushAtt?: number
  rushYds?: number
  rushTDs?: number
  rushFum?: number
  rushYdsPerAtt?: number
  // Receiving stats
  recCatches?: number
  recYds?: number
  recTDs?: number
  recDrops?: number
  // Defensive stats
  defTotalTackles?: number
  defSacks?: number
  defInts?: number
  defFumRec?: number
  defForcedFum?: number
  defTDs?: number
  defDeflections?: number
  // Kicking stats
  fGMade?: number
  fGAtt?: number
  fG50PlusMade?: number
  fG50PlusAtt?: number
  fGLongest?: number
  xPMade?: number
  xPAtt?: number
  kickPts?: number
  // Punting stats
  puntAtt?: number
  puntYds?: number
  puntYdsPerAtt?: number
  puntNetYdsPerAtt?: number
  puntsIn20?: number
  puntTBs?: number
  puntsBlocked?: number
}

export type PlayerStats = {
  [PlayerStatType.DEFENSE]?: PlayerStatEntry[]
  [PlayerStatType.KICKING]?: PlayerStatEntry[]
  [PlayerStatType.PUNTING]?: PlayerStatEntry[]
  [PlayerStatType.RECEIVING]?: PlayerStatEntry[]
  [PlayerStatType.RUSHING]?: PlayerStatEntry[]
  [PlayerStatType.PASSING]?: PlayerStatEntry[]
}

export type MaddenGame = {
  scheduleId: number
  weekIndex: number
  seasonIndex: number
  homeTeamId: number
  awayTeamId: number
  homeScore: number
  awayScore: number
  gameStatus: GameResult
  stageIndex: number
}

export type TeamStats = {
  teamId: number
  teamName: string
  teamAbbr: string
  pointsScored: number
  pointsAllowed: number
  totalYards: number
  passingYards: number
  rushingYards: number
  turnoversForced: number
  turnoversCommitted: number
}

export type LeagueSettings = {
  commands: {
    madden_league?: {
      league_id: string
    }
    teams?: {
      channel: { id: string; id_type: string }
      messageId: { id: string; id_type: string }
      useRoleUpdates: boolean
      assignments: {
        [teamId: string]: {
          discord_user?: { id: string; id_type: string }
          discord_role?: { id: string; id_type: string }
        }
      }
    }
    game_channel?: {
      weekly_states?: {
        [weekKey: string]: {
          scoreboard?: { id: string; id_type: string }
          channel_states: {
            [channelId: string]: {
              scheduleId: number
              message?: { id: string; id_type: string }
            }
          }
        }
      }
    }
    broadcast?: {
      channel: { id: string; id_type: string }
      role?: { id: string; id_type: string }
    }
  }
}
