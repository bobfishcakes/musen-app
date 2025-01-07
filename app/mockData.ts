import { Game } from './interfaces';


export const mockNcaaFootballGames: Game[] = [
  {
    id: "195",
    teams: {
      home: {
        name: "Texas",
        id: "195",
      },
      away: {
        name: "Texas A&M",
        id: "111",
      }
    },
    league: {
      name: "NCAA Football",
      alias: "NCAAF"
    },
    date: "2023-10-03",
    game: {
      date: {
        date: "2023-10-03",
        time: "20:00"
      }
    },
    status: {
      short: "HT",
      long: ""
    },
    scores: {
      home: { total: 14 },
      away: { total: 0 }
    }
  },
];

export const mockNflGames: Game[] = [
  {
    id: "1",
    teams: {
      home: {
        name: "Las Vegas Raiders",
        id: "1",
      },
      away: {
        name: "Baltimore Ravens",
        id: "5",
      }
    },
    league: {
      name: "NFL",
      alias: "NFL"
    },
    date: "2023-10-03",
    game: {
      date: {
        date: "2023-10-03",
        time: "13:00"
      }
    },
    status: {
      short: "Q2",
      long: ""
    },
    scores: {
      home: { total: 24 },
      away: { total: 27 }
    }
  },
  {
    id: "2",
    teams: {
      home: {
        name: "Jacksonville Jaguars",
        id: "2",
      },
      away: {
        name: "New England Patriots",
        id: "3",
      }
    },
    league: {
      name: "NFL",
      alias: "NFL"
    },
    date: "2023-10-04",
    game: {
      date: {
        date: "2023-10-04",
        time: "14:00"
      }
    },
    status: {
      short: "Q1",
      long: ""
    },
    scores: {
      home: { total: 17 },
      away: { total: 21 }
    }
  },
  {
    id: "4",
    teams: {
      home: {
        name: "New York Giants",
        id: "4",
      },
      away: {
        name: "Tennessee Titans",
        id: "6",
      }
    },
    league: {
      name: "NFL",
      alias: "NFL"
    },
    date: "2023-10-05",
    game: {
      date: {
        date: "2023-10-05",
        time: "15:00"
      }
    },
    status: {
      short: "Q3",
      long: ""
    },
    scores: {
      home: { total: 14 },
      away: { total: 28 }
    }
  },
  {
    id: "7",
    teams: {
      home: {
        name: "Detroit Lions",
        id: "7",
      },
      away: {
        name: "Atlanta Falcons",
        id: "8",
      }
    },
    league: {
      name: "NFL",
      alias: "NFL"
    },
    date: "2023-10-06",
    game: {
      date: {
        date: "2023-10-06",
        time: "16:00"
      }
    },
    status: {
      short: "Q4",
      long: ""
    },
    scores: {
      home: { total: 31 },
      away: { total: 24 }
    }
  },
  {
    id: "9",
    teams: {
      home: {
        name: "Cleveland Browns",
        id: "9",
      },
      away: {
        name: "Cincinnati Bengals",
        id: "10",
      }
    },
    league: {
      name: "NFL",
      alias: "NFL"
    },
    date: "2023-10-07",
    game: {
      date: {
        date: "2023-10-07",
        time: "17:00"
      }
    },
    status: {
      short: "FT",
      long: ""
    },
    scores: {
      home: { total: 20 },
      away: { total: 23 }
    }
  }
];

export const mockNbaGames: Game[] = [
  {
    id: "132",
    teams: {
      home: {
        name: "Atlanta Hawks",
        id: "132"
      },
      away: {
        name: "Boston Celtics",
        id: "133"
      }
    },
    league: {
      name: "NBA",
      alias: "NBA"
    },
    date: "2023-10-01",
    game: {
      date: {
        date: "2023-10-01",
        time: "19:00"
      }
    },
    status: {
      short: "NS",
      long: ""
    },
    scores: {
      home: { total: 0 },
      away: { total: 0 }
    }
  },
  {
    id: "134",
    teams: {
      home: {
        name: "Brooklyn Nets",
        id: "134"
      },
      away: {
        name: "Charlotte Hornets",
        id: "135"
      }
    },
    league: {
      name: "NBA",
      alias: "NBA"
    },
    date: "2023-10-02",
    game: {
      date: {
        date: "2023-10-02",
        time: "20:00"
      }
    },
    status: {
      short: "NS",
      long: ""
    },
    scores: {
      home: { total: 0 },
      away: { total: 0 }
    }
  },
  {
    id: "136",
    teams: {
      home: {
        name: "Chicago Bulls",
        id: "136"
      },
      away: {
        name: "Cleveland Cavaliers",
        id: "137"
      }
    },
    league: {
      name: "NBA",
      alias: "NBA"
    },
    date: "2023-10-03",
    game: {
      date: {
        date: "2023-10-03",
        time: "21:00"
      }
    },
    status: {
      short: "FT",
      long: ""
    },
    scores: {
      home: { total: 95 },
      away: { total: 99 }
    }
  }
];

export const mockNcaaBasketballGames: Game[] = [
  {
    id: "196",
    teams: {
      home: {
        name: "Norfolk State",
        id: "196"
      },
      away: {
        name: "Wright State",
        id: "206"
      }
    },
    league: {
      name: "NCAA Basketball",
      alias: "NCAAB"
    },
    date: "2023-10-02",
    game: {
      date: {
        date: "2023-10-02",
        time: "19:00"
      }
    },
    status: {
      short: "Q1",
      long: ""
    },
    scores: {
      home: { total: 82 },
      away: { total: 79 }
    }
  },
  {
    id: "222",
    teams: {
      home: {
        name: "Utah Valley State",
        id: "222"
      },
      away: {
        name: "Kent State",
        id: "235"
      }
    },
    league: {
      name: "NCAA Basketball",
      alias: "NCAAB"
    },
    date: "2023-10-03",
    game: {
      date: {
        date: "2023-10-03",
        time: "20:00"
      }
    },
    status: {
      short: "Q1",
      long: ""
    },
    scores: {
      home: { total: 88 },
      away: { total: 85 }
    }
  }
];