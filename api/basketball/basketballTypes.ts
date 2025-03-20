import { Game, Teams, League, GameDate, Scores } from '../../constants/Interfaces';

// NBA Team Colors (60% tinted) with Primary, Secondary, and Tertiary Variants
export const nbaTeamColors: { 
  [key: string]: { primary: string; secondary: string; tertiary: string } 
} = {
  "Atlanta Hawks": { primary: "#DDA6A6", secondary: "#B39986", tertiary: "#999999" }, // Red, Wine, Black
  "Boston Celtics": { primary: "#99CC99", secondary: "#B3A6E6", tertiary: "#999999" }, // Green, Purple, Black
  "Brooklyn Nets": { primary: "#999999", secondary: "#B3B3B3", tertiary: "#CCCCCC" }, // Black, Gray, Light Gray
  "Charlotte Hornets": { primary: "#B3A6E6", secondary: "#99CCE6", tertiary: "#999999" }, // Purple, Teal, Black
  "Chicago Bulls": { primary: "#DDA6A6", secondary: "#999999", tertiary: "#B39986" }, // Red, Black, Wine
  "Cleveland Cavaliers": { primary: "#B39986", secondary: "#DDA6A6", tertiary: "#999999" }, // Wine, Red, Black
  "Dallas Mavericks": { primary: "#99B3E6", secondary: "#999999", tertiary: "#99CCE6" }, // Blue, Black, Teal
  "Denver Nuggets": { primary: "#99B3E6", secondary: "#FFB366", tertiary: "#FFE666" }, // Blue, Gold, Yellow
  "Detroit Pistons": { primary: "#DDA6A6", secondary: "#99B3E6", tertiary: "#999999" }, // Red, Blue, Black
  "Golden State Warriors": { primary: "#FFE666", secondary: "#99B3E6", tertiary: "#999999" }, // Gold, Blue, Black
  "Houston Rockets": { primary: "#DDA6A6", secondary: "#999999", tertiary: "#B3A6E6" }, // Red, Black, Purple
  "Indiana Pacers": { primary: "#FFB366", secondary: "#99B3E6", tertiary: "#999999" }, // Gold, Blue, Black
  "Los Angeles Clippers": { primary: "#DDA6A6", secondary: "#99B3E6", tertiary: "#999999" }, // Red, Blue, Black
  "Los Angeles Lakers": { primary: "#ADA6CC", secondary: "#FFE666", tertiary: "#999999" }, // Purple, Gold, Black
  "Memphis Grizzlies": { primary: "#99B3E6", secondary: "#999999", tertiary: "#99CCE6" }, // Blue, Black, Teal
  "Miami Heat": { primary: "#DDA6A6", secondary: "#999999", tertiary: "#B39986" }, // Red, Black, Wine
  "Milwaukee Bucks": { primary: "#99CC99", secondary: "#999999", tertiary: "#B3A6E6" }, // Green, Black, Purple
  "Minnesota Timberwolves": { primary: "#99B3E6", secondary: "#99CC99", tertiary: "#999999" }, // Blue, Green, Black
  "New Orleans Pelicans": { primary: "#99B3E6", secondary: "#FFB366", tertiary: "#999999" }, // Blue, Gold, Black
  "New York Knicks": { primary: "#FFA666", secondary: "#99B3E6", tertiary: "#999999" }, // Orange, Blue, Black
  "Oklahoma City Thunder": { primary: "#99B3E6", secondary: "#FFA666", tertiary: "#999999" }, // Blue, Orange, Black
  "Orlando Magic": { primary: "#99B3E6", secondary: "#999999", tertiary: "#99CCE6" }, // Blue, Black, Teal
  "Philadelphia 76ers": { primary: "#99B3E6", secondary: "#DDA6A6", tertiary: "#999999" }, // Blue, Red, Black
  "Phoenix Suns": { primary: "#ADA6CC", secondary: "#FFA666", tertiary: "#999999" }, // Purple, Orange, Black
  "Portland Trail Blazers": { primary: "#DDA6A6", secondary: "#999999", tertiary: "#ADA6CC" }, // Red, Black, Purple
  "Sacramento Kings": { primary: "#ADA6CC", secondary: "#999999", tertiary: "#DDA6A6" }, // Purple, Black, Red
  "San Antonio Spurs": { primary: "#999999", secondary: "#B3B3B3", tertiary: "#CCCCCC" }, // Black, Gray, Light Gray
  "Toronto Raptors": { primary: "#DDA6A6", secondary: "#999999", tertiary: "#B39986" }, // Red, Black, Wine
  "Utah Jazz": { primary: "#99B3E6", secondary: "#FFB366", tertiary: "#999999" }, // Blue, Gold, Black
  "Washington Wizards": { primary: "#99B3E6", secondary: "#DDA6A6", tertiary: "#999999" } // Blue, Red, Black
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

  const homeColorOptions = [homeColors.primary, homeColors.secondary, homeColors.tertiary];
  const awayColorOptions = [awayColors.primary, awayColors.secondary, awayColors.tertiary];
  
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