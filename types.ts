
export interface Vector2 {
  x: number;
  y: number;
}

export enum GameStatus {
  LOBBY = 'LOBBY',
  INTRO = 'INTRO', // Added for Battle Card animation
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export enum GameMode {
  SOLO = 'SOLO',
  DUO = 'DUO',
  KNOCKOUT = 'KNOCKOUT'
}

export enum BrawlerType {
  SHELLY = 'SHELLY', // Shotgun
  COLT = 'COLT',     // Rapid fire
  EL_PRIMO = 'EL_PRIMO', // Melee/Tank
  DYNAMIKE = 'DYNAMIKE', // Thrower/Explosive
  NITA = 'NITA',     // Mid-range Shockwave
  BULL = 'BULL',     // Tank Shotgun
  BROCK = 'BROCK',   // Long range Rocket
  BARLEY = 'BARLEY',  // Thrower/Poison
  EDGAR = 'EDGAR',    // Melee/Lifesteal
  STU = 'STU',        // Fast/Double Shot
  SPIKE = 'SPIKE',    // Legendary Cactus
  INFERNO = 'INFERNO', // NEW: Fire/Burn Specialist
  FROSTBITE = 'FROSTBITE', // NEW: Ice Tank
  VOLT = 'VOLT', // NEW: Electric Speedster
  SPECTRE = 'SPECTRE', // NEW: Ghost Assassin
  AXEL = 'AXEL', // NEW: Super Rare Spinner
  VEGA = 'VEGA'  // NEW: Super Rare Sound Specialist
}

export enum BrawlerRarity {
    COMMON = 'COMMON',       // Başlangıç (Aşırı Açık Mavi)
    RARE = 'RARE',           // Ender (Yeşil)
    SUPER_RARE = 'SUPER_RARE', // Süper Ender (Mavi)
    EPIC = 'EPIC',           // Destansı (Mor)
    MYTHIC = 'MYTHIC',       // Gizemli (Kırmızı)
    LEGENDARY = 'LEGENDARY'  // Efsanevi (Sarı)
}

export enum EmoteType {
    HAPPY = 'HAPPY',
    SAD = 'SAD',
    ANGRY = 'ANGRY',
    THUMBS_UP = 'THUMBS_UP',
    SURPRISED = 'SURPRISED'
}

export interface TeamMember {
    id: string;
    name: string;
    brawler: BrawlerType;
    skin?: string;
    isReady: boolean;
    isLeader: boolean;
}

export interface StarPower {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name or image ref
}

export interface BrawlerState {
    level: number;
    powerPoints: number;
    currentSkin?: string; // 'DEFAULT' or other skin ID
    unlockedSkins: string[]; // List of unlocked skin IDs
    unlockedStarPowers: string[]; // List of unlocked Star Power IDs
    selectedStarPower?: string; // Currently equipped MS
    masteryPoints: number; // NEW: Mastery Points
}

export interface BattleCardData {
    icon1: string;
    icon2: string;
    pin: string; // seed string for dicebear
    pinImage?: string; // Base64 string for custom uploaded image
    title?: string; // Player Title (Ünvan)
}

export interface BrawlerConfig {
  name: string;
  type: BrawlerType;
  rarity: BrawlerRarity;
  color: string; // Projectile/Model color
  maxHealth: number;
  speed: number;
  damage: number;
  range: number; // For shooting
  reloadSpeed: number;
  projectileCount: number;
  spread: number;
  projectileSpeed: number;
  starPowers: StarPower[]; // Available SPs
}

export interface Entity {
  id: string;
  pos: Vector2;
  radius: number;
  active: boolean;
}

export interface Wall {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'STONE' | 'BUSH' | 'WATER' | 'BARREL'; // Visual type
}

export interface Character extends Entity {
  name: string; 
  type: BrawlerType;
  health: number;
  maxHealth: number;
  team: 'blue' | 'red'; 
  teamId: number; 
  velocity: Vector2;
  angle: number;
  ammo: number;
  maxAmmo: number;
  powerCubes: number; 
  lastShotTime: number;
  lastDamageTime: number; 
  spawnShieldEndTime: number; 
  respawnEndTime: number; 
  level: number; 
  config: BrawlerConfig;
  skin?: string;
  
  // Super System
  superCharge: number; // 0 to 100
  isSuperActive?: boolean; // For duration based supers like Bull Charge
  superEndTime?: number;
  
  // Star Power Logic
  activeStarPower?: string;
  starPowerCooldown?: number; // For cooldown based SPs like Band-Aid
  burnEndTime?: number; // For El Fuego effect
  
  // Emote System
  activeEmote?: EmoteType;
  emoteEndTime?: number;

  // Poison Logic
  lastPoisonTick?: number;
  poisonTicks?: number; // Gazda geçirilen süre sayacı
}

export interface Box extends Entity {
  health: number;
  maxHealth: number;
}

export interface Projectile extends Entity {
  velocity: Vector2; 
  damage: number;
  teamId: number; 
  ownerId: string; 
  color: string;
  skin?: string;
  
  isLobbed?: boolean;
  startPos?: Vector2;
  targetPos?: Vector2;
  startTime?: number;
  flightDuration?: number;
  aoeRadius?: number;
  maxRange?: number; // Added for limit checking
  
  // Super Properties
  isSuper?: boolean;
  isWallBreaker?: boolean;

  // SP Effects
  burnEffect?: boolean; // El Fuego
  leavePool?: boolean; // Incendiary
}

export interface AreaEffect extends Entity {
    damage: number;
    teamId: number;
    ownerId: string;
    spawnTime: number;
    duration: number;
    color: string;
    tickRate: number; // ne kadar sürede bir hasar vuracağı (ms)
    isSuper?: boolean; // Is this a super effect (e.g. Spike Super)
    slowEffect?: boolean; // Spike Super
}

export interface PowerCube extends Entity {
  spawnTime: number;
  value: number; 
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'DUST' | 'SPARK' | 'SMOKE' | 'TEXT' | 'SHARD' | 'MUZZLE' | 'RIPPLE' | 'GAS';
  text?: string;
  gravity?: number;
}

export interface TeammateStats {
    type: BrawlerType;
    skin?: string;
    name: string;
}

export interface GameStats {
  kills: number;
  powerCubesCollected: number;
  duration: number;
  rank: number; 
  totalPlayers: number;
  brawlerName: string; 
  playerName: string; 
  trophyChange: number; 
  // Legacy support for single teammate (Duo)
  teammateType?: BrawlerType; 
  teammateSkin?: string; 
  teammateName?: string; 
  // New support for multiple teammates (Knockout/3v3)
  teammates?: TeammateStats[];
  roundsWon?: number;
  roundsLost?: number;
  masteryPointsGained?: number; // NEW
}

export interface ClubMember {
  id: string;
  name: string;
  role: 'BAŞKAN' | 'KIDEMLİ ÜYE' | 'ÜYE';
  trophies: number;
  icon: string;
  status: string;
  isPlayer: boolean;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  badge: string; 
  requiredTrophies: number;
  totalTrophies: number;
  members: ClubMember[];
}

export interface ChatMessage {
    id: string;
    senderName: string;
    text: string;
    role: string;
    isPlayer: boolean;
    timestamp: string;
    type?: 'TEXT' | 'INVITE';
    inviteData?: {
        mode: GameMode;
        map: string;
    };
}

export interface TrophyReward {
    id: number;
    trophies: number;
    type: 'GOLD' | 'BIG_BOX' | 'MEGA_BOX' | 'POWER_POINTS';
    amount: number; 
    label: string;
}

export interface Friend {
  id: string;
  name: string;
  icon: string;
  status: string; 
  trophies: number;
  isOnline: boolean;
}

export interface LeaderboardEntry {
    rank: number;
    id: string;
    name: string;
    trophies: number;
    icon: string;
    club: string;
    totalSpent?: number; // NEW: For "Zenginler" leaderboard
}

export interface ShopOffer {
    id: string;
    type: 'SKIN' | 'DAILY' | 'SPECIAL' | 'LEVEL_UP' | 'GEMS_PACK';
    rewardType: 'GOLD' | 'POWER_POINTS' | 'GEMS' | 'SKIN' | 'MEGA_BOX' | 'BIG_BOX';
    amount: number;
    costType: 'GEMS' | 'GOLD' | 'FREE' | 'REAL_MONEY';
    cost: number;
    originalCost?: number;
    title: string;
    tag?: string;
    colorTheme: 'PINK' | 'ORANGE' | 'BLUE' | 'PURPLE' | 'GREEN' | 'RED';
    skinId?: string;
    brawlerType?: BrawlerType;
    priceLabel?: string;
}

export interface Reward {
    type: 'GOLD' | 'POWER_POINTS' | 'BRAWLER' | 'GEMS' | 'BIG_BOX' | 'MEGA_BOX' | 'BRAWLER_SKIN';
    value: number | string;
    amount?: number;
    label?: string;
    extra?: {
        type: string;
        amount: number;
        target: string;
    };
}

export interface BrawlPassReward {
    type: 'GOLD' | 'BIG_BOX' | 'MEGA_BOX' | 'POWER_POINTS' | 'GEMS' | 'BRAWLER_SKIN';
    amount: number;
    label?: string;
    value?: string;
}

export interface BrawlPassTier {
    tier: number;
    requiredTokens: number;
    freeReward: BrawlPassReward;
    paidReward: BrawlPassReward;
}

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    type: 'UPDATE' | 'EVENT' | 'MAINTENANCE' | 'COMMUNITY';
    date: string;
    isHero?: boolean;
    linkText?: string;
    imageUrl?: string;
}

export interface Quest {
    id: string;
    description: string;
    currentProgress: number;
    goal: number;
    rewardTokens: number;
    type: 'SEASON' | 'EXCLUSIVE';
    iconType: 'KILL' | 'HEAL' | 'DAMAGE' | 'WIN' | 'PLAY';
    brawlerType?: BrawlerType;
    brawlerName?: string;
    timeLeft?: string;
    isNew?: boolean;
}
