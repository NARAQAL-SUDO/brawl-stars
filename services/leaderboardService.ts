
import { LeaderboardEntry } from '../types';
import { MOCK_LEADERBOARD_GLOBAL, MOCK_LEADERBOARD_LOCAL, MOCK_LEADERBOARD_SPENDERS } from '../constants';

// In-memory state to persist changes during the session
let globalState: LeaderboardEntry[] = [...MOCK_LEADERBOARD_GLOBAL];
let localState: LeaderboardEntry[] = [...MOCK_LEADERBOARD_LOCAL];
let spendersState: LeaderboardEntry[] = [...MOCK_LEADERBOARD_SPENDERS];
let brawlerState: LeaderboardEntry[] = []; // Dynamic for brawlers

// Simulate other players playing matches
const simulateLiveActivity = (list: LeaderboardEntry[], isBrawlerMode: boolean) => {
    return list.map(entry => {
        // 30% chance to change trophies
        if (Math.random() > 0.7) {
            // Smaller changes for brawlers, larger for total
            const maxChange = isBrawlerMode ? 8 : 14;
            const change = Math.floor(Math.random() * maxChange) - (isBrawlerMode ? 3 : 5); 
            return {
                ...entry,
                trophies: Math.max(0, entry.trophies + change)
            };
        }
        return entry;
    });
};

const generateBrawlerList = (seed: string): LeaderboardEntry[] => {
    const icons = ['SKULL', 'CROWN', 'ZAP', 'STAR', 'FLAME', 'SWORD', 'TARGET', 'SHIELD', 'GHOST', 'SMILE'];
    const clubs = ['Navi', 'Tribe', 'ZETA', 'STMN', 'Reply', 'SK', 'Mystic', 'Nova', 'Qlash', 'FUT'];
    const names = ['Pro', 'King', 'Master', 'Legend', 'Ghost', 'Shadow', 'Dark', 'Light', 'Fire', 'Ice', 'Viper', 'Wolf', 'Bear', 'Eagle'];
    
    const list: LeaderboardEntry[] = [];
    // Top players for a specific brawler usually have 1000-1250 trophies
    let baseTrophy = 1100 + (Math.random() * 150);

    for (let i = 1; i <= 200; i++) {
        const randName = names[Math.floor(Math.random() * names.length)] + (Math.floor(Math.random() * 999));
        const randClub = clubs[Math.floor(Math.random() * clubs.length)];
        const randIcon = icons[Math.floor(Math.random() * icons.length)];
        
        const trophy = Math.max(0, Math.floor(baseTrophy - (i * 2) + Math.random() * 5));

        list.push({
            rank: i,
            id: `bot_brawler_${seed}_${i}`,
            name: randName,
            trophies: trophy,
            icon: randIcon,
            club: randClub
        });
    }
    return list;
};

export const fetchLeaderboard = async (
    type: 'GLOBAL' | 'LOCAL' | 'SPENDERS' | 'BRAWLERS', 
    playerEntry: LeaderboardEntry,
    brawlerSeed?: string
): Promise<{ list: LeaderboardEntry[], playerRank: number }> => {
    
    // Simulate Network Latency (0.3s - 0.8s)
    const delay = 300 + Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    let currentList: LeaderboardEntry[] = [];
    
    if (type === 'GLOBAL') currentList = globalState;
    else if (type === 'LOCAL') currentList = localState;
    else if (type === 'SPENDERS') currentList = spendersState;
    else if (type === 'BRAWLERS') {
        // Generate or get list for this specific brawler
        currentList = generateBrawlerList(brawlerSeed || 'shelly');
    }

    if (type !== 'SPENDERS') {
        currentList = simulateLiveActivity(currentList, type === 'BRAWLERS');
    }

    // 2. Insert or Update Current Player
    const playerIndex = currentList.findIndex(p => p.id === playerEntry.id);
    
    if (playerIndex !== -1) {
        if (type === 'SPENDERS') {
             currentList[playerIndex] = { ...currentList[playerIndex], totalSpent: playerEntry.totalSpent };
        } else {
             currentList[playerIndex] = playerEntry;
        }
    } else {
        currentList.push(playerEntry);
    }

    // 3. Sort Descending
    if (type === 'SPENDERS') {
        currentList.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
    } else {
        currentList.sort((a, b) => b.trophies - a.trophies);
    }

    // 4. Re-assign Ranks
    currentList = currentList.map((entry, index) => ({
        ...entry,
        rank: index + 1
    }));

    // Update session state
    if (type === 'GLOBAL') globalState = currentList;
    else if (type === 'LOCAL') localState = currentList;
    else if (type === 'SPENDERS') spendersState = currentList;

    // Find player's new rank
    const finalPlayerRank = currentList.findIndex(p => p.id === playerEntry.id) + 1;

    return {
        list: currentList.slice(0, 200),
        playerRank: finalPlayerRank
    };
};
