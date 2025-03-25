import { Game, Teams, League } from '../../constants/Interfaces';

// Soccer Team Colors with Primary and Secondary Variants
export const soccerTeamColors: {
    [key: string]: { primary: string; secondary: string };
  } = {
    // --- MLS ---
    "Atlanta United": { primary: "#A50012", secondary: "#000000" },
    "Austin FC": { primary: "#25B33F", secondary: "#000000" },
    "Chicago Fire": { primary: "#8A2432", secondary: "#1D2D5C" },
    "FC Cincinnati": { primary: "#F6881F", secondary: "#003087" },
    "Colorado Rapids": { primary: "#960A2C", secondary: "#0D223F" },
    "Columbus Crew": { primary: "#FFD100", secondary: "#231F20" },
    "D.C. United": { primary: "#E51937", secondary: "#231F20" },
    "FC Dallas": { primary: "#C0043C", secondary: "#00265E" },
    "Houston Dynamo": { primary: "#FF6B00", secondary: "#101820" },
    "Inter Miami": { primary: "#F7B5CD", secondary: "#000000" },
    "LA Galaxy": { primary: "#00245D", secondary: "#FFD200" },
    "Los Angeles FC": { primary: "#000000", secondary: "#C39E6D" },
    "Minnesota United": { primary: "#8CD2E9", secondary: "#231F20" },
    "CF Montréal": { primary: "#000000", secondary: "#A5ACAF" },
    "Nashville SC": { primary: "#FFB915", secondary: "#1A1F47" },
    "New England Revolution": { primary: "#0A2240", secondary: "#E51937" },
    "New York City FC": { primary: "#6CACE4", secondary: "#1C2C5B" },
    "New York Red Bulls": { primary: "#DA291C", secondary: "#002F65" },
    "Orlando City": { primary: "#633492", secondary: "#FDE192" },
    "Philadelphia Union": { primary: "#002D55", secondary: "#B18500" },
    "Portland Timbers": { primary: "#004812", secondary: "#B1AB91" },
    "Real Salt Lake": { primary: "#B30838", secondary: "#013A81" },
    "San Jose Earthquakes": { primary: "#0051BA", secondary: "#000000" },
    "Seattle Sounders": { primary: "#5D9732", secondary: "#236192" },
    "Sporting Kansas City": { primary: "#91B0D5", secondary: "#002A5C" },
    "Toronto FC": { primary: "#AC1E2D", secondary: "#565A5C" },
    "Vancouver Whitecaps": { primary: "#04265C", secondary: "#94C1E0" },
  
    // --- EPL (Top Clubs) ---
    "Arsenal": { primary: "#EF0107", secondary: "#9C824A" },
    "Chelsea": { primary: "#034694", secondary: "#DBA111" },
    "Liverpool": { primary: "#C8102E", secondary: "#00B2A9" },
    "Manchester City": { primary: "#6CABDD", secondary: "#1C2C5B" },
    "Manchester United": { primary: "#DA291C", secondary: "#FBE122" },
    "Tottenham Hotspur": { primary: "#132257", secondary: "#FFFFFF" },
    "Newcastle United": { primary: "#241F20", secondary: "#FFFFFF" },
    "Aston Villa": { primary: "#95BFE5", secondary: "#670E36" },
    "Brighton": { primary: "#0057B8", secondary: "#FFD100" },
    "West Ham": { primary: "#7A263A", secondary: "#1BB1E7" },
  
    // --- National Teams ---
    "United States": { primary: "#002664", secondary: "#BF0A30" },
    "Mexico": { primary: "#006847", secondary: "#CE1126" },
    "Canada": { primary: "#FF0000", secondary: "#FFFFFF" },
    "England": { primary: "#FFFFFF", secondary: "#C8102E" },
    "France": { primary: "#0055A4", secondary: "#EF4135" },
    "Germany": { primary: "#000000", secondary: "#FFCE00" },
    "Brazil": { primary: "#FFDF00", secondary: "#009C3B" },
    "Argentina": { primary: "#75AADB", secondary: "#FFFFFF" },
    "Spain": { primary: "#AA151B", secondary: "#F1BF00" },
    "Italy": { primary: "#007FFF", secondary: "#FFFFFF" },
    "Japan": { primary: "#BC002D", secondary: "#FFFFFF" },
    "South Korea": { primary: "#C60C30", secondary: "#003478" },
    "Portugal": { primary: "#006600", secondary: "#FF0000" },
    "Netherlands": { primary: "#FF6103", secondary: "#00205B" },
    "Uruguay": { primary: "#87CEEB", secondary: "#FFD700" },
    "Croatia": { primary: "#FFFFFF", secondary: "#FF0000" },
    "Senegal": { primary: "#00853F", secondary: "#FDEF42" },
    "Qatar": { primary: "#8A1538", secondary: "#FFFFFF" }
  
    // Add more countries or clubs as needed
  };
  

const calculateContrast = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;
    
    const rL = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gL = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bL = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const getBestContrastingColors = (homeTeam: string, awayTeam: string): [string, string] => {
  const homeColors = soccerTeamColors[homeTeam] || soccerTeamColors.default;
  const awayColors = soccerTeamColors[awayTeam] || soccerTeamColors.default;
  
  const homeColorOptions = [homeColors.primary, homeColors.secondary];
  const awayColorOptions = [awayColors.primary, awayColors.secondary];
  
  let bestContrast = 0;
  let bestPair: [string, string] = [homeColors.primary, awayColors.primary];

  homeColorOptions.forEach(homeColor => {
    awayColorOptions.forEach(awayColor => {
      const contrast = calculateContrast(homeColor, awayColor);
      if (contrast > bestContrast) {
        bestContrast = contrast;
        bestPair = [homeColor, awayColor];
      }
    });
  });

  return bestPair;
};

export const getSoccerTeamColor = (teamName: string): string => {
  return soccerTeamColors[teamName]?.primary || soccerTeamColors.default.primary;
};

// API Response interface
export interface SoccerApiResponse<T> {
  get: string;
  parameters: Record<string, any>;
  errors: string[];
  results: number;
  response: T[];
}

export interface SoccerLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  season: number;
  round: string;
}

export interface SoccerTeam {
  id: number;
  name: string;
  logo: string;
}

export interface SoccerTeams {
  home: SoccerTeam;
  away: SoccerTeam;
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}

export interface Fixture {
  id: number;
  date: string;
  timezone: string;
  venue: {
    id: number;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };
}

export interface SoccerGame {
  fixture: Fixture;
  league: SoccerLeague;
  teams: SoccerTeams;
  goals: Goals;
  score: Score;
}

export function convertSoccerGame(game: SoccerGame): Game {
  // Get the best contrasting colors for this matchup
  const [homeColor, awayColor] = getBestContrastingColors(
    game.teams.home.name,
    game.teams.away.name
  );

  return {
    id: game.fixture.id.toString(),
    radarGameId: game.fixture.id.toString(),
    teams: {
      home: {
        id: game.teams.home.id.toString(),
        name: game.teams.home.name,
        logo: game.teams.home.logo,
        primaryColor: homeColor
      },
      away: {
        id: game.teams.away.id.toString(),
        name: game.teams.away.name,
        logo: game.teams.away.logo,
        primaryColor: awayColor
      }
    },
    league: {
      name: game.league.name,
      alias: game.league.name,
      logo: game.league.logo
    },
    status: {
      long: game.fixture.status.long,
      short: game.fixture.status.short
    },
    scores: {
      home: {
        total: game.goals.home || 0
      },
      away: {
        total: game.goals.away || 0
      }
    },
    date: game.fixture.date
  };
}