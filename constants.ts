
import { BrawlerConfig, BrawlerType, TrophyReward, Friend, ShopOffer, ChatMessage, BrawlPassTier, BrawlerRarity, BrawlPassReward, NewsItem, Quest, LeaderboardEntry, Club, ClubMember } from "./types";

export const CANVAS_WIDTH = 800; // VIEWPORT WIDTH
export const CANVAS_HEIGHT = 800; // VIEWPORT HEIGHT

// NEW MAP CONSTANTS
export const MAP_WIDTH = 2400; 
export const MAP_HEIGHT = 2400;
export const WALL_COUNT = 50; 
export const WALL_SIZE = 60;

// Showdown Config
export const TOTAL_TEAMS_SOLO = 50; // Changed to 50 players
export const TOTAL_TEAMS_DUO = 25; // Changed to 25 teams (50 players)
export const MATCH_START_COUNTDOWN = 5; // saniye

// Poison Cloud Config
export const POISON_START_DELAY = 8000; // 8 seconds before gas starts moving
export const POISON_SHRINK_SPEED = 30; // Pixels per second (radius reduction)
export const POISON_DAMAGE = 1000;
export const POISON_DAMAGE_INCREMENT = 500; // Her saniye eklenecek ekstra hasar
export const POISON_TICK_RATE = 1000; // 1 second

// Knockout Config
export const TOTAL_TEAMS_KNOCKOUT = 2; // 2 Teams (3v3)
export const KNOCKOUT_ROUNDS_TO_WIN = 2; // Best of 3
export const KNOCKOUT_ROUND_DELAY = 3000; // Time between rounds

export const BOX_COUNT = 30; // Increased box count for larger map
export const BOX_HEALTH = 1500;
export const POWER_CUBE_HEALTH_BONUS = 400;
export const POWER_CUBE_DAMAGE_FACTOR = 0.10; 
export const SPAWN_SHIELD_DURATION = 3000; 
export const DUO_RESPAWN_TIME = 250; 

// Dynamike / Thrower Config
export const DYNAMIKE_BLAST_RADIUS = 60;
export const THROW_FLIGHT_DURATION = 600; 

// Healing Config
export const HEAL_DELAY = 3000; 
export const HEAL_RATE_PER_SEC = 0.13; 

// Leveling Config
export const MAX_LEVEL = 11;
export const LEVEL_STAT_BONUS = 0.10; 
export const STAR_POWER_UNLOCK_LEVEL = 9;
export const STAR_POWER_COST = 2000;

export const UPGRADE_COSTS = [
    { pp: 20, gold: 20 },    
    { pp: 30, gold: 35 },    
    { pp: 50, gold: 75 },    
    { pp: 80, gold: 140 },   
    { pp: 130, gold: 290 },  
    { pp: 210, gold: 480 },  
    { pp: 340, gold: 800 },  
    { pp: 550, gold: 1250 }, 
    { pp: 890, gold: 1875 }, 
    { pp: 1440, gold: 2800 } 
];

// --- MASTERY SYSTEM ---
export const MASTERY_LEVELS = [
    { name: 'BRONZ I', minPoints: 0, color: '#cd7f32' },
    { name: 'BRONZ II', minPoints: 300, color: '#cd7f32' },
    { name: 'BRONZ III', minPoints: 800, color: '#cd7f32' },
    { name: 'GÜMÜŞ I', minPoints: 1500, color: '#c0c0c0' },
    { name: 'GÜMÜŞ II', minPoints: 2300, color: '#c0c0c0' },
    { name: 'GÜMÜŞ III', minPoints: 3200, color: '#c0c0c0' },
    { name: 'ALTIN I', minPoints: 4200, color: '#fbbf24' },
    { name: 'ALTIN II', minPoints: 5400, color: '#fbbf24' },
    { name: 'ALTIN III', minPoints: 6800, color: '#fbbf24' },
    { name: 'USTALIK', minPoints: 8500, color: '#a855f7' } // Diamond/Purple
];

export const MASTERY_POINTS_PER_WIN = 50; // Base points for a win/rank 1
export const MASTERY_POINTS_PER_RANK_2 = 30;
export const MASTERY_POINTS_PER_RANK_3 = 15;

// Economy Config
export const BRAWL_BOX_COST = 100; // Gold
export const BIG_BOX_COST_GEMS = 30; // Gems
export const MEGA_BOX_COST_GEMS = 80; // Gems

export const BRAWL_PASS_COST = 169;
export const GOLD_REWARD_RANK_1 = 20;
export const GOLD_REWARD_RANK_2 = 15;
export const GOLD_REWARD_RANK_3 = 10;
export const GOLD_REWARD_PARTICIPATION = 5; 

// --- PLAYER TITLES ---
export const PLAYER_TITLES = [
    "YILDIZ OYUNCU",
    "SAVAŞ MAKİNESİ",
    "KESKİN NİŞANCI",
    "EFSANE",
    "YIKIM EKİBİ",
    "SESSİZ KATİL",
    "KRAL",
    "KRALİÇE",
    "BOSS",
    "USTA",
    "ÇILGIN",
    "PRO",
    "AVCI",
    "YARATIK",
    "DOĞAÜSTÜ",
    "ALTIN KOL",
    "HIZLI VE ÖFKELİ",
    "KORKUSUZ",
    "GECE BEKÇİSİ",
    "YENİLMEZ",
    "TOKSİK",
    "HAYALET",
    "KOMUTAN",
    "ŞAMPİYON"
];

// --- RARITY INFO ---
export const RARITY_INFO: Record<BrawlerRarity, { label: string, color: string, bgGradient: string }> = {
    [BrawlerRarity.COMMON]: { 
        label: 'BAŞLANGIÇ', 
        color: '#b0e0e6', // Powder Blue (Shelly)
        bgGradient: 'from-[#b0e0e6] to-[#5f9ea0]' 
    },
    [BrawlerRarity.RARE]: { 
        label: 'ENDER', 
        color: '#22c55e', // Green (Colt, El Primo)
        bgGradient: 'from-[#4ade80] to-[#166534]'
    },
    [BrawlerRarity.SUPER_RARE]: { 
        label: 'SÜPER ENDER', 
        color: '#3b82f6', // Blue (Dynamike)
        bgGradient: 'from-[#60a5fa] to-[#1e40af]'
    },
    [BrawlerRarity.EPIC]: { label: 'DESTANSI', color: '#a855f7', bgGradient: 'from-[#c084fc] to-[#6b21a8]' },
    [BrawlerRarity.MYTHIC]: { label: 'GİZEMLİ', color: '#ef4444', bgGradient: 'from-[#f87171] to-[#991b1b]' },
    [BrawlerRarity.LEGENDARY]: { label: 'EFSANEVİ', color: '#eab308', bgGradient: 'from-[#facc15] to-[#ca8a04]' }
};

// --- BRAWLERS CONFIG ---
export const BRAWLERS: Record<BrawlerType, BrawlerConfig> = {
  [BrawlerType.SHELLY]: {
    name: 'SHELLY',
    type: BrawlerType.SHELLY,
    rarity: BrawlerRarity.COMMON,
    color: '#b0e0e6', 
    maxHealth: 3800,
    speed: 2.8,
    damage: 300, 
    range: 200,
    reloadSpeed: 1000, 
    projectileCount: 5, 
    spread: 0.25,
    projectileSpeed: 8,
    starPowers: [
        { id: 'BAND_AID', name: 'YARA BANDI', description: 'Canın %40\'ın altına düştüğünde anında iyileşirsin. (20sn Süre)', icon: 'HEART' }
    ]
  },
  [BrawlerType.COLT]: {
    name: 'COLT',
    type: BrawlerType.COLT,
    rarity: BrawlerRarity.RARE,
    color: '#f87171',
    maxHealth: 2800,
    speed: 3.0,
    damage: 360, 
    range: 350,
    reloadSpeed: 80, 
    projectileCount: 1, 
    spread: 0,
    projectileSpeed: 12,
    starPowers: [
        { id: 'SLICK_BOOTS', name: 'HIZLI ÇİZMELER', description: 'Colt\'un hareket hızı %15 artar.', icon: 'ZAP' }
    ]
  },
  [BrawlerType.EL_PRIMO]: {
    name: 'EL PRIMO',
    type: BrawlerType.EL_PRIMO,
    rarity: BrawlerRarity.RARE,
    color: '#3b82f6',
    maxHealth: 5800, 
    speed: 3.2, 
    damage: 400,
    range: 80, 
    reloadSpeed: 600, 
    projectileCount: 1, 
    spread: 0,
    projectileSpeed: 15,
    starPowers: [
        { id: 'EL_FUEGO', name: 'EL FUEGO', description: 'Yumrukların rakipleri yakar ve 4 saniye boyunca hasar verir.', icon: 'FLAME' }
    ] 
  },
  [BrawlerType.DYNAMIKE]: {
      name: 'DYNAMIKE',
      type: BrawlerType.DYNAMIKE,
      rarity: BrawlerRarity.SUPER_RARE,
      color: '#ef4444',
      maxHealth: 2800,
      speed: 2.9,
      damage: 800, 
      range: 250,
      reloadSpeed: 1200, 
      projectileCount: 1, 
      spread: 0,
      projectileSpeed: 0,
      starPowers: [
          { id: 'DEMOLITION', name: 'PATLAYICI', description: 'Dinamitlerin patlama alanı %20 daha geniştir.', icon: 'BOMB' }
      ]
  },
  [BrawlerType.NITA]: {
    name: 'NITA',
    type: BrawlerType.NITA,
    rarity: BrawlerRarity.COMMON,
    color: '#ef4444',
    maxHealth: 4000,
    speed: 2.8,
    damage: 800, 
    range: 180,
    reloadSpeed: 1100, 
    projectileCount: 1, 
    spread: 0,
    projectileSpeed: 9,
    starPowers: [
        { id: 'HYPER_BEAR', name: 'HİPER AYI', description: 'Nita\'nın saldırı hızı %20 artar.', icon: 'SKULL' }
    ]
  },
  [BrawlerType.BULL]: {
    name: 'BULL',
    type: BrawlerType.BULL,
    rarity: BrawlerRarity.COMMON, 
    color: '#3b82f6', 
    maxHealth: 5000,
    speed: 3.1, 
    damage: 400, 
    range: 150,
    reloadSpeed: 1400, 
    projectileCount: 5, 
    spread: 0.3,
    projectileSpeed: 9,
    starPowers: [
        { id: 'BERSERKER', name: 'ZIRHLI', description: 'Canın %40\'ın altına düştüğünde mermi doldurma hızın iki katına çıkar.', icon: 'SHIELD' }
    ]
  },
  [BrawlerType.BROCK]: {
    name: 'BROCK',
    type: BrawlerType.BROCK,
    rarity: BrawlerRarity.RARE, 
    color: '#3b82f6',
    maxHealth: 2400,
    speed: 2.8,
    damage: 1100, 
    range: 400,
    reloadSpeed: 1500, 
    projectileCount: 1, 
    spread: 0,
    projectileSpeed: 11,
    starPowers: [
        { id: 'INCENDIARY', name: 'ROKET NO.4', description: 'Roketler patladığı yerde yakıcı bir alan bırakır.', icon: 'FLAME' }
    ]
  },
  [BrawlerType.BARLEY]: {
    name: 'BARLEY',
    type: BrawlerType.BARLEY,
    rarity: BrawlerRarity.RARE,
    color: '#eab308',
    maxHealth: 2400,
    speed: 2.8,
    damage: 700, 
    range: 250,
    reloadSpeed: 1300, 
    projectileCount: 1, 
    spread: 0,
    projectileSpeed: 0,
    starPowers: [
        { id: 'MEDICAL_USE', name: 'TIBBİ KULLANIM', description: 'Her saldırıda 400 can iyileşirsin.', icon: 'HEART' }
    ]
  },
  [BrawlerType.EDGAR]: {
    name: 'EDGAR',
    type: BrawlerType.EDGAR,
    rarity: BrawlerRarity.EPIC,
    color: '#1a1a1a', // Dark theme
    maxHealth: 3000,
    speed: 3.4, // Very Fast
    damage: 540,
    range: 100, // Short range (melee)
    reloadSpeed: 100, // Extremely Fast!
    projectileCount: 2, // 2 punches
    spread: 0.2,
    projectileSpeed: 14,
    starPowers: [
        { id: 'FISTICUFFS', name: 'YUMRUKLAŞMA', description: 'Vuruşlardan kazandığın iyileşme %50 olur.', icon: 'ZAP' }
    ]
  },
  [BrawlerType.STU]: {
    name: 'STU',
    type: BrawlerType.STU,
    rarity: BrawlerRarity.EPIC,
    color: '#0ea5e9', // Cyan/Blue
    maxHealth: 3200,
    speed: 3.2, // Fast
    damage: 580,
    range: 300,
    reloadSpeed: 350, // Fast reload
    projectileCount: 2, // Double shot
    spread: 0.1,
    projectileSpeed: 13,
    starPowers: [
        { id: 'GASO_HEAL', name: 'GAZ ŞİFASI', description: 'Her isabetli vuruşta 200 can yenilersin.', icon: 'HEART' }
    ]
  },
  [BrawlerType.SPIKE]: {
    name: 'SPIKE',
    type: BrawlerType.SPIKE,
    rarity: BrawlerRarity.LEGENDARY,
    color: '#4ade80', // Green
    maxHealth: 2400,
    speed: 2.9,
    damage: 1200,
    range: 280,
    reloadSpeed: 1100,
    projectileCount: 1, // Simulating the grenade
    spread: 0,
    projectileSpeed: 10,
    starPowers: [
        { id: 'FERTILIZE', name: 'GÜBRELE', description: 'Spike her saldırı yaptığında 400 can yeniler.', icon: 'HEART' }
    ]
  },
  [BrawlerType.INFERNO]: {
    name: 'INFERNO',
    type: BrawlerType.INFERNO,
    rarity: BrawlerRarity.MYTHIC,
    color: '#b91c1c', // Dark Red
    maxHealth: 4400, // Tanky
    speed: 2.9,
    damage: 220, // Low damage per projectile, but fires 4
    range: 180, // Short range
    reloadSpeed: 800, // Fast reload
    projectileCount: 4, // Spray
    spread: 0.35,
    projectileSpeed: 8,
    starPowers: [
        { id: 'MAGMA_STEPS', name: 'MAGMA İZLERİ', description: 'Saldırıların yerde hasar veren lav havuzları oluşturur.', icon: 'FLAME' }
    ]
  },
  [BrawlerType.FROSTBITE]: {
    name: 'FROSTBITE',
    type: BrawlerType.FROSTBITE,
    rarity: BrawlerRarity.EPIC,
    color: '#06b6d4', // Cyan
    maxHealth: 4800, // Tanky
    speed: 2.7, // Slow
    damage: 640,
    range: 220,
    reloadSpeed: 1400, // Slow reload
    projectileCount: 3, // Shotgun style but icy
    spread: 0.2,
    projectileSpeed: 9,
    starPowers: [
        { id: 'PERMAFROST', name: 'PERMAFROST', description: 'Maksimum sağlığın 1000 puan artar.', icon: 'SHIELD' }
    ]
  },
  [BrawlerType.VOLT]: {
    name: 'VOLT',
    type: BrawlerType.VOLT,
    rarity: BrawlerRarity.MYTHIC,
    color: '#a855f7', // Purple
    maxHealth: 2600, // Squishy
    speed: 3.3, // Very Fast
    damage: 980,
    range: 320,
    reloadSpeed: 900, // Fast reload
    projectileCount: 1,
    spread: 0,
    projectileSpeed: 14,
    starPowers: [
        { id: 'OVERCHARGE', name: 'AŞIRI YÜK', description: 'Mermi dolum hızın %30 artar.', icon: 'ZAP' }
    ]
  },
  [BrawlerType.SPECTRE]: {
    name: 'SPECTRE',
    type: BrawlerType.SPECTRE,
    rarity: BrawlerRarity.LEGENDARY,
    color: '#a855f7', // Purple/Ghostly
    maxHealth: 3400,
    speed: 3.3,
    damage: 950,
    range: 260,
    reloadSpeed: 1100,
    projectileCount: 1,
    spread: 0,
    projectileSpeed: 16,
    starPowers: [
        { id: 'HAUNTED', name: 'MUSALLAT', description: 'Spectre mermileri isabet ettiğinde rakibi 2 saniye boyunca %20 yavaşlatır.', icon: 'GHOST' }
    ]
  },
  [BrawlerType.AXEL]: {
    name: 'AXEL',
    type: BrawlerType.AXEL,
    rarity: BrawlerRarity.SUPER_RARE,
    color: '#f97316', // Orange
    maxHealth: 3200,
    speed: 3.0,
    damage: 720,
    range: 180, // Mid-short range
    reloadSpeed: 1100,
    projectileCount: 1,
    spread: 0,
    projectileSpeed: 14,
    starPowers: [
        { id: 'SHARP_EDGE', name: 'KESKİN KENAR', description: 'Testere bıçakları rakipleri %15 daha fazla kanatır (hasar artışı).', icon: 'SWORD' }
    ]
  },
  [BrawlerType.VEGA]: {
    name: 'VEGA',
    type: BrawlerType.VEGA,
    rarity: BrawlerRarity.SUPER_RARE,
    color: '#06b6d4', // Cyan
    maxHealth: 3000,
    speed: 3.2,
    damage: 280, // Per pulse
    range: 160, // Short wide range
    reloadSpeed: 900,
    projectileCount: 3, // Wide spread sound waves
    spread: 0.4,
    projectileSpeed: 10,
    starPowers: [
        { id: 'LOUD_BASS', name: 'YÜKSEK BAS', description: 'Saldırıların rakipleri daha uzağa iter.', icon: 'MUSIC' }
    ]
  }
};

// --- GAME TIPS ---
export const GAME_TIPS = [
    "Çalıları kontrol etmeyi unutma! Bir düşman saklanıyor olabilir.",
    "Enerji küpleri hem sağlığını hem de hasarını artırır.",
    "Otomatik nişan yakın mesafede çok etkilidir, uzakta manuel nişan al.",
    "Canın azaldığında çatışmadan kaçın ve iyileşmeyi bekle.",
    "Duvarların arkasına saklanarak düşman ateşinden korunabilirsin.",
    "Takım oyununda (Duo/Nakavt) arkadaşını yalnız bırakma!",
    "Kutuları kırmak sana avantaj sağlar, ama etrafına dikkat et.",
    "Yıldız Güçleri 9. seviyeden sonra açılır ve büyük avantaj sağlar!",
    "Zehir bulutundan uzak dur! Zamanla alan daralır."
];

export const BRAWLER_TIPS: Record<BrawlerType, string> = {
    [BrawlerType.SHELLY]: "Yakın mesafede ölümcül hasar verirsin. Yara Bandı seni zor durumlardan kurtarır!",
    [BrawlerType.COLT]: "Uzun menzilini kullan. Hızlı Çizmeler ile mermilerden kaçmak daha kolaydır.",
    [BrawlerType.EL_PRIMO]: "Yüksek canın var. El Fuego ile rakiplerinin canını yavaşça erit!",
    [BrawlerType.DYNAMIKE]: "Duvarların üzerinden atış yap. Patlayıcı gücünle alan kontrolü sende.",
    [BrawlerType.NITA]: "Vuruşların duvarlardan geçmez ama alan hasarı verir. Hiper Ayı ile daha hızlı saldır.",
    [BrawlerType.BULL]: "Çalılarda bekle. Zırhlı olduğunda daha hızlı mermi doldurursun, pes etme!",
    [BrawlerType.BROCK]: "Roketlerin çok uzağa gider. Yakıcı alanlar ile rakibin yolunu kes.",
    [BrawlerType.BARLEY]: "Şişelerin zehirli alan bırakır. Tıbbi Kullanım ile savaşırken iyileşebilirsin.",
    [BrawlerType.EDGAR]: "Vurdukça iyileşirsin! Yumruklaşma yıldız gücü ile ölümsüz gibi hissedebilirsin.",
    [BrawlerType.STU]: "Hızlı doldurma süren var. Gaz Şifası ile her vuruşta hayatta kal.",
    [BrawlerType.SPIKE]: "Dikenli bomban patladığında etrafa saçılır. Gübrele yıldız gücü ile hayatta kal!",
    [BrawlerType.INFERNO]: "Alevlerin rakipleri yakar! Magma İzleri ile alanı lavlarla kapla.",
    [BrawlerType.FROSTBITE]: "Buzul gücünü kullanarak rakiplerini dondur. Permafrost ile devasa bir tanka dönüş!",
    [BrawlerType.VOLT]: "Hızın en büyük silahın. Vur ve kaç taktiğini kullan, Aşırı Yük ile mermilerin hiç bitmesin!",
    [BrawlerType.SPECTRE]: "Hızlı saldırılarınla rakiplerini şaşırt. Süper gücünle anında ışınlanarak tehlikeden kaç veya suikast yap!",
    [BrawlerType.AXEL]: "Testere bıçakların rakiplerin içinden geçer. Süper gücünle rakiplerin arasına dalıp kaos yarat!",
    [BrawlerType.VEGA]: "Geniş saldırı alanınla rakipleri uzak tut. Süper gücünü kritik anlarda yolu kapatmak için kullan!"
};

// --- MOCK DATA ---

export const MOCK_BOT_NAMES = [
    "DarkLord", "ProPlayer", "LeonMain", "SpikeLover", "Crow", "NoobMaster", 
    "BrawlGod", "Sniper", "Tank", "Healer", "Speedy", "Shadow", "Light",
    "Fire", "Ice", "Storm", "Thunder", "Ninja", "Samurai", "Viking"
];

export const MOCK_FRIENDS: Friend[] = [
    { id: 'f1', name: 'Ada', icon: 'SKULL', status: 'Çevrimiçi', trophies: 30442, isOnline: true },
    { id: 'f2', name: 'Emre', icon: 'ZAP', status: '50 dk önce', trophies: 29047, isOnline: false },
    { id: 'f3', name: 'Ebubekir', icon: 'CROWN', status: '9 sa önce', trophies: 20916, isOnline: false },
    { id: 'f4', name: 'cemar353', icon: 'GHOST', status: '23g önce', trophies: 17335, isOnline: false },
    { id: 'f5', name: 'Yigit', icon: 'SMILE', status: 'Çevrimiçi', trophies: 10093, isOnline: true },
    { id: 'f6', name: 'Can', icon: 'FLAME', status: 'Çevrimiçi', trophies: 8500, isOnline: true },
    { id: 'f7', name: 'Zeynep', icon: 'HEART', status: '1g önce', trophies: 4200, isOnline: false },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: '1', senderName: 'Yıldırım KİNG', text: 'Hoş geldin! Kupa kasmaya devam.', role: 'BAŞKAN', isPlayer: false, timestamp: '12:30' },
    { id: '2', senderName: 'ProGamer', text: 'Biri çift girsin mi?', role: 'KIDEMLİ ÜYE', isPlayer: false, timestamp: '12:35' },
];

// MOCK CLUBS LIST FOR BROWSER
const createMockMembers = (count: number): ClubMember[] => {
    const members: ClubMember[] = [];
    for(let i=0; i<count; i++) {
        members.push({
            id: `m_${Math.random()}`,
            name: MOCK_BOT_NAMES[Math.floor(Math.random() * MOCK_BOT_NAMES.length)],
            role: i===0 ? 'BAŞKAN' : 'ÜYE',
            trophies: Math.floor(Math.random() * 20000),
            icon: 'SKULL',
            status: 'Çevrimdışı',
            isPlayer: false
        });
    }
    return members;
};

export const MOCK_CLUBS_LIST: Club[] = [
    {
        id: 'club_default',
        name: 'Yıldırım KİNG',
        description: 'Herkesi bekleriz aktif üyeler gelsin! Kupa kasanlar buraya.',
        badge: 'SHIELD',
        requiredTrophies: 12000,
        totalTrophies: 540000,
        members: createMockMembers(30)
    },
    {
        id: 'club_1',
        name: 'Türk Yıldızları',
        description: 'Sadece Türk oyuncular. Küfür yasak. Aktiflik şart.',
        badge: 'CROWN',
        requiredTrophies: 20000,
        totalTrophies: 890000,
        members: createMockMembers(28)
    },
    {
        id: 'club_2',
        name: 'Sıradan Oyuncular',
        description: 'Eğlencesine oynuyoruz. Zorunluluk yok.',
        badge: 'SMILE',
        requiredTrophies: 0,
        totalTrophies: 120000,
        members: createMockMembers(15)
    },
    {
        id: 'club_3',
        name: 'PRO GAMERS',
        description: 'E-Spor odaklı takım. Sadece en iyiler.',
        badge: 'SWORD',
        requiredTrophies: 30000,
        totalTrophies: 950000,
        members: createMockMembers(25)
    },
    {
        id: 'club_4',
        name: 'Akademi',
        description: 'Yeni başlayanlar için eğitim kulübü.',
        badge: 'ZAP',
        requiredTrophies: 0,
        totalTrophies: 50000,
        members: createMockMembers(90)
    },
    {
        id: 'club_5',
        name: 'Gece Kuşları',
        description: 'Geceleri aktif olanlar gelsin.',
        badge: 'GHOST',
        requiredTrophies: 15000,
        totalTrophies: 400000,
        members: createMockMembers(22)
    },
    {
        id: 'club_6',
        name: 'Brawl Masters',
        description: 'Usta oyuncuların buluşma noktası.',
        badge: 'STAR',
        requiredTrophies: 25000,
        totalTrophies: 780000,
        members: createMockMembers(29)
    }
];

export const TROPHY_ROAD_REWARDS: TrophyReward[] = [
    { id: 10, trophies: 10, type: 'GOLD', amount: 50, label: '10 KUPA' },
    { id: 50, trophies: 50, type: 'BIG_BOX', amount: 1, label: '50 KUPA' },
    { id: 100, trophies: 100, type: 'GOLD', amount: 100, label: '100 KUPA' },
    { id: 250, trophies: 250, type: 'BIG_BOX', amount: 3, label: '250 KUPA' },
    { id: 500, trophies: 500, type: 'MEGA_BOX', amount: 1, label: '500 KUPA' },
    { id: 1000, trophies: 1000, type: 'POWER_POINTS', amount: 200, label: '1000 KUPA' },
    { id: 2000, trophies: 2000, type: 'GOLD', amount: 500, label: '2000 KUPA' },
    { id: 2500, trophies: 2500, type: 'MEGA_BOX', amount: 2, label: '2500 KUPA' },
    { id: 3000, trophies: 3000, type: 'POWER_POINTS', amount: 500, label: '3000 KUPA' },
    { id: 4000, trophies: 4000, type: 'MEGA_BOX', amount: 3, label: '4000 KUPA' },
    { id: 5000, trophies: 5000, type: 'GOLD', amount: 2000, label: '5000 KUPA' },
    { id: 7500, trophies: 7500, type: 'MEGA_BOX', amount: 5, label: '7500 KUPA' },
    { id: 10000, trophies: 10000, type: 'GOLD', amount: 5000, label: '10000 KUPA' },
    { id: 15000, trophies: 15000, type: 'MEGA_BOX', amount: 10, label: '15000 KUPA' },
    { id: 20000, trophies: 20000, type: 'GOLD', amount: 10000, label: '20000 KUPA' },
];

export const SHOP_OFFERS: ShopOffer[] = [
    {
        id: 'goat_trophy_plus',
        type: 'SPECIAL',
        rewardType: 'GOLD', 
        amount: 1,
        costType: 'REAL_MONEY',
        cost: 0,
        priceLabel: '₺19,999',
        title: 'GOAT KUPASI +',
        tag: '100x KUPA!',
        colorTheme: 'RED'
    },
    {
        id: 'goat_trophy',
        type: 'SPECIAL',
        rewardType: 'GOLD', 
        amount: 1,
        costType: 'REAL_MONEY',
        cost: 0,
        priceLabel: '₺9,999',
        title: 'GOAT KUPASI',
        tag: '10x KUPA!',
        colorTheme: 'ORANGE'
    },
    {
        id: 'mega_deal_49',
        type: 'SPECIAL',
        rewardType: 'MEGA_BOX',
        amount: 49,
        costType: 'GEMS',
        cost: 49,
        originalCost: 3920,
        title: '49 MEGA KUTU',
        tag: 'BUG!?', 
        colorTheme: 'RED'
    },
    // --- SKINS ---
    {
        id: 'skin_colt_challenger',
        type: 'SKIN',
        rewardType: 'SKIN',
        skinId: 'MÜCADELECİ_COLT',
        brawlerType: BrawlerType.COLT,
        amount: 1,
        costType: 'GEMS',
        cost: 149,
        title: 'MÜCADELECİ COLT',
        colorTheme: 'RED'
    },
    {
        id: 'skin_shelly_bandita',
        type: 'SKIN',
        rewardType: 'SKIN',
        skinId: 'BANDITA_SHELLY',
        brawlerType: BrawlerType.SHELLY,
        amount: 1,
        costType: 'GEMS',
        cost: 29,
        title: 'BANDITA SHELLY',
        colorTheme: 'PURPLE'
    },
    {
        id: 'skin_bull_viking',
        type: 'SKIN',
        rewardType: 'SKIN',
        skinId: 'VIKING_BULL',
        brawlerType: BrawlerType.BULL,
        amount: 1,
        costType: 'GEMS',
        cost: 79,
        title: 'VIKING BULL',
        colorTheme: 'ORANGE'
    },
    {
        id: 'skin_brock_beach',
        type: 'SKIN',
        rewardType: 'SKIN',
        skinId: 'BEACH_BROCK',
        brawlerType: BrawlerType.BROCK,
        amount: 1,
        costType: 'GEMS',
        cost: 79,
        title: 'SAHİL BROCK',
        colorTheme: 'BLUE'
    },
    {
        id: 'skin_barley_wizard',
        type: 'SKIN',
        rewardType: 'SKIN',
        skinId: 'WIZARD_BARLEY',
        brawlerType: BrawlerType.BARLEY,
        amount: 1,
        costType: 'GEMS',
        cost: 0,
        priceLabel: 'ÜCRETSİZ', // Special case, or make it cost 29 gems
        title: 'BÜYÜCÜ BARLEY',
        colorTheme: 'BLUE'
    },
    {
        id: 'skin_edgar_quickdraw',
        type: 'SKIN',
        rewardType: 'SKIN',
        skinId: 'QUICKDRAW_EDGAR',
        brawlerType: BrawlerType.EDGAR,
        amount: 1,
        costType: 'GEMS',
        cost: 79,
        title: 'SİLAHŞOR EDGAR',
        colorTheme: 'RED'
    },
    {
        id: 'skin_colt_challenger_money',
        type: 'SKIN',
        rewardType: 'SKIN',
        skinId: 'MÜCADELECİ_COLT',
        brawlerType: BrawlerType.COLT,
        amount: 1,
        costType: 'REAL_MONEY',
        cost: 0,
        priceLabel: '₺39.99',
        title: 'MÜCADELECİ COLT',
        colorTheme: 'RED'
    },
    {
        id: 'skin_nita_panda',
        type: 'SKIN',
        rewardType: 'SKIN',
        skinId: 'PANDA_NITA',
        brawlerType: BrawlerType.NITA,
        amount: 1,
        costType: 'GEMS',
        cost: 30,
        title: 'PANDA NITA',
        colorTheme: 'GREEN'
    },
    {
        id: 'skin_el_primo_rey',
        type: 'SKIN',
        rewardType: 'SKIN',
        skinId: 'EL_REY_PRIMO',
        brawlerType: BrawlerType.EL_PRIMO,
        amount: 1,
        costType: 'GEMS',
        cost: 80,
        title: 'EL REY PRIMO',
        colorTheme: 'PURPLE'
    },
    // --- RESOURCES ---
    {
        id: 'daily_free',
        type: 'DAILY',
        rewardType: 'GOLD',
        amount: 25,
        costType: 'FREE',
        cost: 0,
        title: 'GÜNLÜK',
        colorTheme: 'PURPLE'
    },
    {
        id: 'offer_1',
        type: 'SPECIAL',
        rewardType: 'POWER_POINTS',
        amount: 500,
        costType: 'GEMS',
        cost: 29,
        originalCost: 49,
        title: 'ÖZEL TEKLİF',
        tag: '4x DEĞER',
        colorTheme: 'PINK'
    },
    {
        id: 'offer_2',
        type: 'LEVEL_UP',
        rewardType: 'GOLD',
        amount: 2000,
        costType: 'GEMS',
        cost: 49,
        originalCost: 79,
        title: 'SEVİYE PAKETİ',
        tag: '5x DEĞER',
        colorTheme: 'ORANGE'
    },
    {
        id: 'offer_3',
        type: 'LEVEL_UP',
        rewardType: 'POWER_POINTS',
        amount: 1250,
        costType: 'GEMS',
        cost: 79,
        originalCost: 149,
        title: 'GÜÇ PAKETİ',
        tag: '%40 İNDİRİM',
        colorTheme: 'BLUE'
    },
    {
        id: 'gem_pack_1',
        type: 'GEMS_PACK',
        rewardType: 'GEMS',
        amount: 30,
        costType: 'REAL_MONEY',
        cost: 0,
        priceLabel: '₺19.99',
        title: 'AVUÇ DOLUSU',
        colorTheme: 'GREEN'
    },
    {
        id: 'gem_pack_2',
        type: 'GEMS_PACK',
        rewardType: 'GEMS',
        amount: 80,
        costType: 'REAL_MONEY',
        cost: 0,
        priceLabel: '₺49.99',
        title: 'ELMAS KESESİ',
        colorTheme: 'GREEN'
    },
    {
        id: 'gem_pack_3',
        type: 'GEMS_PACK',
        rewardType: 'GEMS',
        amount: 170,
        costType: 'REAL_MONEY',
        cost: 0,
        priceLabel: '₺99.99',
        title: 'ELMAS KUTUSU',
        tag: 'POPÜLER',
        colorTheme: 'GREEN'
    },
    {
        id: 'gem_pack_4',
        type: 'GEMS_PACK',
        rewardType: 'GEMS',
        amount: 360,
        costType: 'REAL_MONEY',
        cost: 0,
        priceLabel: '₺199.99',
        title: 'ELMAS SANDIĞI',
        tag: 'EN İYİ',
        colorTheme: 'GREEN'
    }
];

export const BRAWL_PASS_TIERS: BrawlPassTier[] = [];

// Generate 50 Tiers
for (let i = 1; i <= 50; i++) {
    const isFreeBox = i % 5 === 0;
    const isPaidBigReward = i % 10 === 0;
    
    let freeReward: BrawlPassReward = { type: 'GOLD', amount: 50 };
    if (isFreeBox) freeReward = { type: 'BIG_BOX', amount: 1 };
    
    let paidReward: BrawlPassReward = { type: 'BIG_BOX', amount: 1 };
    if (i === 1) paidReward = { type: 'BRAWLER_SKIN', amount: 1, label: 'BELLHOP_MIKE', value: 'BELLHOP_MIKE' };
    else if (isPaidBigReward) paidReward = { type: 'MEGA_BOX', amount: 1 };
    else if (i % 2 === 0) paidReward = { type: 'POWER_POINTS', amount: 50 };
    else paidReward = { type: 'GOLD', amount: 100 };

    BRAWL_PASS_TIERS.push({
        tier: i,
        requiredTokens: 100 + (i * 10), // increasing difficulty
        freeReward,
        paidReward
    });
}

// --- NEWS MOCK DATA ---
export const MOCK_NEWS: NewsItem[] = [
    {
        id: 'hero_1',
        title: 'BRAWL TALK YAYINDA!',
        description: 'Yeni sezon "Gizemli Köşk" ve yeni karakterler hakkında her şey burada! Hemen izle ve detayları kaçırma.',
        type: 'UPDATE',
        date: '1 SAAT ÖNCE',
        isHero: true,
        linkText: 'BRAWL TALK',
        imageUrl: 'hero_bg' 
    },
    {
        id: 'news_1',
        title: 'GODZILLA BRAWL STARS\'TA!',
        description: 'Şehir tehlikede! Godzilla modunu dene ve ödülleri topla.',
        type: 'EVENT',
        date: '1 SAAT ÖNCE',
        imageUrl: 'event_bg'
    },
    {
        id: 'news_2',
        title: 'DENGE DEĞİŞİKLİKLERİ',
        description: 'Bazı savaşçılar güçlendi, bazıları zayıfladı. Detaylar için tıkla.',
        type: 'MAINTENANCE',
        date: '1 GÜN ÖNCE',
        imageUrl: 'patch_bg'
    },
    {
        id: 'news_3',
        title: 'YENİ KOSTÜMLER GELDİ',
        description: 'Dükkandaki yeni efsanevi kostümleri inceledin mi?',
        type: 'UPDATE',
        date: '2 GÜN ÖNCE',
        imageUrl: 'skin_bg'
    },
    {
        id: 'news_4',
        title: 'TOPLULUK ETKİNLİĞİ',
        description: 'Harita oluşturma yarışması başladı! En iyi haritayı sen yap.',
        type: 'COMMUNITY',
        date: '3 GÜN ÖNCE',
        imageUrl: 'community_bg'
    }
];

// --- MOCK QUESTS ---
export const MOCK_QUESTS: Quest[] = [
    {
        id: 'q1',
        description: 'Defeat 12 enemies with Shelly',
        currentProgress: 0,
        goal: 12,
        rewardTokens: 100,
        type: 'SEASON',
        iconType: 'KILL',
        brawlerType: BrawlerType.SHELLY,
        brawlerName: 'SHELLY',
        timeLeft: '19sa 27dk'
    },
    {
        id: 'q2',
        description: 'Heal 60000 points of health in Solo Showdown',
        currentProgress: 0,
        goal: 60000,
        rewardTokens: 250,
        type: 'SEASON',
        iconType: 'HEAL',
        isNew: true
    },
    {
        id: 'q3',
        description: 'Deal 180000 points of damage with Colt',
        currentProgress: 45000,
        goal: 180000,
        rewardTokens: 250,
        type: 'EXCLUSIVE',
        iconType: 'DAMAGE',
        brawlerType: BrawlerType.COLT,
        brawlerName: 'COLT',
        isNew: true
    },
    {
        id: 'q4',
        description: 'Defeat 24 enemies in Duo Showdown',
        currentProgress: 23,
        goal: 24,
        rewardTokens: 250,
        type: 'SEASON',
        iconType: 'KILL',
        isNew: true
    },
    {
        id: 'q5',
        description: 'Win 5 games with El Primo',
        currentProgress: 1,
        goal: 5,
        rewardTokens: 500,
        type: 'SEASON',
        iconType: 'WIN',
        brawlerType: BrawlerType.EL_PRIMO,
        brawlerName: 'EL PRIMO'
    },
    {
        id: 'q6',
        description: 'Deal 100000 damage in Showdown',
        currentProgress: 12500,
        goal: 100000,
        rewardTokens: 500,
        type: 'EXCLUSIVE',
        iconType: 'DAMAGE',
        isNew: true
    }
];

// --- LEADERBOARD MOCK DATA ---
// Helper to generate 200 entries
const generateLeaderboard = (baseList: LeaderboardEntry[], startRank: number, endRank: number, baseTrophy: number) => {
    const icons = ['SKULL', 'CROWN', 'ZAP', 'STAR', 'FLAME', 'SWORD', 'TARGET', 'SHIELD', 'GHOST', 'SMILE'];
    const clubs = ['Navi', 'Tribe', 'ZETA', 'STMN', 'Reply', 'SK', 'Mystic', 'Nova', 'Qlash', 'FUT'];
    const names = ['Pro', 'King', 'Master', 'Legend', 'Ghost', 'Shadow', 'Dark', 'Light', 'Fire', 'Ice', 'Viper', 'Wolf', 'Bear', 'Eagle'];

    const newList = [...baseList];
    
    for (let i = baseList.length + 1; i <= endRank; i++) {
        const randName = names[Math.floor(Math.random() * names.length)] + (Math.floor(Math.random() * 999));
        const randClub = clubs[Math.floor(Math.random() * clubs.length)];
        const randIcon = icons[Math.floor(Math.random() * icons.length)];
        
        // Decreasing trophy count
        const trophy = Math.max(0, baseTrophy - (i * 5) + Math.floor(Math.random() * 10));

        newList.push({
            rank: i,
            id: `bot_lb_${i}`,
            name: randName,
            trophies: trophy,
            icon: randIcon,
            club: randClub
        });
    }
    return newList;
};

// Top 10 Real-ish
const TOP_GLOBAL: LeaderboardEntry[] = [
    { rank: 1, id: 'g1', name: 'Hyra', trophies: 2250, icon: 'SKULL', club: 'Navi' },
    { rank: 2, id: 'g2', name: 'Equaak', trophies: 2180, icon: 'CROWN', club: 'Tribe Gaming' },
    { rank: 3, id: 'g3', name: 'Lenain', trophies: 2120, icon: 'ZAP', club: 'ZETA' },
    { rank: 4, id: 'g4', name: 'Sitetampo', trophies: 2050, icon: 'STAR', club: 'ZETA' },
    { rank: 5, id: 'g5', name: 'Tensai', trophies: 1980, icon: 'FLAME', club: 'Crazy Raccoon' },
    { rank: 6, id: 'g6', name: 'Achapi', trophies: 1950, icon: 'SWORD', club: 'ZETA' },
    { rank: 7, id: 'g7', name: 'Symantec', trophies: 1900, icon: 'TARGET', club: 'SK Gaming' },
    { rank: 8, id: 'g8', name: 'iKaoss', trophies: 1850, icon: 'SHIELD', club: 'SK Gaming' },
    { rank: 9, id: 'g9', name: 'Maury', trophies: 1800, icon: 'GHOST', club: 'Reply Totem' },
    { rank: 10, id: 'g10', name: 'Joker', trophies: 1750, icon: 'SMILE', club: 'Reply Totem' },
];

const TOP_LOCAL: LeaderboardEntry[] = [
    { rank: 1, id: 'l1', name: 'Laz Ali', trophies: 650, icon: 'CROWN', club: 'TR Stars' },
    { rank: 2, id: 'l2', name: 'YB | Ghost', trophies: 620, icon: 'GHOST', club: 'Yıldızlar' },
    { rank: 3, id: 'l3', name: 'Rozetmen', trophies: 590, icon: 'STAR', club: 'Ay Yıldız' },
    { rank: 4, id: 'l4', name: 'Berat', trophies: 560, icon: 'FLAME', club: 'TR Gaming' },
    { rank: 5, id: 'l5', name: 'Ahmet', trophies: 530, icon: 'SWORD', club: 'Anadolu' },
    { rank: 6, id: 'l6', name: 'Mehmet', trophies: 500, icon: 'SHIELD', club: 'Kartallar' },
    { rank: 7, id: 'l7', name: 'Can', trophies: 480, icon: 'ZAP', club: 'Aslanlar' },
    { rank: 8, id: 'l8', name: 'Efe', trophies: 450, icon: 'SKULL', club: 'Fırtına' },
    { rank: 9, id: 'l9', name: 'Arda', trophies: 420, icon: 'TARGET', club: 'Şimşekler' },
    { rank: 10, id: 'l10', name: 'Kerem', trophies: 400, icon: 'HEART', club: 'Efsaneler' },
];

// TOP SPENDERS MOCK DATA
const TOP_SPENDERS: LeaderboardEntry[] = [
    { rank: 1, id: 's1', name: 'Richie Rich', trophies: 5000, icon: 'CROWN', club: 'Whales', totalSpent: 50000 },
    { rank: 2, id: 's2', name: 'Oil Prince', trophies: 4500, icon: 'ZAP', club: 'Dubai', totalSpent: 42000 },
    { rank: 3, id: 's3', name: 'Gem Spender', trophies: 4000, icon: 'STAR', club: 'Supercell', totalSpent: 35000 },
    { rank: 4, id: 's4', name: 'Elon M.', trophies: 3800, icon: 'FLAME', club: 'SpaceX', totalSpent: 30000 },
    { rank: 5, id: 's5', name: 'Gold Digger', trophies: 3500, icon: 'SHIELD', club: 'Miners', totalSpent: 25000 },
];

export const MOCK_LEADERBOARD_GLOBAL = generateLeaderboard(TOP_GLOBAL, 11, 200, 1750);
export const MOCK_LEADERBOARD_LOCAL = generateLeaderboard(TOP_LOCAL, 11, 200, 400);
export const MOCK_LEADERBOARD_SPENDERS = generateLeaderboard(TOP_SPENDERS, 6, 50, 1000).map(e => ({ ...e, totalSpent: Math.floor(Math.random() * 20000) + 1000 }));
