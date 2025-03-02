export interface Team {
  name: string
  id: string
  logo: string
}

export interface Teams {
  home: Team
  away: Team
}

export interface League {
  name: string
  alias?: string
}

export interface GameDate {
  date: string
  time: string
}

export interface Game {
  id: string
  teams: Teams
  league: League
  date?: string
  game?: {
    date: GameDate
  }
  status: {
    long: string
    short: string
  }
  scores?: Scores
  streamers?: number
  listeners?: number
}

export interface Scores {
  home: Score
  away: Score
}

export interface Score {
  total: number
  quarter_1?: number
  quarter_2?: number
  quarter_3?: number
  quarter_4?: number
  overtime?: number
}
