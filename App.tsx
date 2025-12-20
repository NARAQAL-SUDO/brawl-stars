
import React, { useState, useEffect, useRef } from 'react';
import Lobby from './components/Lobby';
import GameCanvas from './components/GameCanvas';
import GameOver from './components/GameOver';
import SplashScreen from './components/SplashScreen';
import BattleCardIntro from './components/BattleCardIntro';
import { BrawlerType, GameStatus, GameStats, BrawlerState, Club, ClubMember, TrophyReward, ShopOffer, Reward, GameMode, BrawlerRarity, BattleCardData, Character, TeamMember } from './types';
import { 
  BRAWL_BOX_COST, 
  BIG_BOX_COST_GEMS,
  MEGA_BOX_COST_GEMS,
  BRAWL_PASS_COST,
  GOLD_REWARD_RANK_1, 
  GOLD_REWARD_RANK_2, 
  GOLD_REWARD_RANK_3, 
  GOLD_REWARD_PARTICIPATION,
  BRAWLERS,
  UPGRADE_COSTS,
  MAX_LEVEL,
  MOCK_BOT_NAMES,
  BRAWL_PASS_TIERS,
  RARITY_INFO,
  MOCK_CLUBS_LIST,
  STAR_POWER_UNLOCK_LEVEL,
  STAR_POWER_COST,
  MAP_WIDTH, MAP_HEIGHT,
  TOTAL_TEAMS_SOLO,
  TOTAL_TEAMS_DUO,
  MASTERY_LEVELS,
  MASTERY_POINTS_PER_WIN,
  MASTERY_POINTS_PER_RANK_2,
  MASTERY_POINTS_PER_RANK_3
} from './constants';
import { playCollectSound, playPurchaseSound } from './services/audioService';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOBBY);
  const [selectedBrawler, setSelectedBrawler] = useState<BrawlerType>(BrawlerType.SHELLY);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.SOLO);
  const [lastStats, setLastStats] = useState<GameStats | null>(null);
  const [generatedEnemies, setGeneratedEnemies] = useState<Character[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // Create or retrieve a persistent Player ID
  const [playerId] = useState(() => {
      const saved = localStorage.getItem('brawl_ai_player_id');
      if (saved) return saved;
      const newId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('brawl_ai_player_id', newId);
      return newId;
  });
  
  // --- STATE & PERSISTENCE ---

  const [totalTrophies, setTotalTrophies] = useState<number>(() => {
    const saved = localStorage.getItem('brawl_ai_trophies');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [highestTrophies, setHighestTrophies] = useState<number>(() => {
    const savedHighest = localStorage.getItem('brawl_ai_highest_trophies');
    const savedCurrent = localStorage.getItem('brawl_ai_trophies');
    if (savedHighest) return parseInt(savedHighest, 10);
    if (savedCurrent) return parseInt(savedCurrent, 10);
    return 0;
  });

  const [gold, setGold] = useState<number>(() => {
    const saved = localStorage.getItem('brawl_ai_gold');
    return saved ? parseInt(saved, 10) : 2500; // Increased start gold to test SP buy
  });

  const [gems, setGems] = useState<number>(() => {
      const saved = localStorage.getItem('brawl_ai_gems');
      return saved ? parseInt(saved, 10) : 50; 
  });

  // Track Total Real Money Spent
  const [totalSpent, setTotalSpent] = useState<number>(() => {
      const saved = localStorage.getItem('brawl_ai_total_spent');
      return saved ? parseFloat(saved) : 0;
  });

  const [unlockedBrawlers, setUnlockedBrawlers] = useState<BrawlerType[]>(() => {
    const saved = localStorage.getItem('brawl_ai_unlocked_brawlers');
    return saved ? JSON.parse(saved) : [BrawlerType.SHELLY];
  });

  // GOAT MULTIPLIER STATE
  const [hasGoatMultiplier, setHasGoatMultiplier] = useState<boolean>(() => {
      return localStorage.getItem('brawl_ai_goat_mode') === 'true';
  });

  // GOAT MULTIPLIER PLUS STATE (100x)
  const [hasGoatPlusMultiplier, setHasGoatPlusMultiplier] = useState<boolean>(() => {
      return localStorage.getItem('brawl_ai_goat_plus_mode') === 'true';
  });

  const [brawlerStates, setBrawlerStates] = useState<Record<BrawlerType, BrawlerState>>(() => {
    const saved = localStorage.getItem('brawl_ai_brawler_states');
    const parsed = saved ? JSON.parse(saved) : {};
    
    const initial: any = { ...parsed };
    Object.values(BrawlerType).forEach(type => {
        const config = BRAWLERS[type];
        // Ensure structure is up to date
        if (!initial[type]) {
            initial[type] = { 
                level: 1, 
                powerPoints: 0, 
                currentSkin: 'DEFAULT', 
                unlockedSkins: ['DEFAULT'],
                unlockedStarPowers: [], 
                selectedStarPower: undefined,
                masteryPoints: 0 // New field
            };
        } 
        
        // Backfill missing properties if loading old data
        if (!initial[type].unlockedSkins) initial[type].unlockedSkins = ['DEFAULT'];
        if (!initial[type].unlockedStarPowers) initial[type].unlockedStarPowers = [];
        if (initial[type].masteryPoints === undefined) initial[type].masteryPoints = 0;
        
        // Grant some initial skins for testing functionality
        if (type === BrawlerType.COLT && !initial[type].unlockedSkins.includes('MÜCADELECİ_COLT')) {
            initial[type].unlockedSkins.push('MÜCADELECİ_COLT');
        }
        if (type === BrawlerType.NITA && !initial[type].unlockedSkins.includes('PANDA_NITA')) {
            initial[type].unlockedSkins.push('PANDA_NITA');
        }
        if (type === BrawlerType.EL_PRIMO && !initial[type].unlockedSkins.includes('EL_REY_PRIMO')) {
             initial[type].unlockedSkins.push('EL_REY_PRIMO');
        }
        if (type === BrawlerType.DYNAMIKE && !initial[type].unlockedSkins.includes('BELLHOP_MIKE')) {
             initial[type].unlockedSkins.push('BELLHOP_MIKE');
        }
        if (type === BrawlerType.BARLEY && !initial[type].unlockedSkins.includes('WIZARD_BARLEY')) {
             initial[type].unlockedSkins.push('WIZARD_BARLEY');
        }
    });
    return initial;
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('brawl_ai_playername') || 'OYUNCU';
  });

  const [profileIcon, setProfileIcon] = useState<string>(() => {
    return localStorage.getItem('brawl_ai_profile_icon') || 'SKULL';
  });

  const [favBrawler, setFavBrawler] = useState<BrawlerType>(() => {
      const saved = localStorage.getItem('brawl_ai_fav_brawler');
      return (saved as BrawlerType) || BrawlerType.SHELLY;
  });

  const [battleCard, setBattleCard] = useState<BattleCardData>(() => {
      const saved = localStorage.getItem('brawl_ai_battle_card');
      return saved ? JSON.parse(saved) : { icon1: 'ZAP', icon2: 'SKULL', pin: 'default', title: 'YILDIZ OYUNCU' };
  });

  const [soloVictories, setSoloVictories] = useState<number>(() => {
    const saved = localStorage.getItem('brawl_ai_solo_victories');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [claimedTrophyRewards, setClaimedTrophyRewards] = useState<number[]>(() => {
      const saved = localStorage.getItem('brawl_ai_claimed_trophy_rewards');
      return saved ? JSON.parse(saved) : [];
  });

  const [hasBrawlPass, setHasBrawlPass] = useState<boolean>(() => {
      return localStorage.getItem('brawl_ai_has_pass') === 'true';
  });
  
  const [totalPassTokens, setTotalPassTokens] = useState<number>(() => {
      const saved = localStorage.getItem('brawl_ai_pass_tokens');
      return saved ? parseInt(saved, 10) : 0;
  });

  const [claimedPassFreeRewards, setClaimedPassFreeRewards] = useState<number[]>(() => {
      const saved = localStorage.getItem('brawl_ai_claimed_pass_free');
      return saved ? JSON.parse(saved) : [];
  });
  
  const [claimedPassPaidRewards, setClaimedPassPaidRewards] = useState<number[]>(() => {
      const saved = localStorage.getItem('brawl_ai_claimed_pass_paid');
      return saved ? JSON.parse(saved) : [];
  });

  const calculateCurrentPassTier = (tokens: number) => {
      let tier = 0;
      let remaining = tokens;
      for (const t of BRAWL_PASS_TIERS) {
          if (remaining >= t.requiredTokens) {
              remaining -= t.requiredTokens;
              tier = t.tier;
          } else {
              return { tier: tier + 1, progress: remaining, required: t.requiredTokens };
          }
      }
      return { tier: BRAWL_PASS_TIERS.length, progress: remaining, required: 9999 };
  };

  const currentPassInfo = calculateCurrentPassTier(totalPassTokens);
  // Calculate percentage for UI bar
  const passProgressPercent = currentPassInfo.required > 0 
    ? (currentPassInfo.progress / currentPassInfo.required) * 100 
    : 100;

  const [club, setClub] = useState<Club | null>(() => {
      // FIX: Check "hasLeft" flag FIRST. If true, force null regardless of saved data.
      const hasLeft = localStorage.getItem('brawl_ai_has_left_club') === 'true';
      if (hasLeft) return null;

      const saved = localStorage.getItem('brawl_ai_club');
      
      if (saved) {
          try {
              return JSON.parse(saved);
          } catch(e) {
              return null;
          }
      }

      // If no saved club and hasn't explicitly left, create default
      const members: ClubMember[] = [];
      members.push({
          id: playerId,
          name: localStorage.getItem('brawl_ai_playername') || 'OYUNCU',
          role: 'KIDEMLİ ÜYE',
          trophies: parseInt(localStorage.getItem('brawl_ai_trophies') || '0'),
          icon: 'SKULL',
          status: 'Çevrimiçi',
          isPlayer: true
      });

      for (let i = 0; i < 29; i++) {
          const name = MOCK_BOT_NAMES[Math.floor(Math.random() * MOCK_BOT_NAMES.length)] + (Math.floor(Math.random() * 99));
          members.push({
              id: `bot_${i}`,
              name: name,
              role: i === 0 ? 'BAŞKAN' : (Math.random() > 0.8 ? 'KIDEMLİ ÜYE' : 'ÜYE'),
              trophies: Math.floor(Math.random() * 15000) + 500,
              icon: 'SKULL',
              status: Math.random() > 0.5 ? 'Çevrimiçi' : `${Math.floor(Math.random() * 59) + 1} dk önce`,
              isPlayer: false
          });
      }

      return {
          id: 'club_default',
          name: 'Yıldırım KİNG',
          description: 'Herkesi bekleriz aktif üyeler gelsin! Kupa kasanlar buraya.',
          badge: 'SHIELD',
          requiredTrophies: 12000,
          totalTrophies: members.reduce((sum, m) => sum + m.trophies, 0),
          members: members
      };
  });

  useEffect(() => {
    localStorage.setItem('brawl_ai_trophies', totalTrophies.toString());
    if (totalTrophies > highestTrophies) {
      setHighestTrophies(totalTrophies);
      localStorage.setItem('brawl_ai_highest_trophies', totalTrophies.toString());
    }

    setClub(prev => {
        if (!prev) return null;
        const updatedMembers = prev.members.map(m => {
            if (m.isPlayer) {
                return { ...m, name: playerName, trophies: totalTrophies, icon: profileIcon, id: playerId };
            }
            return m;
        });
        const total = updatedMembers.reduce((sum, m) => sum + m.trophies, 0);
        const newClub = { ...prev, members: updatedMembers, totalTrophies: total };
        localStorage.setItem('brawl_ai_club', JSON.stringify(newClub));
        return newClub;
    });

  }, [totalTrophies, highestTrophies, playerName, profileIcon, playerId]);

  useEffect(() => { localStorage.setItem('brawl_ai_gold', gold.toString()); }, [gold]);
  useEffect(() => { localStorage.setItem('brawl_ai_gems', gems.toString()); }, [gems]);
  useEffect(() => { localStorage.setItem('brawl_ai_total_spent', totalSpent.toString()); }, [totalSpent]);
  useEffect(() => { localStorage.setItem('brawl_ai_unlocked_brawlers', JSON.stringify(unlockedBrawlers)); }, [unlockedBrawlers]);
  useEffect(() => { localStorage.setItem('brawl_ai_brawler_states', JSON.stringify(brawlerStates)); }, [brawlerStates]);
  useEffect(() => { localStorage.setItem('brawl_ai_playername', playerName); }, [playerName]);
  useEffect(() => { localStorage.setItem('brawl_ai_profile_icon', profileIcon); }, [profileIcon]);
  useEffect(() => { localStorage.setItem('brawl_ai_solo_victories', soloVictories.toString()); }, [soloVictories]);
  useEffect(() => { localStorage.setItem('brawl_ai_claimed_trophy_rewards', JSON.stringify(claimedTrophyRewards)); }, [claimedTrophyRewards]);
  
  useEffect(() => { localStorage.setItem('brawl_ai_has_pass', hasBrawlPass.toString()); }, [hasBrawlPass]);
  useEffect(() => { localStorage.setItem('brawl_ai_pass_tokens', totalPassTokens.toString()); }, [totalPassTokens]);
  useEffect(() => { localStorage.setItem('brawl_ai_claimed_pass_free', JSON.stringify(claimedPassFreeRewards)); }, [claimedPassFreeRewards]);
  useEffect(() => { localStorage.setItem('brawl_ai_claimed_pass_paid', JSON.stringify(claimedPassPaidRewards)); }, [claimedPassPaidRewards]);
  
  // Persist GOAT state
  useEffect(() => { localStorage.setItem('brawl_ai_goat_mode', hasGoatMultiplier.toString()); }, [hasGoatMultiplier]);
  useEffect(() => { localStorage.setItem('brawl_ai_goat_plus_mode', hasGoatPlusMultiplier.toString()); }, [hasGoatPlusMultiplier]);

  // Persist extra profile data
  useEffect(() => { localStorage.setItem('brawl_ai_fav_brawler', favBrawler); }, [favBrawler]);
  useEffect(() => { localStorage.setItem('brawl_ai_battle_card', JSON.stringify(battleCard)); }, [battleCard]);

  // Persist Club changes (esp null state)
  useEffect(() => {
      if (club) {
          localStorage.setItem('brawl_ai_club', JSON.stringify(club));
      } else {
          localStorage.removeItem('brawl_ai_club');
      }
  }, [club]);

  // If game mode is set to SOLO but we have team members, clear them
  useEffect(() => {
      if (gameMode === GameMode.SOLO && teamMembers.length > 0) {
          setTeamMembers([]);
      }
  }, [gameMode]);

  const handleSelectBrawler = (type: BrawlerType) => {
    if (unlockedBrawlers.includes(type)) {
      setSelectedBrawler(type);
    }
  };
  
  const handleSelectSkin = (type: BrawlerType, skinId: string) => {
      setBrawlerStates(prev => ({
          ...prev,
          [type]: { ...prev[type], currentSkin: skinId }
      }));
  };

  const handleAcceptInvite = (memberName: string, brawlerType: BrawlerType) => {
      const newMember: TeamMember = {
          id: `bot_${Date.now()}`,
          name: memberName,
          brawler: brawlerType,
          isReady: true,
          isLeader: false
      };
      setTeamMembers([newMember]);
      setGameMode(GameMode.DUO); // Auto switch to Duo
  };

  const generateBotEnemies = (mode: GameMode, level: number): Character[] => {
      const enemies: Character[] = [];
      const brawlerTypes = Object.values(BrawlerType);
      
      const botNameSource = club ? club.members.filter(m => !m.isPlayer).map(m => m.name) : MOCK_BOT_NAMES;
      const shuffledNames = [...botNameSource].sort(() => 0.5 - Math.random());
      let nameIdx = 0;

      // Dummy create character helper strictly for Intro data
      const createDummy = (type: BrawlerType, teamId: number, name: string): Character => ({
          id: Math.random().toString(),
          name,
          type,
          team: teamId === 0 ? 'blue' : 'red',
          teamId,
          pos: {x:0, y:0}, velocity: {x:0, y:0}, radius: 20, active: true, health: 100, maxHealth: 100,
          angle: 0, ammo: 3, maxAmmo: 3, powerCubes: 0, lastShotTime: 0, lastDamageTime: 0, spawnShieldEndTime: 0, respawnEndTime: 0,
          level, config: BRAWLERS[type],
          superCharge: 0 // Added this line
      });

      if (mode === GameMode.DUO) {
          // Teammate Logic
          if (teamMembers.length > 0) {
              // Use the actual team member from Lobby
              const tm = teamMembers[0];
              enemies.push(createDummy(tm.brawler, 0, tm.name));
          } else {
              // Random partner if SOLO queue in DUO
              const type = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
              enemies.push(createDummy(type, 0, shuffledNames[nameIdx++] || 'Partner'));
          }

          // Enemy Teams x 2
          for (let t = 1; t <= TOTAL_TEAMS_DUO - 1; t++) {
              for (let m = 0; m < 2; m++) {
                  const tType = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
                  enemies.push(createDummy(tType, t, shuffledNames[nameIdx++] || `Bot ${t}-${m}`));
              }
          }
      } else if (mode === GameMode.KNOCKOUT) {
          // 2 Allies
          for (let i = 1; i <= 2; i++) {
              const type = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
              enemies.push(createDummy(type, 0, shuffledNames[nameIdx++] || `Ally ${i}`));
          }
          // 3 Enemies
          for (let i = 0; i < 3; i++) {
              const type = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
              enemies.push(createDummy(type, 1, shuffledNames[nameIdx++] || `Enemy ${i}`));
          }
      } else {
          // SOLO: Enemy Teams
          for (let t = 1; t <= TOTAL_TEAMS_SOLO - 1; t++) {
              const type = brawlerTypes[Math.floor(Math.random() * brawlerTypes.length)];
              enemies.push(createDummy(type, t, shuffledNames[nameIdx++] || `Bot ${t}`));
          }
      }
      return enemies;
  };

  const handlePlay = () => {
    // Generate enemies NOW for the intro card, pass them to GameCanvas later via logic or regeneration
    // Actually GameCanvas generates its own currently. 
    // To sync them, we should generate here and pass down OR just generate purely for visual INTRO here 
    // and let GameCanvas regenerate (simpler, though names might mismatch slightly if not careful).
    // Better: Generate visual-only list for Intro. GameCanvas uses its own logic which is fine for gameplay.
    // Ideally we'd pass this list to GameCanvas to ensure consistency.
    
    // For this task, we just want the Intro to show "opponents".
    const visualEnemies = generateBotEnemies(gameMode, brawlerStates[selectedBrawler].level);
    setGeneratedEnemies(visualEnemies);

    setStatus(GameStatus.INTRO);
  };

  const handleIntroComplete = () => {
      setStatus(GameStatus.PLAYING);
  };

  const calculateTrophyChange = (rank: number): number => {
    let change = 0;
    switch (rank) {
      case 1: change = 10; break;
      case 2: change = 7; break;
      case 3: change = 4; break;
      case 4: change = 0; break;
      case 5: change = -2; break;
      default: change = -4; break;
    }

    // GOAT MULTIPLIER LOGIC (10x / 100x / 1000x for wins)
    if (change > 0) {
        if (hasGoatPlusMultiplier && hasGoatMultiplier) {
            change *= 1000; // SUPER COMBINATION
        } else if (hasGoatPlusMultiplier) {
            change *= 100;
        } else if (hasGoatMultiplier) {
            change *= 10;
        }
    }
    return change;
  };

  const calculateGoldReward = (rank: number): number => {
      if (rank === 1) return GOLD_REWARD_RANK_1;
      if (rank === 2) return GOLD_REWARD_RANK_2;
      if (rank === 3) return GOLD_REWARD_RANK_3;
      return GOLD_REWARD_PARTICIPATION;
  };

  // Helper to determine rank name from points
  const getMasteryRankName = (points: number): string => {
      let rankName = 'BRONZ I';
      for (const level of MASTERY_LEVELS) {
          if (points >= level.minPoints) {
              rankName = level.name;
          } else {
              break;
          }
      }
      return rankName;
  };

  const handleGameOver = (stats: GameStats) => {
    const trophyChange = calculateTrophyChange(stats.rank);
    const goldEarned = calculateGoldReward(stats.rank);

    // Calculate Mastery Points Gained
    let masteryGained = 0;
    if (stats.rank === 1) masteryGained = MASTERY_POINTS_PER_WIN;
    else if (stats.rank === 2) masteryGained = MASTERY_POINTS_PER_RANK_2;
    else if (stats.rank === 3) masteryGained = MASTERY_POINTS_PER_RANK_3;
    else if (stats.rank <= 5) masteryGained = 5; // Participation mastery

    // Update Player Stats
    setTotalTrophies(prev => Math.max(0, prev + trophyChange));
    setGold(prev => prev + goldEarned);

    const tokensEarned = 20 + (stats.rank <= 3 ? 10 : 0) + (stats.kills * 5);
    setTotalPassTokens(prev => prev + tokensEarned);

    if (stats.rank <= 3) {
      setSoloVictories(prev => prev + 1);
    }

    // Update Mastery Points
    if (masteryGained > 0) {
        setBrawlerStates(prev => ({
            ...prev,
            [selectedBrawler]: {
                ...prev[selectedBrawler],
                masteryPoints: (prev[selectedBrawler].masteryPoints || 0) + masteryGained
            }
        }));
    }

    const finalStats = { ...stats, trophyChange, masteryPointsGained: masteryGained };
    setLastStats(finalStats);
    setStatus(GameStatus.GAME_OVER);
  };

  const handleRestart = () => {
    // Re-roll enemies for new match
    const visualEnemies = generateBotEnemies(gameMode, brawlerStates[selectedBrawler].level);
    setGeneratedEnemies(visualEnemies);
    setStatus(GameStatus.INTRO);
  };

  const handleHome = () => {
    setStatus(GameStatus.LOBBY);
  };

  const handleUpgradeBrawler = (type: BrawlerType) => {
      const state = brawlerStates[type];
      if (state.level >= MAX_LEVEL) return;

      const cost = UPGRADE_COSTS[state.level - 1]; 
      if (!cost) return;

      if (gold >= cost.gold && state.powerPoints >= cost.pp) {
          setGold(prev => prev - cost.gold);
          setBrawlerStates(prev => ({
              ...prev,
              [type]: {
                  ...state,
                  level: state.level + 1,
                  powerPoints: state.powerPoints - cost.pp
              }
          }));
          playPurchaseSound();
      }
  };

  // BUY STAR POWER LOGIC
  const handleBuyStarPower = (brawlerType: BrawlerType, starPowerId: string) => {
      if (gold >= STAR_POWER_COST) {
          setGold(prev => prev - STAR_POWER_COST);
          setBrawlerStates(prev => {
              const brawlerState = prev[brawlerType];
              if (!brawlerState.unlockedStarPowers.includes(starPowerId)) {
                  return {
                      ...prev,
                      [brawlerType]: {
                          ...brawlerState,
                          unlockedStarPowers: [...brawlerState.unlockedStarPowers, starPowerId],
                          selectedStarPower: starPowerId // Auto equip
                      }
                  };
              }
              return prev;
          });
          playPurchaseSound();
      }
  };

  // EQUIP STAR POWER LOGIC
  const handleEquipStarPower = (brawlerType: BrawlerType, starPowerId: string) => {
      setBrawlerStates(prev => ({
          ...prev,
          [brawlerType]: {
              ...prev[brawlerType],
              selectedStarPower: starPowerId
          }
      }));
      playCollectSound();
  };

  const handleLeaveClub = () => {
      setClub(null);
      // FIX: Ensure immediate cleanup so refresh doesn't bring it back
      localStorage.setItem('brawl_ai_has_left_club', 'true');
      localStorage.removeItem('brawl_ai_club'); 
  };

  const handleJoinClub = (clubId: string) => {
      const targetClub = MOCK_CLUBS_LIST.find(c => c.id === clubId);
      if (!targetClub) return;

      const newMember: ClubMember = {
          id: playerId,
          name: playerName,
          role: 'ÜYE',
          trophies: totalTrophies,
          icon: profileIcon,
          status: 'Çevrimiçi',
          isPlayer: true
      };

      const updatedClub = {
          ...targetClub,
          members: [...targetClub.members, newMember],
          totalTrophies: targetClub.totalTrophies + totalTrophies
      };
      
      setClub(updatedClub);
      localStorage.removeItem('brawl_ai_has_left_club'); // Remove the flag so we remember the new club
      playCollectSound();
  };

  // --- NEW: ROBUST PROBABILITY-BASED BOX LOGIC ---
  const openBoxLogic = (type: 'BRAWL' | 'BIG' | 'MEGA'): Reward[] => {
      // ... (existing box logic logic code) ...
      // Keeping it simple for brevity in response, assuming it is unchanged from previous file content
      let goldMin = 15;
      let goldMax = 30;
      let powerPointStacks = 1;
      let brawlerChance = 0.08; 
      let starPowerChance = 0.01; 

      if (type === 'BIG') { 
          goldMin = 40;
          goldMax = 80;
          powerPointStacks = 2;
          brawlerChance = 0.20;
          starPowerChance = 0.03;
      } else if (type === 'MEGA') { 
          goldMin = 150;
          goldMax = 300;
          powerPointStacks = 5;
          brawlerChance = 0.50;
          starPowerChance = 0.10;
      }

      const rewards: Reward[] = [];
      let tempUnlocked = [...unlockedBrawlers];
      const ppUpdates: Record<string, number> = {};
      const spUpdates: { brawler: BrawlerType, spId: string }[] = [];

      const goldAmount = Math.floor(Math.random() * (goldMax - goldMin + 1)) + goldMin;
      rewards.push({ type: 'GOLD', value: goldAmount });

      let spDrop = false;
      const eligibleForSP: { type: BrawlerType, sp: string }[] = [];
      
      Object.keys(brawlerStates).forEach(k => {
          const type = k as BrawlerType;
          const state = brawlerStates[type];
          if (unlockedBrawlers.includes(type) && state.level >= STAR_POWER_UNLOCK_LEVEL) {
              const config = BRAWLERS[type];
              if (config.starPowers) {
                  config.starPowers.forEach(sp => {
                      if (!state.unlockedStarPowers.includes(sp.id)) {
                          eligibleForSP.push({ type, sp: sp.id });
                      }
                  });
              }
          }
      });

      if (eligibleForSP.length > 0 && Math.random() < starPowerChance) {
          const wonSP = eligibleForSP[Math.floor(Math.random() * eligibleForSP.length)];
          spUpdates.push({ brawler: wonSP.type, spId: wonSP.sp });
          const spConfig = BRAWLERS[wonSP.type].starPowers.find(s => s.id === wonSP.sp);
          
          rewards.push({
              type: 'BRAWLER_SKIN',
              value: wonSP.sp,
              amount: 1,
              label: spConfig ? spConfig.name : 'YILDIZ GÜCÜ'
          });
          spDrop = true;
      }

      const allBrawlerTypes = Object.values(BrawlerType);
      const lockedBrawlers = allBrawlerTypes.filter(b => !tempUnlocked.includes(b));
      
      let newBrawlerFound: BrawlerType | null = null;

      if (!spDrop && lockedBrawlers.length > 0 && Math.random() < brawlerChance) {
          const rarityWeights: Record<BrawlerRarity, number> = {
              [BrawlerRarity.COMMON]: 100,
              [BrawlerRarity.RARE]: 50,
              [BrawlerRarity.SUPER_RARE]: 25,
              [BrawlerRarity.EPIC]: 10,
              [BrawlerRarity.MYTHIC]: 5,
              [BrawlerRarity.LEGENDARY]: 1
          };

          let totalWeight = 0;
          const weightedList: { type: BrawlerType, weight: number }[] = [];

          lockedBrawlers.forEach(bType => {
              const rarity = BRAWLERS[bType].rarity;
              const weight = rarityWeights[rarity];
              weightedList.push({ type: bType, weight });
              totalWeight += weight;
          });

          let randomWeight = Math.random() * totalWeight;
          
          for (const item of weightedList) {
              if (randomWeight < item.weight) {
                  newBrawlerFound = item.type;
                  break;
              }
              randomWeight -= item.weight;
          }

          if (!newBrawlerFound && lockedBrawlers.length > 0) {
              newBrawlerFound = lockedBrawlers[0];
          }

          if (newBrawlerFound) {
              tempUnlocked.push(newBrawlerFound);
              rewards.push({ type: 'BRAWLER', value: newBrawlerFound });
              ppUpdates[newBrawlerFound] = 20;
          }
      }

      const remainingStacks = newBrawlerFound ? powerPointStacks - 1 : powerPointStacks;

      if (remainingStacks > 0) {
          const availableForPP = tempUnlocked.filter(b => b !== newBrawlerFound);
          
          if (availableForPP.length > 0) {
              const shuffled = [...availableForPP].sort(() => 0.5 - Math.random());
              const selectedBrawlers = shuffled.slice(0, Math.min(remainingStacks, shuffled.length));

              selectedBrawlers.forEach(brawler => {
                  let minPP = 5, maxPP = 15;
                  if (type === 'BIG') { minPP = 10; maxPP = 25; }
                  if (type === 'MEGA') { minPP = 15; maxPP = 40; }
                  
                  const amount = Math.floor(Math.random() * (maxPP - minPP + 1)) + minPP;
                  
                  ppUpdates[brawler] = (ppUpdates[brawler] || 0) + amount;
                  
                  rewards.push({ 
                      type: 'POWER_POINTS', 
                      value: amount, 
                      extra: { type: 'PP', amount: amount, target: brawler } 
                  });
              });
          }
      }

      setGold(prev => prev + goldAmount);
      setUnlockedBrawlers(tempUnlocked);
      
      setBrawlerStates(prev => {
          const newState = { ...prev };
          tempUnlocked.forEach(b => {
             if (!newState[b]) newState[b] = { level: 1, powerPoints: 0, currentSkin: 'DEFAULT', unlockedSkins: ['DEFAULT'], unlockedStarPowers: [], masteryPoints: 0 };
          });

          Object.entries(ppUpdates).forEach(([brawler, amount]) => {
              if (newState[brawler as BrawlerType]) {
                  newState[brawler as BrawlerType] = {
                      ...newState[brawler as BrawlerType],
                      powerPoints: newState[brawler as BrawlerType].powerPoints + amount
                  };
              }
          });

          spUpdates.forEach(update => {
              if (newState[update.brawler]) {
                  const currentSPs = newState[update.brawler].unlockedStarPowers || [];
                  if (!currentSPs.includes(update.spId)) {
                      newState[update.brawler] = {
                          ...newState[update.brawler],
                          unlockedStarPowers: [...currentSPs, update.spId],
                          selectedStarPower: update.spId 
                      };
                  }
              }
          });

          return newState;
      });

      playCollectSound();
      return rewards;
  };

  const handleOpenBoxWrapper = (type: 'BRAWL' | 'BIG' | 'MEGA') => {
      if (type === 'BRAWL') {
          if (gold < BRAWL_BOX_COST) return null;
          setGold(prev => prev - BRAWL_BOX_COST);
      } else if (type === 'BIG') {
          if (gems < BIG_BOX_COST_GEMS) return null;
          setGems(prev => prev - BIG_BOX_COST_GEMS);
      } else if (type === 'MEGA') {
          if (gems < MEGA_BOX_COST_GEMS) return null;
          setGems(prev => prev - MEGA_BOX_COST_GEMS);
      }
      playPurchaseSound(); 
      return openBoxLogic(type);
  };

  const handleBuyShopItem = (offer: ShopOffer): boolean => {
      if (offer.costType === 'REAL_MONEY') {
          // Add to Total Spent
          const priceStr = offer.priceLabel || "0";
          // Basic parse for '₺9,999' or '₺39.99'
          const amount = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
          if (amount > 0) {
              setTotalSpent(prev => prev + amount);
          }

          // --- GOAT TROPHY PURCHASE LOGIC ---
          if (offer.id === 'goat_trophy') {
              setHasGoatMultiplier(true);
              playPurchaseSound();
              return true;
          }
          // --- GOAT TROPHY PLUS PURCHASE LOGIC ---
          if (offer.id === 'goat_trophy_plus') {
              setHasGoatPlusMultiplier(true);
              playPurchaseSound();
              return true;
          }

          if (offer.rewardType === 'SKIN' && offer.brawlerType && offer.skinId) {
             setBrawlerStates(prev => {
                const brawler = prev[offer.brawlerType!];
                if (brawler.unlockedSkins.includes(offer.skinId!)) return prev;
                return {
                    ...prev,
                    [offer.brawlerType!]: {
                        ...brawler,
                        unlockedSkins: [...brawler.unlockedSkins, offer.skinId!],
                        currentSkin: offer.skinId 
                    }
                };
             });
             playPurchaseSound();
             return true;
          }
          if (offer.rewardType === 'GEMS') {
              setGems(prev => prev + offer.amount);
              playPurchaseSound();
              return true;
          }
          return false;
      }

      if (offer.costType === 'GEMS' && gems < offer.cost) return false;
      if (offer.costType === 'GOLD' && gold < offer.cost) return false;
      
      if (offer.type === 'DAILY') {
          const key = `claimed_daily_${new Date().toDateString()}`;
          if (localStorage.getItem(key)) return false;
          localStorage.setItem(key, 'true');
      }

      if (offer.costType === 'GEMS') setGems(prev => prev - offer.cost);
      if (offer.costType === 'GOLD') setGold(prev => prev - offer.cost);

      if (offer.rewardType === 'GOLD') {
          setGold(prev => prev + offer.amount);
      } else if (offer.rewardType === 'POWER_POINTS') {
          const targetBrawler = unlockedBrawlers[Math.floor(Math.random() * unlockedBrawlers.length)];
          setBrawlerStates(prev => ({
              ...prev,
              [targetBrawler]: {
                  ...prev[targetBrawler],
                  powerPoints: prev[targetBrawler].powerPoints + offer.amount
              }
          }));
      } else if (offer.rewardType === 'MEGA_BOX') {
          for (let i = 0; i < offer.amount; i++) openBoxLogic('MEGA');
      } else if (offer.rewardType === 'BIG_BOX') {
           for (let i = 0; i < offer.amount; i++) openBoxLogic('BIG');
      } else if (offer.rewardType === 'SKIN' && offer.brawlerType && offer.skinId) {
          setBrawlerStates(prev => {
              const brawler = prev[offer.brawlerType!];
              if (brawler.unlockedSkins.includes(offer.skinId!)) return prev;
              return {
                  ...prev,
                  [offer.brawlerType!]: {
                      ...brawler,
                      unlockedSkins: [...brawler.unlockedSkins, offer.skinId!],
                      currentSkin: offer.skinId 
                  }
              };
          });
      }

      if (offer.costType === 'FREE') playCollectSound();
      else playPurchaseSound();
      return true;
  };

  const handleBuyBrawlPass = () => {
      if (hasBrawlPass) return;
      if (gems < BRAWL_PASS_COST) return;
      setGems(prev => prev - BRAWL_PASS_COST);
      setHasBrawlPass(true);
      playPurchaseSound();
  };

  const handleBuyTier = () => {
      const tierCost = 30;
      if (gems < tierCost) return;
      if (currentPassInfo.required >= 9999) return;
      const tokensNeeded = currentPassInfo.required - currentPassInfo.progress;
      setGems(prev => prev - tierCost);
      setTotalPassTokens(prev => prev + tokensNeeded);
      playPurchaseSound();
  };

  const handleClaimPassReward = (tier: number, isPaid: boolean): Reward[] | null => {
      // (Simplified: keeping existing logic)
      if (tier > currentPassInfo.tier) return null;
      if (isPaid && !hasBrawlPass) return null;
      const claimedList = isPaid ? claimedPassPaidRewards : claimedPassFreeRewards;
      if (claimedList.includes(tier)) return null;
      const tierData = BRAWL_PASS_TIERS.find(t => t.tier === tier);
      if (!tierData) return null;
      const reward = isPaid ? tierData.paidReward : tierData.freeReward;
      let generatedRewards: Reward[] | null = null;

      if (reward.type === 'BRAWLER_SKIN' && reward.value === 'BELLHOP_MIKE') {
          setBrawlerStates(prev => {
              const dynState = prev[BrawlerType.DYNAMIKE];
              if (!dynState) return prev; 
              if (!dynState.unlockedSkins.includes('BELLHOP_MIKE')) {
                  return { ...prev, [BrawlerType.DYNAMIKE]: { ...dynState, unlockedSkins: [...dynState.unlockedSkins, 'BELLHOP_MIKE'], currentSkin: 'BELLHOP_MIKE' } };
              }
              return prev;
          });
      } else if (reward.type === 'GOLD') { setGold(prev => prev + reward.amount); } 
      else if (reward.type === 'GEMS') { setGems(prev => prev + reward.amount); } 
      else if (reward.type === 'POWER_POINTS') {
           const targetBrawler = unlockedBrawlers[Math.floor(Math.random() * unlockedBrawlers.length)];
           setBrawlerStates(prev => ({ ...prev, [targetBrawler]: { ...prev[targetBrawler], powerPoints: prev[targetBrawler].powerPoints + reward.amount } }));
      } else if (reward.type === 'BIG_BOX') { generatedRewards = openBoxLogic('BIG'); } 
      else if (reward.type === 'MEGA_BOX') { generatedRewards = openBoxLogic('MEGA'); }
      
      if (isPaid) setClaimedPassPaidRewards(prev => [...prev, tier]);
      else setClaimedPassFreeRewards(prev => [...prev, tier]);
      playCollectSound();
      return generatedRewards;
  };

  const handleClaimTrophyReward = (reward: TrophyReward) => {
      if (claimedTrophyRewards.includes(reward.id)) return;
      
      setClaimedTrophyRewards(prev => [...prev, reward.id]);
      
      if (reward.type === 'GOLD') {
          setGold(prev => prev + reward.amount);
          playCollectSound();
      } else if (reward.type === 'POWER_POINTS') {
           if (unlockedBrawlers.length > 0) {
              const targetBrawler = unlockedBrawlers[Math.floor(Math.random() * unlockedBrawlers.length)];
              setBrawlerStates(prev => ({
                  ...prev,
                  [targetBrawler]: {
                      ...prev[targetBrawler],
                      powerPoints: prev[targetBrawler].powerPoints + reward.amount
                  }
              }));
           }
           playCollectSound();
      } else if (reward.type === 'BIG_BOX') {
           openBoxLogic('BIG');
      } else if (reward.type === 'MEGA_BOX') {
           openBoxLogic('MEGA');
      }
  };

  if (showSplash) {
      return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      {status === GameStatus.LOBBY && (
        <Lobby 
          selectedBrawler={selectedBrawler}
          onSelectBrawler={handleSelectBrawler}
          onPlay={handlePlay}
          totalTrophies={totalTrophies}
          highestTrophies={highestTrophies}
          gold={gold}
          gems={gems}
          unlockedBrawlers={unlockedBrawlers}
          onOpenBox={handleOpenBoxWrapper}
          playerName={playerName}
          onNameChange={setPlayerName}
          profileIcon={profileIcon}
          onProfileIconChange={setProfileIcon}
          soloVictories={soloVictories}
          brawlerStates={brawlerStates}
          onUpgradeBrawler={handleUpgradeBrawler}
          club={club}
          onLeaveClub={handleLeaveClub}
          onJoinClub={handleJoinClub}
          currentPlayerId={playerId}
          claimedTrophyRewards={claimedTrophyRewards}
          onClaimTrophyReward={handleClaimTrophyReward}
          onBuyShopItem={handleBuyShopItem}
          passProgress={passProgressPercent}
          passTier={currentPassInfo.tier}
          hasBrawlPass={hasBrawlPass}
          claimedPassFreeRewards={claimedPassFreeRewards}
          claimedPassPaidRewards={claimedPassPaidRewards}
          onClaimPassReward={handleClaimPassReward}
          onBuyBrawlPass={handleBuyBrawlPass}
          onSelectSkin={handleSelectSkin}
          gameMode={gameMode}
          onSelectGameMode={setGameMode}
          onBuyTier={handleBuyTier}
          onBuyStarPower={handleBuyStarPower}
          onEquipStarPower={handleEquipStarPower}
          favoriteBrawler={favBrawler}
          onSelectFavoriteBrawler={setFavBrawler}
          battleCard={battleCard}
          onUpdateBattleCard={setBattleCard}
          teamMembers={teamMembers}
          onAcceptInvite={handleAcceptInvite}
          hasGoatMultiplier={hasGoatMultiplier}
          hasGoatPlusMultiplier={hasGoatPlusMultiplier}
          // Pass new props related to Leaderboard potentially if needed, but not strictly required
          // as Leaderboard component fetches its own data or uses context/globals
        />
      )}

      {status === GameStatus.INTRO && (
          <BattleCardIntro 
              playerName={playerName}
              // Using the battleCard title or a default
              playerTitle={battleCard.title || "Yıldız Oyuncu"}
              brawlerType={selectedBrawler}
              skin={brawlerStates[selectedBrawler].currentSkin}
              battleCard={battleCard}
              onIntroComplete={handleIntroComplete}
              opponents={generatedEnemies}
              gameMode={gameMode}
              // Pass the player's calculated mastery rank name based on points
              masteryRank={getMasteryRankName(brawlerStates[selectedBrawler].masteryPoints)}
          />
      )}
      
      {status === GameStatus.PLAYING && club && (
        <GameCanvas 
            playerType={selectedBrawler} 
            playerName={playerName}
            onGameOver={handleGameOver}
            playerLevel={brawlerStates[selectedBrawler].level}
            botNames={club.members.filter(m => !m.isPlayer).map(m => m.name)}
            currentSkin={brawlerStates[selectedBrawler].currentSkin}
            gameMode={gameMode}
            activeStarPower={brawlerStates[selectedBrawler].selectedStarPower}
        />
      )}

      {status === GameStatus.PLAYING && !club && (
          <GameCanvas 
            playerType={selectedBrawler} 
            playerName={playerName}
            onGameOver={handleGameOver}
            playerLevel={brawlerStates[selectedBrawler].level}
            botNames={MOCK_BOT_NAMES}
            currentSkin={brawlerStates[selectedBrawler].currentSkin}
            gameMode={gameMode}
            activeStarPower={brawlerStates[selectedBrawler].selectedStarPower}
        />
      )}

      {status === GameStatus.GAME_OVER && lastStats && (
        <>
            <div className="absolute inset-0 -z-10 bg-slate-900" />
            <GameOver 
                stats={lastStats} 
                totalTrophies={totalTrophies}
                onRestart={handleRestart} 
                onHome={handleHome}
                playerBrawlerType={selectedBrawler}
            />
        </>
      )}
    </div>
  );
};

export default App;
