import { Game, Teams, League, GameDate, Scores } from '../../constants/Interfaces';

// NBA Team Colors (60% tinted) with Primary, Secondary, and Tertiary Variants
export const nbaTeamColors: { 
  [key: string]: { primary: string; secondary: string; } 
} = {
  "Atlanta Hawks": { primary: "#F1CFCF", secondary: "#D6C9BF" },
  "Boston Celtics": { primary: "#CCE5CC", secondary: "#DCD3F2" },
  "Brooklyn Nets": { primary: "#CCCCCC", secondary: "#D6D6D6" },
  "Charlotte Hornets": { primary: "#DCD3F2", secondary: "#CCE5F2" },
  "Chicago Bulls": { primary: "#F1CFCF", secondary: "#D6C9BF" },
  "Cleveland Cavaliers": { primary: "#D6C9BF", secondary: "#F1CFCF" },
  "Dallas Mavericks": { primary: "#CCD9F2", secondary: "#CCE5F2" },
  "Denver Nuggets": { primary: "#CCD9F2", secondary: "#FFD9B3" },
  "Detroit Pistons": { primary: "#F1CFCF", secondary: "#CCD9F2" },
  "Golden State Warriors": { primary: "#FFF2B3", secondary: "#CCD9F2" },
  "Houston Rockets": { primary: "#F1CFCF", secondary: "#DCD3F2" },
  "Indiana Pacers": { primary: "#FFD9B3", secondary: "#CCD9F2" },
  "Los Angeles Clippers": { primary: "#F1CFCF", secondary: "#CCD9F2" },
  "Los Angeles Lakers": { primary: "#D6D3E6", secondary: "#FFF2B3" },
  "Memphis Grizzlies": { primary: "#CCD9F2", secondary: "#CCE5F2" },
  "Miami Heat": { primary: "#F1CFCF", secondary: "#D6C9BF" },
  "Milwaukee Bucks": { primary: "#CCE5CC", secondary: "#DCD3F2" },
  "Minnesota Timberwolves": { primary: "#CCD9F2", secondary: "#CCE5CC" },
  "New Orleans Pelicans": { primary: "#CCD9F2", secondary: "#FFD9B3" },
  "New York Knicks": { primary: "#FFD1B3", secondary: "#CCD9F2" },
  "Oklahoma City Thunder": { primary: "#CCD9F2", secondary: "#FFD1B3" },
  "Orlando Magic": { primary: "#CCD9F2", secondary: "#CCE5F2" },
  "Philadelphia 76ers": { primary: "#CCD9F2", secondary: "#F1CFCF" },
  "Phoenix Suns": { primary: "#D6D3E6", secondary: "#FFD1B3" },
  "Portland Trail Blazers": { primary: "#F1CFCF", secondary: "#D6D3E6" },
  "Sacramento Kings": { primary: "#D6D3E6", secondary: "#F1CFCF" },
  "San Antonio Spurs": { primary: "#CCCCCC", secondary: "#D6D6D6" },
  "Toronto Raptors": { primary: "#F1CFCF", secondary: "#D6C9BF" },
  "Utah Jazz": { primary: "#CCD9F2", secondary: "#FFD9B3" },
  "Washington Wizards": { primary: "#CCD9F2", secondary: "#F1CFCF" }
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

// Helper function to get best contrasting colors for two teams
export const getBestContrastingColors = (homeTeam: string, awayTeam: string): [string, string] => {
  const homeColors = nbaTeamColors[homeTeam];
  const awayColors = nbaTeamColors[awayTeam];
  
  if (!homeColors || !awayColors) {
    return ['#000000', '#FFFFFF'];
  }

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

export const getNBATeamColor = (teamName: string): string => {
  return nbaTeamColors[teamName]?.primary || '#000000';
};


// API Response interface
export interface BasketballApiResponse<T> {
  get: string;
  parameters: Record<string, any>;
  errors: string[];
  results: number;
  response: T[];
}

// League interface with logo
export interface BasketballLeague extends League {
  id: number;
  type: string;
  season: string;
  logo: string;
}

// Team interface with required logo
export interface BasketballTeam {
  id: number;
  name: string;
  logo: string;
}

// Teams container interface
export interface BasketballTeams {
  home: BasketballTeam;
  away: BasketballTeam;
}

// Score interface
export interface BasketballScore {
  quarter_1: number | null;
  quarter_2: number | null;
  quarter_3: number | null;
  quarter_4: number | null;
  over_time: number | null;
  total: number;
}

// Scores container interface
export interface BasketballScores {
  home: BasketballScore;
  away: BasketballScore;
}

// Status interface
export interface BasketballStatus {
  long: string;
  short: string;
  timer?: string;
}

// Main Basketball Game interface
export interface BasketballGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  status: BasketballStatus;
  league: BasketballLeague;
  teams: BasketballTeams;
  scores: BasketballScores;
}

// Helper type to convert BasketballGame to Game interface format
export type ConvertedBasketballGame = Game & {
  league: League & {
    logo: string;
  };
};

export function convertBasketballGame(game: BasketballGame): ConvertedBasketballGame {
  // Get the best contrasting colors for this matchup
  const [homeColor, awayColor] = getBestContrastingColors(
    game.teams.home.name, 
    game.teams.away.name
  );

  return {
    id: game.id.toString(),
    radarGameId: game.id.toString(), // Add this line to include the required radarGameId
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
      alias: game.league.type,
      logo: game.league.logo
    },
    status: {
      long: game.status.long,
      short: game.status.short
    },
    scores: {
      home: {
        total: game.scores.home.total,
        quarter_1: game.scores.home.quarter_1 ?? undefined,
        quarter_2: game.scores.home.quarter_2 ?? undefined,
        quarter_3: game.scores.home.quarter_3 ?? undefined,
        quarter_4: game.scores.home.quarter_4 ?? undefined,
        overtime: game.scores.home.over_time ?? undefined
      },
      away: {
        total: game.scores.away.total,
        quarter_1: game.scores.away.quarter_1 ?? undefined,
        quarter_2: game.scores.away.quarter_2 ?? undefined,
        quarter_3: game.scores.away.quarter_3 ?? undefined,
        quarter_4: game.scores.away.quarter_4 ?? undefined,
        overtime: game.scores.away.over_time ?? undefined
      }
    },
    date: game.date
  };

}