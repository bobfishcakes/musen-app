"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNBATeamColor = exports.getBestContrastingColors = exports.nbaTeamColors = void 0;
exports.convertBasketballGame = convertBasketballGame;

exports.nbaTeamColors = {
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
  
const calculateContrast = (color1, color2) => {
    const getLuminance = (hex) => {
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
const getBestContrastingColors = (homeTeam, awayTeam) => {
    const homeColors = exports.nbaTeamColors[homeTeam];
    const awayColors = exports.nbaTeamColors[awayTeam];
    if (!homeColors || !awayColors) {
        return ['#000000', '#FFFFFF'];
    }
    const homeColorOptions = [homeColors.primary, homeColors.secondary];
    const awayColorOptions = [awayColors.primary, awayColors.secondary];
    let bestContrast = 0;
    let bestPair = [homeColors.primary, awayColors.primary];
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
exports.getBestContrastingColors = getBestContrastingColors;
const getNBATeamColor = (teamName) => {
    var _a;
    return ((_a = exports.nbaTeamColors[teamName]) === null || _a === void 0 ? void 0 : _a.primary) || '#000000';
};
exports.getNBATeamColor = getNBATeamColor;
function convertBasketballGame(game) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // Get the best contrasting colors for this matchup
    const [homeColor, awayColor] = (0, exports.getBestContrastingColors)(game.teams.home.name, game.teams.away.name);
    return {
        id: game.id.toString(),
        teams: {
            home: {
                id: game.teams.home.id.toString(),
                name: game.teams.home.name,
                logo: game.teams.home.logo,
                primaryColor: homeColor // Use the calculated contrasting color
            },
            away: {
                id: game.teams.away.id.toString(),
                name: game.teams.away.name,
                logo: game.teams.away.logo,
                primaryColor: awayColor // Use the calculated contrasting color
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
                quarter_1: (_a = game.scores.home.quarter_1) !== null && _a !== void 0 ? _a : undefined,
                quarter_2: (_b = game.scores.home.quarter_2) !== null && _b !== void 0 ? _b : undefined,
                quarter_3: (_c = game.scores.home.quarter_3) !== null && _c !== void 0 ? _c : undefined,
                quarter_4: (_d = game.scores.home.quarter_4) !== null && _d !== void 0 ? _d : undefined,
                overtime: (_e = game.scores.home.over_time) !== null && _e !== void 0 ? _e : undefined
            },
            away: {
                total: game.scores.away.total,
                quarter_1: (_f = game.scores.away.quarter_1) !== null && _f !== void 0 ? _f : undefined,
                quarter_2: (_g = game.scores.away.quarter_2) !== null && _g !== void 0 ? _g : undefined,
                quarter_3: (_h = game.scores.away.quarter_3) !== null && _h !== void 0 ? _h : undefined,
                quarter_4: (_j = game.scores.away.quarter_4) !== null && _j !== void 0 ? _j : undefined,
                overtime: (_k = game.scores.away.over_time) !== null && _k !== void 0 ? _k : undefined
            }
        },
        date: game.date
    };
}
