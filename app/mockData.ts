import { Game } from '../constants/Interfaces';

// Add this to mockData.ts
export const mockNFLStats: { [key: string]: any } = {
  "1": { // Raiders vs Ravens game
    home: {
      leaders: {
        points: [{
          full_name: "Josh Jacobs",
          statistics: { points: 14 }
        }],
        rebounds: [{ // Using rushing yards for "rebounds"
          full_name: "Josh Jacobs",
          statistics: { rebounds: 89 }
        }],
        assists: [{ // Using passing yards for "assists"
          full_name: "Jimmy Garoppolo",
          statistics: { assists: 243 }
        }]
      }
    },
    away: {
      leaders: {
        points: [{
          full_name: "Lamar Jackson",
          statistics: { points: 21 }
        }],
        rebounds: [{
          full_name: "Justice Hill",
          statistics: { rebounds: 67 }
        }],
        assists: [{
          full_name: "Lamar Jackson",
          statistics: { assists: 287 }
        }]
      }
    }
  },
  // Add more games as needed...
};

export const teamColors: { [key: string]: string } = {
  "Arizona Cardinals": "#D88080", // moderately bold red
  "Atlanta Falcons": "#D88080",
  "Baltimore Ravens": "#A080D6", // moderately bold purple
  "Buffalo Bills": "#80A6E6", // moderately bold royal blue
  "Carolina Panthers": "#80A6E6", // moderately bold blue
  "Chicago Bears": "#808C99", // moderately bold navy
  "Cincinnati Bengals": "#FFAA80", // moderately bold orange
  "Cleveland Browns": "#B38666", // moderately bold brown
  "Dallas Cowboys": "#80A6E6", // moderately bold royal blue
  "Denver Broncos": "#FFA64D", // moderately bold orange
  "Detroit Lions": "#80D0E6", // moderately bold blue
  "Green Bay Packers": "#80CC80", // moderately bold green
  "Houston Texans": "#D88080", // moderately bold red
  "Indianapolis Colts": "#80A6E6", // moderately bold royal blue
  "Jacksonville Jaguars": "#80C6CC", // moderately bold teal
  "Kansas City Chiefs": "#D88080", // moderately bold red
  "Las Vegas Raiders": "#808080", // moderately bold black/gray
  "Los Angeles Chargers": "#80A6E6", // moderately bold powder blue
  "Los Angeles Rams": "#80A6E6", // moderately bold royal blue
  "Miami Dolphins": "#80E6CC", // moderately bold aqua
  "Minnesota Vikings": "#A080D6", // moderately bold purple
  "New England Patriots": "#808C99", // moderately bold navy
  "New Orleans Saints": "#B3A673", // moderately bold gold
  "New York Giants": "#8596D6", // moderately bold blue
  "New York Jets": "#80CC80", // moderately bold green
  "Philadelphia Eagles": "#80CC80",
  "Pittsburgh Steelers": "#FFE066", // moderately bold gold
  "San Francisco 49ers": "#D88080", // moderately bold red
  "Seattle Seahawks": "#80CC80", // moderately bold action green
  "Tampa Bay Buccaneers": "#D88080", // moderately bold red
  "Tennessee Titans": "#8A93A6", // moderately bold navy
  "Washington Commanders": "#B37F66", // moderately bold burgundy
  "Los Angeles Lakers": "#A67FE7", // moderately bold purple
  "Dallas Mavericks": "#357FCF", // moderately bold blue
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
    },
    radarGameId: ''
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
    },
    radarGameId: ''
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
    },
    radarGameId: ''
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
    },
    radarGameId: ''
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
    },
    radarGameId: ''
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
    },
    radarGameId: ''
  }
];