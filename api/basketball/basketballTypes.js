"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNBATeamColor = exports.getBestContrastingColors = exports.nbaTeamColors = void 0;
exports.convertBasketballGame = convertBasketballGame;
// NBA Team Colors (60% tinted) with Primary, Secondary, and Tertiary Variants
exports.nbaTeamColors = {
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
    const homeColorOptions = [homeColors.primary, homeColors.secondary, homeColors.tertiary];
    const awayColorOptions = [awayColors.primary, awayColors.secondary, awayColors.tertiary];
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
