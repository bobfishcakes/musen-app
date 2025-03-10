import { Game } from '../constants/Interfaces';

export const teamColors: { [key: string]: string } = {
  "Arizona Cardinals": "#DDA6A6", // 60% tinted red
  "Atlanta Falcons": "#DDA6A6", // 60% tinted red
  "Baltimore Ravens": "#ADA6CC", // 60% tinted purple
  "Buffalo Bills": "#99B3E6", // 60% tinted royal blue
  "Carolina Panthers": "#99B3E6", // 60% tinted blue
  "Chicago Bears": "#99A6B3", // 60% tinted navy
  "Cincinnati Bengals": "#FDC0A6", // 60% tinted orange
  "Cleveland Browns": "#B39986", // 60% tinted brown
  "Dallas Cowboys": "#99B3E6", // 60% tinted royal blue
  "Denver Broncos": "#FFA666", // 60% tinted orange
  "Detroit Lions": "#99CCE6", // 60% tinted blue
  "Green Bay Packers": "#99CC99", // 60% tinted green
  "Houston Texans": "#DDA6A6", // 60% tinted red
  "Indianapolis Colts": "#99B3E6", // 60% tinted royal blue
  "Jacksonville Jaguars": "#99C6CC", // 60% tinted teal
  "Kansas City Chiefs": "#DDA6A6", // 60% tinted red
  "Las Vegas Raiders": "#999999", // 60% tinted black
  "Los Angeles Chargers": "#99B3E6", // 60% tinted powder blue
  "Los Angeles Rams": "#99B3E6", // 60% tinted royal blue
  "Miami Dolphins": "#99E6CC", // 60% tinted aqua
  "Minnesota Vikings": "#ADA6CC", // 60% tinted purple
  "New England Patriots": "#99A6B3", // 60% tinted navy
  "New Orleans Saints": "#B3B3B3", // 60% tinted gold
  "New York Giants": "#9DA6CC", // 60% tinted blue
  "New York Jets": "#99CC99", // 60% tinted green
  "Philadelphia Eagles": "#99CC99", // 60% tinted green
  "Pittsburgh Steelers": "#FFE666", // 60% tinted gold
  "San Francisco 49ers": "#DDA6A6", // 60% tinted red
  "Seattle Seahawks": "#99CC99", // 60% tinted action green
  "Tampa Bay Buccaneers": "#DDA6A6", // 60% tinted red
  "Tennessee Titans": "#9EA6B3", // 60% tinted navy
  "Washington Commanders": "#B39986", // 60% tinted burgundy
  "Los Angeles Lakers": "#B491E4", // 60% tinted purple 
  "Dallas Mavericks": "#3B90D9", // 60% tinted blue
};

// Helper function to get team color
export const getTeamColor = (teamName: string): string => {
  return teamColors[teamName] || '#000000';
};

export const enhanceGameWithColors = (game: Game): Game => {
  return {
    ...game,
    teams: {
      home: {
        ...game.teams.home,
        primaryColor: getTeamColor(game.teams.home.name)
      },
      away: {
        ...game.teams.away,
        primaryColor: getTeamColor(game.teams.away.name)
      }
    }
  };
};

export const mockNcaaFootballGames: Game[] = [
  {
    id: "195",
    teams: {
      home: {
        name: "Texas",
        id: "195",
        logo: 'https://media.api-sports.io/american-football/teams/195.png'
      },
      away: {
        name: "Texas A&M",
        id: "111",
        logo: 'https://media.api-sports.io/american-football/teams/111.png'
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
        logo: 'https://media.api-sports.io/american-football/teams/1.png'
      },
      away: {
        name: "Baltimore Ravens",
        id: "5",
        logo: 'https://media.api-sports.io/american-football/teams/5.png'
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
        logo: 'https://media.api-sports.io/american-football/teams/2.png'
      },
      away: {
        name: "New England Patriots",
        id: "3",
        logo: 'https://media.api-sports.io/american-football/teams/3.png'
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
        logo: 'https://media.api-sports.io/american-football/teams/4.png'
      },
      away: {
        name: "Tennessee Titans",
        id: "6",
        logo: 'https://media.api-sports.io/american-football/teams/6.png'
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
        logo: 'https://media.api-sports.io/american-football/teams/7.png'
      },
      away: {
        name: "Atlanta Falcons",
        id: "8",
        logo: 'https://media.api-sports.io/american-football/teams/8.png'
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
        logo: 'https://media.api-sports.io/american-football/teams/9.png'
      },
      away: {
        name: "Cincinnati Bengals",
        id: "10",
        logo: 'https://media.api-sports.io/american-football/teams/10.png'
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
].map(enhanceGameWithColors);

export const mockNbaGames: Game[] = [
  {
    id: "0",
    teams: {
      home: {
        name: "Los Angeles Lakers",
        id: "145",
        logo: 'https://media.api-sports.io/basketball/teams/145.png'
      },
      away: {
        name: "Dallas Mavericks",
        id: "138",
        logo: 'https://media.api-sports.io/basketball/teams/138.png'
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
      short: "Q3",
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
        id: "134",
        logo: 'https://media.api-sports.io/basketball/teams/134.png'
      },
      away: {
        name: "Charlotte Hornets",
        id: "135",
        logo: 'https://media.api-sports.io/basketball/teams/135.png'
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
        id: "136",
        logo: 'https://media.api-sports.io/basketball/teams/136.png'
      },
      away: {
        name: "Cleveland Cavaliers",
        id: "137",
        logo: 'https://media.api-sports.io/basketball/teams/137.png'
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
        id: "196",
        logo: 'https://media.api-sports.io/basketball/teams/196.png'
      },
      away: {
        name: "Wright State",
        id: "206",
        logo: 'https://media.api-sports.io/basketball/teams/206.png'
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
        id: "222",
        logo: 'https://media.api-sports.io/basketball/teams/222.png'
      },
      away: {
        name: "Kent State",
        id: "235",
        logo: 'https://media.api-sports.io/basketball/teams/235.png'
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