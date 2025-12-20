
import React, { useState, useEffect, useRef } from 'react';
import { 
    BRAWLERS, BRAWL_BOX_COST, BIG_BOX_COST_GEMS, MEGA_BOX_COST_GEMS, 
    UPGRADE_COSTS, MAX_LEVEL, RARITY_INFO, MOCK_FRIENDS,
    TROPHY_ROAD_REWARDS, BRAWL_PASS_TIERS, STAR_POWER_COST, STAR_POWER_UNLOCK_LEVEL, LEVEL_STAT_BONUS, MASTERY_LEVELS
} from '../constants';
import { BrawlerType, BrawlerState, Club, TrophyReward, ShopOffer, Reward, GameMode, BrawlerRarity, StarPower, BattleCardData, TeamMember } from '../types';
import { initAudio, playCollectSound, playPurchaseSound, playClickSound } from '../services/audioService';
import { 
    Sword, Target, Shield, Trophy, Users, X, Skull, 
    Settings, Star, Check, Zap, Crown, Ghost, 
    Smile, Flame, Heart, Sparkles, Palette,
    ShoppingBag, Newspaper, MessageCircle, Menu, Gem, Lock,
    ArrowLeft, ArrowRight, Home, Bomb, Gift, Box,
    Crosshair, Droplet, User, PawPrint, Waves, BarChart2, Info, ChevronLeft, RotateCcw, Badge,
    Gamepad2, Rocket, Music, Sun, Moon, Anchor, Bug, Coffee, Fingerprint
} from 'lucide-react';
import ClubScreen from './ClubScreen';
import TrophyRoadScreen from './TrophyRoadScreen';
import FriendsScreen from './FriendsScreen';
import ShopScreen from './ShopScreen';
import BrawlPassScreen from './BrawlPassScreen';
import NewsScreen from './NewsScreen';
import LeaderboardScreen from './LeaderboardScreen';
import SettingsScreen from './SettingsScreen';
import ProfileScreen from './ProfileScreen';

interface LobbyProps {
  selectedBrawler: BrawlerType;
  onSelectBrawler: (type: BrawlerType) => void;
  onPlay: () => void;
  totalTrophies: number;
  highestTrophies: number;
  gold: number;
  gems: number;
  unlockedBrawlers: BrawlerType[];
  onOpenBox: (type: 'BRAWL' | 'BIG' | 'MEGA') => Reward[] | null; 
  playerName: string;
  onNameChange: (name: string) => void;
  profileIcon: string;
  onProfileIconChange: (iconKey: string) => void;
  soloVictories: number;
  brawlerStates: Record<BrawlerType, BrawlerState>;
  onUpgradeBrawler: (type: BrawlerType) => void;
  club: Club | null; 
  onLeaveClub: () => void;
  onJoinClub: (clubId: string) => void;
  currentPlayerId: string;
  claimedTrophyRewards: number[];
  onClaimTrophyReward: (reward: TrophyReward) => void;
  onBuyShopItem: (offer: ShopOffer) => boolean;
  passProgress: number;
  passTier: number;
  hasBrawlPass: boolean;
  claimedPassFreeRewards: number[];
  claimedPassPaidRewards: number[];
  onClaimPassReward: (tier: number, isPaid: boolean) => Reward[] | null;
  onBuyBrawlPass: () => void;
  onSelectSkin?: (type: BrawlerType, skinId: string) => void;
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  onBuyTier?: () => void;
  onBuyStarPower?: (brawlerType: BrawlerType, starPowerId: string) => void;
  onEquipStarPower?: (brawlerType: BrawlerType, starPowerId: string) => void;
  favoriteBrawler?: BrawlerType;
  onSelectFavoriteBrawler?: (type: BrawlerType) => void;
  battleCard?: BattleCardData;
  onUpdateBattleCard?: (data: BattleCardData) => void;
  teamMembers?: TeamMember[]; // New prop for team lobby state
  onAcceptInvite?: (name: string, brawler: BrawlerType) => void;
  hasGoatMultiplier?: boolean; // Prop for 10x mode
  hasGoatPlusMultiplier?: boolean; // Prop for 100x mode
}

const PROFILE_ICONS: Record<string, React.ElementType> = {
    'SKULL': Skull, 'ZAP': Zap, 'CROWN': Crown, 'GHOST': Ghost,
    'SMILE': Smile, 'FLAME': Flame, 'HEART': Heart, 'STAR': Star,
    'SPARKLES': Sparkles, 'SWORD': Sword, 'TARGET': Target, 'SHIELD': Shield,
    'GAMEPAD': Gamepad2, 'ROCKET': Rocket, 'MUSIC': Music, 'SUN': Sun,
    'MOON': Moon, 'ANCHOR': Anchor, 'BUG': Bug, 'COFFEE': Coffee, 'FINGERPRINT': Fingerprint
};

// Also used for Star Powers
const SP_ICONS = PROFILE_ICONS;

// --- DETAILED BRAWLER RENDERER ---
const DetailedBrawlerFigure = ({ type, skin }: { type: BrawlerType, skin?: string }) => {
    // Character Specific Styles
    const renderContent = () => {
        switch (type) {
            case BrawlerType.SHELLY: return ( <div className="relative w-40 h-60 flex flex-col items-center"><div className="absolute top-0 w-48 h-48 bg-purple-700 rounded-full z-0"></div><div className="absolute top-10 w-32 h-32 bg-[#f0e68c] rounded-full z-10 border-4 border-black"><div className="absolute top-10 left-0 w-full h-10 bg-yellow-400 rotate-[-5deg]"></div><div className="absolute top-14 left-6 w-4 h-4 bg-black rounded-full"></div><div className="absolute top-14 right-6 w-4 h-4 bg-black rounded-full"></div><div className="absolute top-18 left-4 w-6 h-3 bg-pink-300 rotate-12 opacity-80"></div></div><div className="absolute top-0 w-48 h-20 bg-purple-700 rounded-t-full z-20 clip-path-polygon"></div><div className="absolute top-36 w-24 h-24 bg-blue-500 rounded-b-xl z-5 border-4 border-black"><div className="w-full h-full bg-yellow-400 w-8 mx-auto"></div></div><div className="absolute top-24 -right-16 w-12 h-32 bg-slate-700 rotate-[-15deg] border-4 border-black rounded z-20"></div></div> );
            case BrawlerType.COLT: return ( <div className="relative w-40 h-60 flex flex-col items-center"><div className="absolute top-0 w-40 h-40 bg-red-600 rounded-t-xl z-10 skew-x-[-10deg] border-4 border-black"></div><div className="absolute top-12 w-28 h-32 bg-[#f0e68c] rounded-b-xl z-5 border-4 border-black"><div className="absolute top-8 left-6 w-4 h-4 bg-black rounded-full"></div><div className="absolute top-8 right-6 w-4 h-4 bg-black rounded-full"></div><div className="absolute top-0 -left-2 w-4 h-16 bg-red-600"></div><div className="absolute top-0 -right-2 w-4 h-16 bg-red-600"></div></div><div className="absolute top-40 w-24 h-20 bg-blue-600 rounded-xl z-0 border-4 border-black"><div className="w-full h-full bg-red-600 w-4 mx-auto"></div></div><div className="absolute top-20 -left-12 w-10 h-24 bg-slate-400 rotate-12 border-4 border-black"></div><div className="absolute top-20 -right-12 w-10 h-24 bg-slate-400 rotate-[-12deg] border-4 border-black"></div></div> );
            case BrawlerType.EL_PRIMO: return ( <div className="relative w-48 h-64 flex flex-col items-center"><div className="absolute top-0 w-32 h-40 bg-blue-600 rounded-2xl z-10 border-4 border-black overflow-hidden"><div className="absolute top-12 left-4 w-10 h-8 bg-[#eec078] rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div><div className="absolute top-12 right-4 w-10 h-8 bg-[#eec078] rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div><div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#eec078] rounded-lg"></div></div><div className="absolute top-36 w-40 h-28 bg-[#eec078] rounded-xl z-0 border-4 border-black"><div className="absolute top-20 w-full h-8 bg-black"><div className="w-10 h-10 bg-slate-300 rounded-full mx-auto -mt-1 border-2 border-black"></div></div></div></div> );
            case BrawlerType.SPIKE: return ( <div className="relative w-40 h-52 flex flex-col items-center scale-110"><div className="absolute top-10 w-36 h-40 bg-green-500 rounded-[40px] z-10 border-4 border-black"><div className="absolute top-10 left-8 w-6 h-6 bg-black rounded-full"></div><div className="absolute top-10 right-8 w-6 h-6 bg-black rounded-full"></div><div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-10 h-8 bg-black rounded-full"></div></div><div className="absolute top-0 w-16 h-16 bg-red-500 rounded-full z-0 border-4 border-black flex items-center justify-center"><div className="w-6 h-6 bg-yellow-400 rounded-full"></div></div><div className="absolute top-24 -left-10 w-12 h-20 bg-green-500 rounded-full rotate-[-30deg] border-4 border-black"></div><div className="absolute top-24 -right-10 w-12 h-20 bg-green-500 rounded-full rotate-[30deg] border-4 border-black"></div></div> );
            case BrawlerType.DYNAMIKE: return ( <div className="relative w-40 h-60 flex flex-col items-center"><div className="absolute top-0 w-36 h-20 bg-red-600 rounded-t-full z-20 border-4 border-black"><div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 rounded-full"></div></div><div className="absolute top-16 w-28 h-24 bg-[#f0e68c] z-10 border-x-4 border-black"><div className="absolute bottom-0 w-full h-12 bg-white rounded-b-xl"></div><div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-pink-300 rounded-full border-2 border-black"></div></div><div className="absolute top-36 w-24 h-20 bg-red-600 rounded-b-xl z-0 border-4 border-black"></div><div className="absolute top-24 -right-12 w-8 h-24 bg-red-500 border-2 border-black rotate-12 flex flex-col gap-1 items-center p-1"><div className="w-full h-1 bg-black"></div><div className="text-[8px] font-bold text-white">TNT</div></div></div> );
            case BrawlerType.NITA: return ( <div className="relative w-40 h-56 flex flex-col items-center"><div className="absolute top-0 w-44 h-40 bg-red-800 rounded-full z-10 border-4 border-black shadow-lg"><div className="absolute -top-2 -left-2 w-12 h-12 bg-red-800 rounded-full border-4 border-black"></div><div className="absolute -top-2 -right-2 w-12 h-12 bg-red-800 rounded-full border-4 border-black"></div><div className="absolute top-10 left-8 w-6 h-6 bg-black rounded-full border-2 border-white/50"><div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div></div><div className="absolute top-10 right-8 w-6 h-6 bg-black rounded-full border-2 border-white/50"><div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div></div><div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-10 bg-[#fca5a5] rounded-full border-2 border-black/20"><div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-4 bg-black rounded-full"></div></div><div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-16 bg-[#f0e68c] rounded-b-3xl border-x-2 border-b-2 border-black flex flex-col items-center justify-end pb-2"><div className="w-16 h-2 bg-black rounded-full mb-1 opacity-80"></div><div className="w-3 h-3 bg-black rounded-full"></div></div></div><div className="absolute top-36 w-32 h-24 bg-[#0ea5e9] rounded-xl z-0 border-4 border-black flex flex-col items-center"><div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-black mt-4"></div></div></div> );
            case BrawlerType.BULL: return ( <div className="relative w-48 h-60 flex flex-col items-center"><div className="absolute top-0 w-36 h-24 bg-black rounded-t-2xl z-20 border-4 border-black skew-x-[-5deg]"></div><div className="absolute top-16 w-32 h-32 bg-[#eec078] rounded-xl z-10 border-4 border-black"><div className="absolute top-0 -left-2 w-4 h-16 bg-black"></div><div className="absolute top-0 -right-2 w-4 h-16 bg-black"></div><div className="absolute top-8 left-1/2 -translate-x-1/2 w-full flex justify-center gap-6"><div className="w-2 h-1 bg-black rotate-12"></div><div className="w-2 h-1 bg-black -rotate-12"></div></div><div className="absolute top-12 left-6 w-3 h-3 bg-black rounded-full"></div><div className="absolute top-12 right-6 w-3 h-3 bg-black rounded-full"></div><div className="absolute top-20 left-1/2 -translate-x-1/2 w-6 h-6 border-4 border-yellow-400 rounded-full"></div></div><div className="absolute top-44 w-44 h-24 bg-[#1e293b] rounded-xl z-0 border-4 border-black flex justify-center"><div className="w-16 h-full bg-white clip-path-polygon"></div><div className="absolute top-4 w-12 h-12 bg-red-600 rounded-full border-2 border-black flex items-center justify-center"><div className="w-8 h-8 bg-black rounded-full"></div></div></div><div className="absolute top-24 -right-16 w-16 h-32 bg-slate-600 border-4 border-black rounded rotate-[-10deg] z-20 flex flex-col items-center"><div className="w-full h-2 bg-black mt-2"></div><div className="w-10 h-10 bg-black rounded-full mt-auto mb-2"></div></div></div> );
            case BrawlerType.BROCK: return ( <div className="relative w-40 h-60 flex flex-col items-center"><div className="absolute top-2 w-32 h-16 bg-black rounded-t-xl z-20 border-x-4 border-t-4 border-black"></div><div className="absolute top-16 w-28 h-28 bg-[#8d5524] rounded-b-xl z-10 border-4 border-black"><div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-10 flex gap-1"><div className="flex-1 bg-black rounded-sm border border-gray-600"></div><div className="w-2 h-1 bg-black mt-4"></div><div className="flex-1 bg-black rounded-sm border border-gray-600"></div></div><div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-6 border-b-4 border-white rounded-full"></div></div><div className="absolute top-40 w-24 h-24 bg-[#3b82f6] rounded-xl z-0 border-4 border-black flex flex-col items-center"><div className="w-full h-8 bg-black/20 mt-2"></div></div><div className="absolute top-10 -left-16 w-20 h-48 bg-slate-600 border-4 border-black rounded flex flex-col items-center z-30"><div className="w-full h-4 bg-red-500 border-b-2 border-black"></div><div className="w-12 h-12 bg-black rounded-full mt-4 border-4 border-slate-400"></div><div className="w-12 h-12 bg-black rounded-full mt-2 border-4 border-slate-400"></div><div className="w-12 h-12 bg-black rounded-full mt-2 border-4 border-slate-400"></div></div></div> );
            case BrawlerType.BARLEY: return ( <div className="relative w-40 h-60 flex flex-col items-center"><div className="absolute top-0 w-24 h-12 bg-black rounded-t-lg z-30 border-2 border-gray-600"></div><div className="absolute top-10 w-36 h-4 bg-black rounded-full z-30"></div><div className="absolute top-12 w-24 h-24 bg-[#ca8a04] rounded-full z-20 border-4 border-black flex items-center justify-center overflow-hidden"><div className="w-12 h-12 bg-white rounded-full border-4 border-black flex items-center justify-center"><div className="w-4 h-4 bg-black rounded-full"></div></div><div className="absolute bottom-4 w-20 h-8 border-t-4 border-white rounded-full"></div></div><div className="absolute top-32 w-20 h-28 bg-red-700 rounded-xl z-10 border-4 border-black flex flex-col items-center"><div className="w-full h-full bg-[#1e3a8a] w-12 border-x-2 border-black/20"></div><div className="absolute top-2 w-4 h-4 bg-yellow-400 rounded-full border border-black"></div><div className="absolute top-8 w-4 h-4 bg-yellow-400 rounded-full border border-black"></div></div><div className="absolute top-20 -right-12 w-12 h-24 bg-green-500 border-4 border-black rounded-full z-30 flex flex-col items-center justify-center rotate-12 opacity-90"><div className="text-white font-bold text-xs">XXX</div><div className="w-full h-full bg-white/20 absolute top-0 left-0 rounded-full clip-path-wave"></div></div></div> );
            case BrawlerType.EDGAR: return ( <div className="relative w-40 h-60 flex flex-col items-center"><div className="absolute top-0 w-36 h-36 bg-black rounded-full z-30 border-4 border-black overflow-hidden"><div className="absolute bottom-2 right-4 w-16 h-16 bg-[#f0e68c] rounded-full"></div><div className="absolute bottom-8 right-8 w-4 h-4 bg-white rounded-full border-2 border-black flex items-center justify-center"><div className="w-1 h-1 bg-black rounded-full"></div></div><div className="absolute top-0 left-0 w-24 h-36 bg-black rotate-12"></div></div><div className="absolute top-28 w-44 h-16 bg-purple-700 rounded-full z-20 border-4 border-black flex items-center justify-center overflow-hidden"><div className="w-full h-4 bg-white/20 rotate-3"></div><div className="w-full h-4 bg-white/20 rotate-3 mt-2"></div><div className="absolute top-10 -right-4 w-12 h-24 bg-purple-700 border-4 border-black rotate-[-20deg] rounded-b-lg"><div className="w-full h-4 bg-white/20 mt-4"></div><div className="w-full h-4 bg-white/20 mt-4"></div></div><div className="absolute top-10 -left-4 w-12 h-24 bg-purple-700 border-4 border-black rotate-[20deg] rounded-b-lg"><div className="w-full h-4 bg-white/20 mt-4"></div><div className="w-full h-4 bg-white/20 mt-4"></div></div></div><div className="absolute top-36 w-24 h-24 bg-black rounded-xl z-10 border-4 border-black flex flex-col items-center"><div className="w-12 h-12 bg-white/10 rounded-full mt-4"></div></div></div> );
            case BrawlerType.STU: return ( <div className="relative w-40 h-64 flex flex-col items-center"><div className="absolute top-0 w-32 h-32 bg-[#3b82f6] rounded-full z-20 border-4 border-black flex items-center justify-center overflow-hidden"><div className="w-24 h-16 bg-black rounded-full flex items-center justify-center"><div className="w-12 h-12 bg-yellow-400 rounded-full animate-pulse border-2 border-white"><div className="w-4 h-4 bg-white rounded-full absolute top-2 right-2"></div></div></div><div className="absolute top-2 w-full flex justify-between px-4"><div className="w-4 h-4 bg-white clip-path-star"></div><div className="w-4 h-4 bg-white clip-path-star"></div></div></div><div className="absolute top-28 w-28 h-20 bg-red-600 rounded-xl z-10 border-4 border-black flex justify-center"><div className="w-4 h-full bg-white"></div><div className="w-4 h-full bg-white ml-4"></div></div><div className="absolute top-44 w-24 h-24 bg-gray-800 rounded-full z-0 border-8 border-black flex items-center justify-center animate-spin-slow"><div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-black"></div><div className="absolute w-full h-2 bg-black"></div><div className="absolute w-2 h-full bg-black"></div></div><div className="absolute top-32 -left-12 w-12 h-8 bg-gray-600 border-4 border-black rotate-[-20deg]"></div><div className="absolute top-32 -left-16 w-8 h-8 bg-orange-500 rounded-full blur-sm animate-pulse"></div></div> );
            case BrawlerType.INFERNO: return ( <div className="relative w-40 h-64 flex flex-col items-center"><div className="absolute top-10 -right-8 w-16 h-32 bg-red-700 rounded-lg border-4 border-black z-0"></div><div className="absolute top-0 w-32 h-32 bg-orange-500 rounded-full z-20 border-4 border-black overflow-hidden flex flex-col items-center"><div className="w-24 h-12 bg-yellow-300 mt-8 rounded-full border-2 border-black"></div><div className="w-16 h-8 bg-gray-800 mt-2 rounded border border-gray-600"></div></div><div className="absolute top-28 w-36 h-28 bg-red-800 rounded-xl z-10 border-4 border-black flex flex-col items-center"><div className="w-24 h-full bg-red-600 border-x-2 border-black/20"></div></div><div className="absolute top-32 -left-16 w-24 h-12 bg-gray-700 rounded border-4 border-black flex items-center z-30"><div className="w-4 h-full bg-black ml-auto"></div><div className="w-4 h-8 bg-orange-500 animate-pulse"></div></div></div> );
            case BrawlerType.FROSTBITE: return ( <div className="relative w-40 h-64 flex flex-col items-center transform scale-110"><div className="absolute top-10 w-36 h-40 bg-[#06b6d4] rounded-[30px] z-10 border-4 border-[#164e63] flex flex-col items-center shadow-inner"><div className="absolute top-0 w-full h-full bg-gradient-to-b from-[#ecfeff] to-transparent opacity-30 rounded-[30px]"></div><div className="mt-8 flex gap-6"><div className="w-3 h-3 bg-[#164e63] rounded-full"></div><div className="w-3 h-3 bg-[#164e63] rounded-full"></div></div><div className="mt-2 w-4 h-2 bg-[#164e63] rounded-full opacity-50"></div></div><div className="absolute top-4 -left-4 w-12 h-16 bg-[#22d3ee] rotate-[-20deg] border-4 border-[#164e63] rounded-t-full z-0"></div><div className="absolute top-4 -right-4 w-12 h-16 bg-[#22d3ee] rotate-[20deg] border-4 border-[#164e63] rounded-t-full z-0"></div><div className="absolute -top-4 w-20 h-16 bg-[#22d3ee] clip-path-polygon z-20 border-2 border-[#164e63]"></div><div className="absolute top-0 flex gap-1"><div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[30px] border-b-[#cffafe]"></div><div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[40px] border-b-[#cffafe] -mt-4"></div><div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[30px] border-b-[#cffafe]"></div></div></div> );
            case BrawlerType.VOLT: return ( <div className="relative w-40 h-64 flex flex-col items-center"><div className="absolute top-10 w-40 h-40 bg-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div><div className="absolute top-0 w-24 h-24 bg-[#581c87] rounded-xl z-20 border-4 border-black flex items-center justify-center overflow-hidden shadow-lg"><div className="w-20 h-12 bg-[#facc15] rounded-lg border-2 border-black flex items-center justify-center"><div className="w-16 h-2 bg-black opacity-20"></div></div></div><div className="absolute -top-8 w-2 h-12 bg-black z-10"></div><div className="absolute -top-10 w-6 h-6 bg-[#facc15] rounded-full border-2 border-black z-20 animate-bounce"></div><div className="absolute top-24 w-20 h-24 bg-[#7e22ce] rounded-b-xl z-10 border-4 border-black flex flex-col items-center"><div className="w-10 h-10 bg-yellow-400 rounded-full mt-4 flex items-center justify-center border-2 border-black"><Zap size={20} className="text-black fill-black" /></div></div><div className="absolute top-48 left-2 w-6 h-16 bg-[#2e1065] -rotate-12 border-2 border-black"></div><div className="absolute top-48 right-2 w-6 h-16 bg-[#2e1065] rotate-12 border-2 border-black"></div></div> );
            case BrawlerType.SPECTRE: return ( <div className="relative w-40 h-64 flex flex-col items-center"><div className="absolute top-0 w-36 h-48 bg-purple-900/60 rounded-t-full z-10 border-x-4 border-t-4 border-black scale-x-110"></div><div className="absolute top-8 w-24 h-32 bg-black rounded-xl z-20 border-2 border-purple-500/30 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]"><div className="flex gap-4 mt-4"><div className="w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_10px_#a855f7] animate-pulse"></div><div className="w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_10px_#a855f7] animate-pulse"></div></div><div className="w-8 h-2 bg-purple-900/50 rounded-full mt-4"></div></div><div className="absolute top-36 w-32 h-20 bg-purple-800 rounded-b-xl z-0 border-4 border-black"></div><div className="absolute top-24 -left-10 w-10 h-24 bg-purple-700/80 border-4 border-black rotate-[-15deg] rounded-l-full"></div><div className="absolute top-24 -right-10 w-10 h-24 bg-purple-700/80 border-4 border-black rotate-[15deg] rounded-r-full"></div></div> );
            case BrawlerType.AXEL: return ( <div className="relative w-40 h-60 flex flex-col items-center"><div className="absolute top-0 w-32 h-32 bg-[#94a3b8] rounded-full z-20 border-4 border-black flex items-center justify-center overflow-hidden shadow-lg"><div className="w-full h-full bg-[#f97316] clip-path-polygon"></div><div className="w-16 h-16 bg-[#334155] rounded-full border-2 border-black absolute flex items-center justify-center"><div className="w-4 h-4 bg-yellow-400 rounded-full"></div></div></div><div className="absolute top-28 w-28 h-24 bg-[#f97316] rounded-xl z-10 border-4 border-black flex flex-col items-center"><div className="w-full h-4 bg-black/20 mt-4"></div><div className="w-16 h-8 bg-gray-700 rounded mt-4 border-2 border-black"></div></div><div className="absolute top-10 -right-16 w-24 h-24 bg-gray-400 rounded-full border-4 border-black flex items-center justify-center animate-spin-slow"><div className="w-full h-4 bg-slate-600 rotate-45"></div><div className="w-full h-4 bg-slate-600 -rotate-45"></div><div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-black"></div></div></div> );
            case BrawlerType.VEGA: return ( <div className="relative w-40 h-60 flex flex-col items-center"><div className="absolute top-0 w-36 h-36 bg-[#0891b2] rounded-full z-20 border-4 border-black overflow-hidden flex flex-col items-center"><div className="w-full h-12 bg-[#22d3ee] mt-12 flex justify-center gap-4"><div className="w-2 h-8 bg-black/40 animate-pulse"></div><div className="w-2 h-10 bg-black/40 animate-pulse delay-75"></div><div className="w-2 h-6 bg-black/40 animate-pulse delay-150"></div></div></div><div className="absolute -top-4 -left-2 w-12 h-20 bg-black rounded-full border-2 border-[#22d3ee] z-30"></div><div className="absolute -top-4 -right-2 w-12 h-20 bg-black rounded-full border-2 border-[#22d3ee] z-30"></div><div className="absolute top-32 w-28 h-28 bg-[#1e40af] rounded-xl z-10 border-4 border-black flex flex-col items-center"><div className="w-full h-6 bg-cyan-400/20 mt-4 border-y border-black"></div></div><div className="absolute top-24 -left-12 w-16 h-12 bg-gray-800 rounded border-2 border-black rotate-[-20deg] flex items-center justify-center shadow-lg"><Music size={20} className="text-cyan-400" /></div></div> );
            default:
                const config = BRAWLERS[type as BrawlerType];
                return ( <div className="relative w-40 h-60 flex flex-col items-center justify-center"><div className="w-40 h-40 rounded-full border-8 border-black flex items-center justify-center shadow-lg" style={{ backgroundColor: config.color }}><span className="font-brawl text-6xl text-white drop-shadow-md stroke-black" style={{ WebkitTextStroke: '2px black' }}>{config.name[0]}</span></div></div> );
        }
    };

    return (
        <div className="transform transition-transform hover:scale-105 duration-300">
            {renderContent()}
        </div>
    );
};

// Box Animation Types
type BoxPhase = 'IDLE' | 'INTRO' | 'ANIMATING' | 'REVEAL' | 'SUMMARY';

interface BoxState {
    phase: BoxPhase;
    rewards: Reward[];
    currentIndex: number;
    boxType: 'BRAWL' | 'BIG' | 'MEGA';
}

const Lobby: React.FC<LobbyProps> = ({ 
    selectedBrawler, 
    onSelectBrawler, 
    onPlay, 
    totalTrophies,
    highestTrophies, 
    gold,
    gems,
    unlockedBrawlers,
    onOpenBox,
    playerName, 
    onNameChange,
    profileIcon,
    onProfileIconChange,
    soloVictories,
    brawlerStates,
    onUpgradeBrawler,
    club,
    onLeaveClub,
    onJoinClub,
    currentPlayerId,
    claimedTrophyRewards,
    onClaimTrophyReward,
    onBuyShopItem,
    passProgress,
    passTier,
    hasBrawlPass,
    claimedPassFreeRewards,
    claimedPassPaidRewards,
    onClaimPassReward,
    onBuyBrawlPass,
    onSelectSkin,
    gameMode,
    onSelectGameMode,
    onBuyTier,
    onBuyStarPower,
    onEquipStarPower,
    favoriteBrawler,
    onSelectFavoriteBrawler,
    battleCard,
    onUpdateBattleCard,
    teamMembers = [],
    onAcceptInvite,
    hasGoatMultiplier,
    hasGoatPlusMultiplier
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [viewingBrawler, setViewingBrawler] = useState<BrawlerType | null>(null);
  
  // ... [Other state declarations remain unchanged] ...
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isClubOpen, setIsClubOpen] = useState(false);
  const [clubInitialTab, setClubInitialTab] = useState<'MEMBERS' | 'CHAT'>('MEMBERS');
  const [isTrophyRoadOpen, setIsTrophyRoadOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isBrawlPassOpen, setIsBrawlPassOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [boxState, setBoxState] = useState<BoxState>({
      phase: 'IDLE',
      rewards: [],
      currentIndex: 0,
      boxType: 'BRAWL'
  });

  const activeBrawlerConfig = BRAWLERS[selectedBrawler];
  const activeBrawlerState = brawlerStates[selectedBrawler];
  const currentSkin = activeBrawlerState.currentSkin || 'DEFAULT';
  const unlockedSkins = activeBrawlerState.unlockedSkins || ['DEFAULT'];
  const activeRarity = RARITY_INFO[activeBrawlerConfig.rarity];
  const activeSP = activeBrawlerConfig.starPowers && activeBrawlerConfig.starPowers.length > 0 
        ? activeBrawlerConfig.starPowers.find(sp => sp.id === activeBrawlerState.selectedStarPower)
        : null;

  const isCustomIcon = profileIcon.startsWith('data:');
  const CurrentProfileIcon = isCustomIcon ? 'img' : PROFILE_ICONS[profileIcon] || Skull;
  
  const accountLevel = Math.max(1, Math.floor(totalTrophies / 500) + 1);

  const hasUnclaimedTrophyRewards = TROPHY_ROAD_REWARDS.some(r => 
      totalTrophies >= r.trophies && !claimedTrophyRewards.includes(r.id)
  );

  const hasUnclaimedPassRewards = BRAWL_PASS_TIERS.some(t => {
      if (t.tier >= passTier) return false;
      const freeClaimed = claimedPassFreeRewards.includes(t.tier);
      if (!freeClaimed) return true;
      const paidClaimed = claimedPassPaidRewards.includes(t.tier);
      if (hasBrawlPass && !paidClaimed) return true;
      return false;
  });

  // --- Helper for Mastery ---
  const getMasteryInfo = (points: number) => {
      let currentLevel = MASTERY_LEVELS[0];
      let nextLevel = MASTERY_LEVELS[1];
      
      for (let i = 0; i < MASTERY_LEVELS.length; i++) {
          if (points >= MASTERY_LEVELS[i].minPoints) {
              currentLevel = MASTERY_LEVELS[i];
              nextLevel = MASTERY_LEVELS[i+1] || null;
          } else {
              break;
          }
      }
      return { currentLevel, nextLevel };
  };

  const handlePlayClick = () => {
      initAudio();
      onPlay();
  };

  const handleBrawlerClick = (type: BrawlerType) => {
    if (unlockedBrawlers.includes(type)) {
        setViewingBrawler(type);
    }
  };

  const confirmSelection = () => {
      if (viewingBrawler) {
          onSelectBrawler(viewingBrawler);
          setViewingBrawler(null);
          setIsSelectorOpen(false);
      }
  };

  // ... [Other Handlers: handleBoxClick, triggerBoxOpen, nextItem, closeBox, etc. remain unchanged] ...
  const handleBoxClick = (type: 'BRAWL' | 'BIG' | 'MEGA') => {
      initAudio();
      const rewards = onOpenBox(type);
      if (rewards) {
          setBoxState({
              phase: 'INTRO',
              rewards: rewards,
              currentIndex: 0,
              boxType: type
          });
      }
  };

  const triggerBoxOpen = () => {
      if (boxState.phase !== 'INTRO') return;
      playClickSound();
      setBoxState(prev => ({ ...prev, phase: 'ANIMATING' }));
      setTimeout(() => {
           setBoxState(prev => ({ ...prev, phase: 'REVEAL' }));
           playCollectSound();
      }, 1000);
  };

  const nextItem = () => {
      if (boxState.phase !== 'REVEAL') return;

      if (boxState.currentIndex < boxState.rewards.length - 1) {
          const nextReward = boxState.rewards[boxState.currentIndex + 1];
          if (nextReward.type === 'BRAWLER') {
               playPurchaseSound(); 
          } else {
               playCollectSound();
          }

          setBoxState(prev => ({
              ...prev,
              currentIndex: prev.currentIndex + 1
          }));
      } else {
          setBoxState(prev => ({ ...prev, phase: 'SUMMARY' }));
      }
  };

  const closeBox = () => {
      setBoxState(prev => ({ ...prev, phase: 'IDLE', rewards: [] }));
  };

  const handlePassRewardClaimWrapper = (tier: number, isPaid: boolean) => {
      const rewards = onClaimPassReward(tier, isPaid);
      if (rewards && rewards.length > 0) {
          setBoxState({
              phase: 'INTRO',
              rewards: rewards,
              currentIndex: 0,
              boxType: rewards.length > 3 ? 'MEGA' : 'BRAWL'
          });
      }
  };

  const cycleSkin = (direction: 'next' | 'prev') => {
      if (!onSelectSkin) return;
      
      const currentIndex = unlockedSkins.indexOf(currentSkin);
      let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      
      if (nextIndex >= unlockedSkins.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = unlockedSkins.length - 1;

      onSelectSkin(selectedBrawler, unlockedSkins[nextIndex]);
  };

  const toggleGameMode = () => {
      if (gameMode === GameMode.SOLO) {
          onSelectGameMode(GameMode.DUO);
      } else if (gameMode === GameMode.DUO) {
          onSelectGameMode(GameMode.KNOCKOUT);
      } else {
          onSelectGameMode(GameMode.SOLO);
      }
  };

  const getGameModeName = () => {
      switch(gameMode) {
          case GameMode.SOLO: return 'TEK HESAPLAŞMA';
          case GameMode.DUO: return 'ÇİFT HESAPLAŞMA';
          case GameMode.KNOCKOUT: return 'NAKAVT (3v3)';
          default: return 'MOD SEÇ';
      }
  };

  const SideButton = ({ icon: Icon, color, label, onClick, notification }: any) => (
      <button 
        onClick={onClick}
        className="group relative flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-black mb-4 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all z-50 pointer-events-auto hover:brightness-110"
      >
          {notification && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black z-10 animate-bounce">
                  {notification}
              </div>
          )}
          <Icon size={28} color={color} className="group-hover:scale-110 transition-transform" />
          {label && <span className="text-[8px] font-bold uppercase mt-1 text-slate-600">{label}</span>}
      </button>
  );

  return (
    <div className="relative w-full h-full bg-[#1a1a2e] overflow-hidden">
        {/* ... [Background, Top Bar, Left/Right Menu code remains unchanged] ... */}
      <div className="absolute inset-0 bg-[#0055d4] opacity-100 z-0">
         <div className="absolute inset-0 bg-[url('https://api.placeholder.com/100')] opacity-10 bg-repeat animate-slide"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-[#0055d4]/80 to-[#003399]/90"></div>
      </div>

      {/* --- TOP BAR --- */}
      <div className="absolute top-0 left-0 right-0 h-20 p-2 flex items-center justify-between z-50 pointer-events-none">
          <div className="flex items-center gap-2 cursor-pointer hover:brightness-110 transition-all pointer-events-auto" onClick={() => setIsProfileOpen(true)}>
              <div className="w-12 h-12 bg-[#3b82f6] border-2 border-black flex flex-col items-center justify-center relative shadow-md">
                  <div className="absolute inset-0 border-2 border-white/20"></div>
                  <Skull size={20} className="text-white mb-[-2px]" />
                  <span className="text-white font-brawl text-xs">{accountLevel}</span>
              </div>
              
              <div className="w-14 h-14 bg-black border-2 border-white rounded-lg overflow-hidden relative shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center">
                     {isCustomIcon ? (
                         <img src={profileIcon} className="w-full h-full object-cover" />
                     ) : (
                         <CurrentProfileIcon size={32} className="text-white drop-shadow-md" />
                     )}
                  </div>
              </div>

              <div className="flex flex-col ml-1">
                  <span className="text-white font-brawl text-xl drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] leading-none mb-1 stroke-black" style={{ WebkitTextStroke: '1px black' }}>
                      {playerName}
                  </span>
                  
                  <div className="flex items-center gap-2">
                      <div 
                        className={`
                            relative bg-black/50 rounded-full h-6 flex items-center px-2 min-w-[120px] transition-all duration-300 pointer-events-auto
                            ${hasUnclaimedTrophyRewards ? 'border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse' : 'border border-white/10'}
                        `}
                        onClick={(e) => { e.stopPropagation(); setIsTrophyRoadOpen(true); }}
                      >
                          <div className="absolute left-[-8px] top-1/2 -translate-y-1/2">
                              <Trophy size={28} className="text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                          </div>
                          <span className="ml-6 text-white font-brawl text-sm">{totalTrophies}</span>
                          {hasUnclaimedTrophyRewards && (
                              <div className="absolute -right-2 -top-2 w-4 h-4 bg-red-500 rounded-full border border-black animate-bounce"></div>
                          )}
                      </div>

                      {/* GOAT Multiplier Badges */}
                      {hasGoatPlusMultiplier && hasGoatMultiplier ? (
                          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-brawl text-xs px-2 py-0.5 rounded border border-white animate-pulse shadow-[0_0_15px_#ec4899] flex items-center gap-1">
                              <Trophy size={10} className="fill-white" /> 1000x GOD MODE
                          </div>
                      ) : hasGoatPlusMultiplier ? (
                          <div className="bg-red-600 text-white font-brawl text-xs px-2 py-0.5 rounded border border-black animate-pulse shadow-lg flex items-center gap-1">
                              <Trophy size={10} className="fill-white" /> 100x AKTİF
                          </div>
                      ) : hasGoatMultiplier ? (
                          <div className="bg-orange-500 text-white font-brawl text-xs px-2 py-0.5 rounded border border-black animate-pulse shadow-lg flex items-center gap-1">
                              <Trophy size={10} className="fill-white" /> 10x AKTİF
                          </div>
                      ) : null}
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4 mr-2 pointer-events-auto">
              <div className="hidden md:flex items-center bg-black/40 px-3 py-1 rounded-full border border-black/20 h-10 hover:bg-black/60 cursor-pointer" onClick={() => setIsShopOpen(true)}>
                  <div className="bg-yellow-500 rounded p-0.5 border border-black mr-2">
                      <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                  </div>
                  <span className="text-white font-brawl text-lg">{gold}</span>
              </div>

              <div className="hidden md:flex items-center bg-black/40 px-3 py-1 rounded-full border border-black/20 h-10 hover:bg-black/60 cursor-pointer" onClick={() => setIsShopOpen(true)}>
                  <Gem size={18} className="text-green-400 fill-green-500 mr-2 drop-shadow-sm" />
                  <span className="text-white font-brawl text-lg">{gems}</span>
              </div>
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="bg-white p-2 rounded border-2 border-black shadow-sm active:translate-y-1 hover:brightness-110"
              >
                  <Menu size={24} className="text-slate-700" />
              </button>
          </div>
      </div>

      {/* --- LEFT VERTICAL MENU --- */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 flex flex-col z-50 pointer-events-none">
          <SideButton 
            icon={ShoppingBag} 
            color="#e11d48" 
            label="DÜKKAN" 
            onClick={() => { initAudio(); playClickSound(); setIsShopOpen(true); }}
            notification="YENİ" 
          />
          <SideButton 
            icon={Users} 
            color="#fbbf24" 
            label="SAVAŞÇILAR" 
            onClick={() => { initAudio(); playClickSound(); setIsSelectorOpen(true); }} 
            notification={unlockedBrawlers.length}
          />
          <SideButton 
            icon={Newspaper} 
            color="#3b82f6" 
            label="HABERLER" 
            onClick={() => { initAudio(); playClickSound(); setIsNewsOpen(true); }} 
            notification={1}
          />
      </div>

      {/* --- RIGHT VERTICAL MENU --- */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col z-50 pointer-events-none">
           <SideButton 
            icon={BarChart2} 
            color="#facc15" 
            label="LİDERLİK" 
            onClick={() => { initAudio(); playClickSound(); setIsLeaderboardOpen(true); }} 
          />
          <SideButton 
            icon={Shield} 
            color="#ef4444" 
            label="KULÜP" 
            onClick={() => { 
                initAudio(); 
                playClickSound(); 
                setClubInitialTab('MEMBERS');
                setIsClubOpen(true); 
            }} 
          />
          <SideButton 
            icon={Smile} 
            color="#22c55e" 
            label="ARKADAŞLAR" 
            onClick={() => { initAudio(); playClickSound(); setIsFriendsOpen(true); }} 
            notification={MOCK_FRIENDS.filter(f => f.isOnline).length > 0 ? MOCK_FRIENDS.filter(f => f.isOnline).length : undefined}
          />
           <SideButton 
            icon={MessageCircle} 
            color="#3b82f6" 
            label="SOHBET" 
            onClick={() => {
                initAudio();
                playClickSound();
                setClubInitialTab('CHAT');
                setIsClubOpen(true);
            }} 
          />
      </div>

      {/* --- CENTER CHARACTER --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className={`relative group pointer-events-auto flex items-end ${teamMembers && teamMembers.length > 0 ? 'gap-16' : ''}`}>
              
              {/* --- TEAMMATE RENDER (IF EXISTS) --- */}
              {teamMembers && teamMembers.length > 0 && (
                  <div className="relative transform scale-90 z-0 hover:z-20 transition-all duration-300">
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/40 blur-md rounded-[100%]"></div>
                        <DetailedBrawlerFigure type={teamMembers[0].brawler} skin={teamMembers[0].skin} />
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <span className="text-white font-brawl text-lg stroke-black" style={{ WebkitTextStroke: '1px black' }}>{teamMembers[0].name}</span>
                            <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-black animate-pulse">HAZIR</div>
                        </div>
                  </div>
              )}

              {/* --- PLAYER RENDER --- */}
              <div className="relative">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/40 blur-md rounded-[100%]"></div>
                  
                  <div 
                    className="transition-all duration-300 animate-float cursor-pointer hover:scale-105"
                    onClick={() => setViewingBrawler(selectedBrawler)}
                  >
                      <DetailedBrawlerFigure type={selectedBrawler} skin={currentSkin} />
                  </div>

                  {unlockedSkins.length > 1 && (
                      <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); cycleSkin('prev'); }}
                            className="absolute top-1/2 -left-16 -translate-y-1/2 bg-black/40 p-2 rounded-full border-2 border-white hover:bg-black/60 active:scale-95 transition-all"
                        >
                            <ArrowLeft size={24} className="text-white" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); cycleSkin('next'); }}
                            className="absolute top-1/2 -right-16 -translate-y-1/2 bg-black/40 p-2 rounded-full border-2 border-white hover:bg-black/60 active:scale-95 transition-all"
                        >
                            <ArrowRight size={24} className="text-white" />
                        </button>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 whitespace-nowrap uppercase">
                            {currentSkin.replace('_', ' ')}
                        </div>
                      </>
                  )}

                  {activeSP && (
                      <div className="absolute top-0 -right-12 flex flex-col items-center animate-bounce-slow">
                          <div className="w-12 h-12 bg-yellow-400 rounded-full border-2 border-black flex items-center justify-center shadow-lg relative overflow-hidden group-hover:scale-110 transition-transform">
                              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-500"></div>
                              <Star size={24} className="text-white fill-white drop-shadow-sm relative z-10" />
                          </div>
                          <span className="text-[8px] font-bold text-yellow-400 uppercase mt-1 bg-black/50 px-1 rounded backdrop-blur-sm">{activeSP.name}</span>
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between z-50 pointer-events-none">
          {/* ... [Bottom Bar code with Brawl Pass and Boxes remains unchanged] ... */}
          <div className="flex flex-col gap-2 pointer-events-auto">
              <div 
                className={`
                    w-48 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center px-2 relative cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all z-30
                    ${hasUnclaimedPassRewards ? 'border-2 border-yellow-400 animate-pulse shadow-[0_0_15px_rgba(255,255,0,0.6)]' : 'border-2 border-black'}
                `}
                onClick={() => setIsBrawlPassOpen(true)}
              >
                  <div className="absolute -top-3 -left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded border border-black rotate-[-5deg]">
                      SEZON 4
                  </div>
                  <div className="flex flex-col flex-1">
                      <span className="text-white font-brawl text-lg leading-none drop-shadow-md">BRAWL PASS</span>
                      <div className="w-full h-3 bg-black/40 rounded-full mt-1 border border-white/20 overflow-hidden">
                          <div className="h-full bg-yellow-400" style={{ width: `${passProgress}%` }}></div>
                      </div>
                  </div>
                  <div className="ml-2 relative">
                       <Gift size={24} className="text-white animate-bounce" />
                       {hasUnclaimedPassRewards && (
                           <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border border-black animate-ping"></div>
                       )}
                  </div>
              </div>
          </div>
          
          <div className="flex items-end gap-4 pointer-events-auto">
               <div className="flex items-end gap-2">
                   <button 
                      onClick={() => handleBoxClick('BRAWL')}
                      className="group relative w-16 h-16 bg-[#3b82f6] border-2 border-black rounded-lg shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center overflow-hidden hover:brightness-110"
                   >
                       <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700"></div>
                       <Box size={24} className="text-white z-10 drop-shadow-md mb-1" />
                       <div className="z-10 text-[8px] text-white font-bold uppercase">SAVAŞ</div>
                       <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[8px] font-bold px-1 rounded-bl border-b border-l border-black">
                           {BRAWL_BOX_COST}
                       </div>
                   </button>

                   <button 
                      onClick={() => handleBoxClick('BIG')}
                      className="group relative w-16 h-16 bg-purple-600 border-2 border-black rounded-lg shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center overflow-hidden hover:brightness-110"
                   >
                       <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-800"></div>
                       <Star size={24} className="text-white z-10 drop-shadow-md mb-1 fill-white" />
                       <div className="z-10 text-[8px] text-white font-bold uppercase">BÜYÜK</div>
                       <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] font-bold px-1 rounded-bl border-b border-l border-black flex items-center gap-0.5">
                           {BIG_BOX_COST_GEMS} <Gem size={6} className="fill-white"/>
                       </div>
                   </button>

                    <button 
                      onClick={() => handleBoxClick('MEGA')}
                      className="group relative w-16 h-16 bg-yellow-400 border-2 border-black rounded-lg shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center overflow-hidden hover:brightness-110"
                   >
                       <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-500"></div>
                       <div className="absolute inset-0 bg-red-500 w-full h-2 top-1/2 -translate-y-1/2 rotate-45 scale-150 opacity-20"></div>
                       <div className="z-10 text-white drop-shadow-md font-brawl text-2xl">M</div>
                       <div className="z-10 text-[8px] text-white font-bold uppercase drop-shadow-md">MEGA</div>
                       <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] font-bold px-1 rounded-bl border-b border-l border-black flex items-center gap-0.5">
                           {MEGA_BOX_COST_GEMS} <Gem size={6} className="fill-white"/>
                       </div>
                   </button>
               </div>

               <div 
                 className="w-32 h-24 bg-purple-600 border-2 border-black rounded-lg relative overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-lg ml-2"
                 onClick={toggleGameMode}
                >
                   <div className="absolute inset-0 bg-[url('https://api.placeholder.com/100')] opacity-30 bg-cover"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                       <span className="text-white font-brawl text-sm uppercase leading-none text-center">
                           {getGameModeName()}
                       </span>
                       <span className="text-green-400 text-[10px] font-bold text-center mt-1">YENİ ETKİNLİK</span>
                   </div>
                   <div className="absolute top-2 right-2">
                       <RotateCcw size={16} className="text-white/80" />
                   </div>
               </div>

               <button 
                  onClick={handlePlayClick}
                  className="w-40 h-20 bg-[#facc15] hover:bg-[#eab308] border-b-8 border-[#ca8a04] active:border-b-0 active:translate-y-2 rounded-xl flex items-center justify-center shadow-xl transition-all"
               >
                   <span className="text-black font-brawl text-4xl drop-shadow-sm tracking-widest">OYNA</span>
               </button>
          </div>
      </div>

      {/* --- BRAWLER SELECTOR (UNCHANGED) --- */}
      {isSelectorOpen && !viewingBrawler && (
        <div className="absolute inset-0 z-[60] bg-[#1e3a8a] flex flex-col animate-fadeIn">
            {/* ... [Selector code unchanged] ... */}
            <div className="flex items-center justify-between p-4 border-b-4 border-black/20 bg-[#1e40af]">
                <button onClick={() => setIsSelectorOpen(false)} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1">
                    <ArrowLeft size={32} className="text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-brawl text-white uppercase drop-shadow-md tracking-wider">SAVAŞÇILAR</h2>
                    <span className="text-blue-200 font-bold text-sm">{unlockedBrawlers.length} / {Object.keys(BRAWLERS).length}</span>
                </div>
                <button onClick={() => setIsSelectorOpen(false)} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1">
                    <Home size={32} className="text-white" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-[url('https://api.placeholder.com/50')] bg-repeat">
                {Object.values(BRAWLERS).map((brawler) => {
                    const isUnlocked = unlockedBrawlers.includes(brawler.type);
                    const isSelected = selectedBrawler === brawler.type;
                    const state = brawlerStates[brawler.type];
                    const rarity = RARITY_INFO[brawler.rarity];
                    const upgradeCost = state.level < MAX_LEVEL ? UPGRADE_COSTS[state.level - 1] : null;
                    const canUpgrade = upgradeCost && gold >= upgradeCost.gold && state.powerPoints >= upgradeCost.pp;
                    const progress = upgradeCost ? Math.min(100, (state.powerPoints / upgradeCost.pp) * 100) : 100;

                    return (
                        <div 
                            key={brawler.type}
                            onClick={() => handleBrawlerClick(brawler.type)}
                            className={`
                                relative rounded-xl border-4 overflow-hidden transition-all duration-200 cursor-pointer
                                ${isSelected ? 'border-yellow-400 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.6)] z-10' : 'border-black hover:scale-105'}
                                ${!isUnlocked ? 'grayscale opacity-80' : ''}
                                h-80 flex flex-col
                            `}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-b ${rarity.bgGradient} z-0`}></div>
                            
                            <div className="absolute top-2 left-2 z-10">
                                <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded text-white text-[10px] font-bold uppercase border border-white/20">
                                    <span style={{ color: rarity.color }}>{rarity.label}</span>
                                </div>
                            </div>

                            {isUnlocked && (
                                <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
                                    <div className="bg-black/40 text-white text-xs font-bold px-2 py-1 rounded border border-white/10">
                                        LVL {state.level}
                                    </div>
                                    <div className="flex items-center gap-1 bg-black/40 text-[#ff55ff] text-xs font-bold px-2 py-1 rounded border border-white/10">
                                        <Zap size={10} fill="#ff55ff" /> {state.powerPoints}
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 flex items-center justify-center z-0 mt-6 relative overflow-hidden">
                                {!isUnlocked && <Lock size={48} className="text-white/50 absolute" />}
                                <DetailedBrawlerFigure type={brawler.type} />
                            </div>

                            <div className="bg-black/60 p-2 z-10 flex flex-col items-center border-t-2 border-black/10 backdrop-blur-sm">
                                <span className="text-white font-brawl text-2xl uppercase tracking-wider drop-shadow-md stroke-black" style={{ WebkitTextStroke: '1px black' }}>
                                    {brawler.name}
                                </span>
                            </div>

                            {isUnlocked && state.level < MAX_LEVEL && (
                                <div className="bg-[#1e1e24] p-2 z-10 border-t border-white/10">
                                    {canUpgrade ? (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onUpgradeBrawler(brawler.type); }}
                                            className="w-full bg-green-500 hover:bg-green-400 text-white font-brawl text-lg py-1 rounded border-b-4 border-green-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 animate-pulse"
                                        >
                                            <span className="text-xs">{upgradeCost?.gold}</span>
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full border border-black"></div>
                                            YÜKSELT
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-[10px] text-white font-bold px-1">
                                                <span>GÜÇ PUANI</span>
                                                <span>{state.powerPoints} / {upgradeCost?.pp}</span>
                                            </div>
                                            <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/10">
                                                <div className="h-full bg-[#ff55ff]" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      )}

      {viewingBrawler && (
          <div className="absolute inset-0 z-[60] bg-[#0055d4] flex flex-col animate-scaleIn origin-center">
              <div className="flex items-center justify-between p-2 h-16 z-20">
                  <button 
                    onClick={() => setViewingBrawler(null)}
                    className="bg-[#1e40af] p-2 rounded-lg border-2 border-black/50 shadow-md active:scale-95"
                  >
                      <ChevronLeft size={32} className="text-white" />
                  </button>
                  <div className="flex gap-4 mr-2">
                        <div className="flex items-center bg-black/40 px-3 py-1 rounded-full border border-black/20 h-10">
                            <div className="bg-yellow-500 rounded p-0.5 border border-black mr-2">
                                <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                            </div>
                            <span className="text-white font-brawl text-lg">{gold}</span>
                        </div>
                        <div className="flex items-center bg-black/40 px-3 py-1 rounded-full border border-black/20 h-10">
                            <Gem size={18} className="text-green-400 fill-green-500 mr-2 drop-shadow-sm" />
                            <span className="text-white font-brawl text-lg">{gems}</span>
                        </div>
                  </div>
              </div>

              {/* MASTERY BAR (Top Center) */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-full max-w-md px-4">
                  {(() => {
                      const { currentLevel, nextLevel } = getMasteryInfo(brawlerStates[viewingBrawler].masteryPoints);
                      const current = brawlerStates[viewingBrawler].masteryPoints;
                      const min = currentLevel.minPoints;
                      const max = nextLevel ? nextLevel.minPoints : min + 1000;
                      const percent = Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));
                      
                      return (
                          <div className="w-full bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center gap-3">
                              <div 
                                className="w-12 h-12 rounded-full border-4 border-black flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: currentLevel.color }}
                              >
                                  <Badge size={24} className="text-white drop-shadow-md" />
                              </div>
                              <div className="flex-1 flex flex-col">
                                  <div className="flex justify-between items-end mb-1">
                                      <span className="text-white font-brawl text-sm uppercase" style={{ color: currentLevel.color }}>{currentLevel.name}</span>
                                      <span className="text-white text-[10px] font-bold">{current} / {nextLevel ? max : 'MAX'}</span>
                                  </div>
                                  <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
                                      <div 
                                        className="h-full transition-all duration-500"
                                        style={{ width: `${percent}%`, backgroundColor: currentLevel.color }}
                                      ></div>
                                  </div>
                              </div>
                          </div>
                      );
                  })()}
              </div>

              <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="scale-150 animate-bounce-slow">
                      <DetailedBrawlerFigure type={viewingBrawler} skin={currentSkin} />
                  </div>
                  <div className="mt-8 text-center">
                      <h2 className="text-white font-brawl text-4xl uppercase drop-shadow-md stroke-black" style={{ WebkitTextStroke: '2px black' }}>{BRAWLERS[viewingBrawler].name}</h2>
                      <div className="text-white/80 font-bold uppercase tracking-widest text-sm bg-black/40 px-4 py-1 rounded-full mt-2 inline-block">
                          {RARITY_INFO[BRAWLERS[viewingBrawler].rarity].label}
                      </div>
                  </div>
                  
                  {/* STAR POWER SELECTION UI (UNCHANGED) */}
                  {BRAWLERS[viewingBrawler].starPowers && BRAWLERS[viewingBrawler].starPowers.length > 0 && (
                      <div className="absolute right-4 top-20 bottom-20 w-72 flex flex-col justify-center gap-4 z-30 pointer-events-none md:pointer-events-auto">
                          {/* ... existing Star Power UI code ... */}
                          <div className="bg-black/60 p-4 rounded-xl border-2 border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl">
                              <h3 className="text-yellow-400 font-brawl text-lg mb-3 text-center drop-shadow-md uppercase tracking-wider flex items-center justify-center gap-2">
                                  <Star size={18} className="fill-yellow-400" /> YILDIZ GÜÇLERİ
                              </h3>
                              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                                  {BRAWLERS[viewingBrawler].starPowers.map(sp => {
                                      const brawlerState = brawlerStates[viewingBrawler];
                                      const isUnlocked = brawlerState.unlockedStarPowers.includes(sp.id);
                                      const isSelected = brawlerState.selectedStarPower === sp.id;
                                      const levelRequirementMet = brawlerState.level >= STAR_POWER_UNLOCK_LEVEL;
                                      const canBuy = levelRequirementMet && !isUnlocked && gold >= STAR_POWER_COST;
                                      const SPIcon = SP_ICONS[sp.icon] || Star;

                                      return (
                                          <div key={sp.id} className={`
                                              relative p-3 rounded-lg border-2 transition-all flex flex-col gap-2 group
                                              ${isUnlocked 
                                                  ? (isSelected ? 'bg-yellow-500/20 border-yellow-400' : 'bg-slate-800/80 border-slate-600 hover:border-yellow-400/50') 
                                                  : 'bg-black/40 border-slate-800 opacity-90'}
                                          `}>
                                              <div className="flex items-start gap-3">
                                                  <div className={`
                                                      w-12 h-12 rounded border-2 flex items-center justify-center shrink-0 shadow-md
                                                      ${isUnlocked ? 'bg-yellow-400 border-white' : 'bg-slate-700 border-slate-500'}
                                                  `}>
                                                      {isUnlocked 
                                                          ? <SPIcon size={24} className="text-white drop-shadow-md" />
                                                          : <Lock size={24} className="text-slate-400" />
                                                      }
                                                  </div>
                                                  <div className="flex flex-col">
                                                      <span className={`font-brawl text-sm uppercase leading-none mb-1 ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                                          {sp.name}
                                                      </span>
                                                      <span className="text-[10px] text-white/70 font-bold font-bold leading-tight line-clamp-3">
                                                          {sp.description}
                                                      </span>
                                                  </div>
                                              </div>

                                              {/* Action Button */}
                                              <div className="mt-1">
                                                  {isUnlocked ? (
                                                      isSelected ? (
                                                          <div className="w-full bg-green-600 text-white font-brawl text-xs py-1.5 rounded text-center border border-black uppercase flex items-center justify-center gap-1 shadow-inner">
                                                              <Check size={12} strokeWidth={4} /> SEÇİLDİ
                                                          </div>
                                                      ) : (
                                                          <button 
                                                              onClick={() => onEquipStarPower && onEquipStarPower(viewingBrawler, sp.id)}
                                                              className="w-full bg-white hover:bg-slate-100 text-black font-brawl text-xs py-1.5 rounded border-b-2 border-slate-400 active:border-b-0 active:translate-y-0.5 uppercase shadow-md transition-colors"
                                                          >
                                                              SEÇ
                                                          </button>
                                                      )
                                                  ) : (
                                                      levelRequirementMet ? (
                                                          <button 
                                                              onClick={() => {
                                                                  if(canBuy && onBuyStarPower) onBuyStarPower(viewingBrawler, sp.id);
                                                              }}
                                                              disabled={!canBuy}
                                                              className={`
                                                                  w-full font-brawl text-xs py-1.5 rounded border-b-2 active:border-b-0 active:translate-y-0.5 uppercase shadow-md flex items-center justify-center gap-1 transition-colors
                                                                  ${canBuy ? 'bg-green-500 hover:bg-green-400 border-green-700 text-white' : 'bg-slate-600 border-slate-800 text-slate-400 cursor-not-allowed'}
                                                              `}
                                                          >
                                                              {canBuy ? (
                                                                  <>
                                                                      <span>{STAR_POWER_COST}</span>
                                                                      <div className="w-3 h-3 bg-yellow-400 rounded-full border border-black"></div>
                                                                      <span>AL</span>
                                                                  </>
                                                              ) : (
                                                                  <span>YETERSİZ ALTIN</span>
                                                              )}
                                                          </button>
                                                      ) : (
                                                          <div className="w-full bg-black/40 text-slate-400 font-bold text-[10px] py-1.5 rounded text-center border border-white/10 uppercase">
                                                              SEVİYE 9'DA AÇILIR
                                                          </div>
                                                      )
                                                  )}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>
                  )}
              </div>

              <div className="p-4 bg-black/40 backdrop-blur-md border-t-2 border-white/10 flex justify-center gap-4">
                  <button 
                      onClick={confirmSelection}
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-brawl text-2xl px-12 py-3 rounded-lg border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 shadow-xl uppercase"
                  >
                      SEÇ
                  </button>
              </div>
          </div>
      )}

      {/* ... [Profile, Club, Trophy, etc. modals remain unchanged] ... */}
      {isProfileOpen && (
          <ProfileScreen 
              onClose={() => setIsProfileOpen(false)} 
              playerName={playerName}
              onNameChange={onNameChange}
              playerTag={currentPlayerId.substring(0,8).toUpperCase()}
              profileIcon={profileIcon}
              onIconChange={onProfileIconChange}
              totalTrophies={totalTrophies}
              highestTrophies={highestTrophies}
              soloVictories={soloVictories}
              favoriteBrawler={favoriteBrawler || BrawlerType.SHELLY}
              onSelectFavoriteBrawler={onSelectFavoriteBrawler || (() => {})}
              unlockedBrawlers={unlockedBrawlers}
              battleCard={battleCard || { icon1: 'SKULL', icon2: 'SKULL', pin: 'happy' }}
              onUpdateBattleCard={onUpdateBattleCard || (() => {})}
              club={club}
              brawlerLevel={activeBrawlerState.level}
          />
      )}

      {isClubOpen && (
          <ClubScreen 
              club={club} 
              onClose={() => setIsClubOpen(false)} 
              currentPlayerId={currentPlayerId}
              onLeaveClub={onLeaveClub}
              onJoinClub={onJoinClub}
              userTrophies={totalTrophies}
              initialTab={clubInitialTab}
              onAcceptInvite={onAcceptInvite}
          />
      )}

      {isTrophyRoadOpen && (
          <TrophyRoadScreen 
              currentTrophies={totalTrophies} 
              claimedRewards={claimedTrophyRewards} 
              onClaimReward={onClaimTrophyReward} 
              onClose={() => setIsTrophyRoadOpen(false)}
              profileIcon={profileIcon}
          />
      )}

      {isFriendsOpen && (
          <FriendsScreen 
              onClose={() => setIsFriendsOpen(false)} 
              currentPlayerId={currentPlayerId}
          />
      )}

      {isShopOpen && (
          <ShopScreen 
              onClose={() => setIsShopOpen(false)}
              gold={gold}
              gems={gems}
              onBuy={onBuyShopItem}
              unlockedSkins={unlockedSkins}
              hasGoatMultiplier={hasGoatMultiplier}
              hasGoatPlusMultiplier={hasGoatPlusMultiplier}
          />
      )}

      {isBrawlPassOpen && (
          <BrawlPassScreen 
              onClose={() => setIsBrawlPassOpen(false)}
              currentTokens={passProgress * 10} 
              currentTier={passTier}
              hasPass={hasBrawlPass}
              claimedFreeRewards={claimedPassFreeRewards}
              claimedPaidRewards={claimedPassPaidRewards}
              onClaimReward={handlePassRewardClaimWrapper}
              onBuyPass={onBuyBrawlPass}
              gems={gems}
              onBuyTier={onBuyTier}
          />
      )}

      {isNewsOpen && (
          <NewsScreen onClose={() => setIsNewsOpen(false)} />
      )}

      {isLeaderboardOpen && (
          <LeaderboardScreen 
              onClose={() => setIsLeaderboardOpen(false)} 
              currentPlayerName={playerName}
              currentPlayerTrophies={totalTrophies}
              profileIcon={profileIcon}
              clubName={club ? club.name : "KULÜPSÜZ"}
              playerId={currentPlayerId}
          />
      )}

      {isSettingsOpen && (
          <SettingsScreen onClose={() => setIsSettingsOpen(false)} />
      )}

      {boxState.phase !== 'IDLE' && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center animate-fadeIn" onClick={boxState.phase === 'INTRO' ? triggerBoxOpen : nextItem}>
              {/* ... [Box opening logic unchanged] ... */}
              {boxState.phase === 'INTRO' && (
                  <div className="flex flex-col items-center animate-bounce-slow cursor-pointer">
                      <div className="text-white font-brawl text-4xl mb-8 animate-pulse">DOKUN VE AÇ!</div>
                      <Box size={200} className={`
                          text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]
                          ${boxState.boxType === 'MEGA' ? 'text-yellow-400' : boxState.boxType === 'BIG' ? 'text-purple-600' : 'text-blue-500'}
                      `} />
                  </div>
              )}

              {boxState.phase === 'ANIMATING' && (
                  <div className="animate-spin-slow">
                      <Star size={150} className="text-white blur-md" />
                  </div>
              )}

              {boxState.phase === 'REVEAL' && boxState.rewards[boxState.currentIndex] && (
                  <div className="flex flex-col items-center animate-scaleUp">
                      <div className="relative">
                          <div className="absolute inset-0 bg-gradient-radial from-white/50 to-transparent scale-150 animate-pulse"></div>
                          {boxState.rewards[boxState.currentIndex].type === 'GOLD' && <div className="w-32 h-32 bg-yellow-500 rounded-full border-4 border-white"></div>}
                          {boxState.rewards[boxState.currentIndex].type === 'POWER_POINTS' && <Zap size={128} className="text-[#ff55ff] drop-shadow-lg" />}
                          {boxState.rewards[boxState.currentIndex].type === 'BRAWLER' && <Users size={128} className="text-yellow-400 drop-shadow-lg" />}
                          {boxState.rewards[boxState.currentIndex].type === 'GEMS' && <Gem size={128} className="text-green-400 drop-shadow-lg" />}
                          {boxState.rewards[boxState.currentIndex].type === 'BRAWLER_SKIN' && <Smile size={128} className="text-orange-400 drop-shadow-lg" />}
                          {!['GOLD', 'POWER_POINTS', 'BRAWLER', 'GEMS', 'BRAWLER_SKIN'].includes(boxState.rewards[boxState.currentIndex].type) && (
                              <Gift size={128} className="text-white" />
                          )}
                      </div>
                      
                      <div className="mt-8 text-center">
                          <div className="text-6xl font-brawl text-white drop-shadow-md stroke-black" style={{ WebkitTextStroke: '2px black' }}>
                              {boxState.rewards[boxState.currentIndex].amount || boxState.rewards[boxState.currentIndex].value}
                          </div>
                          <div className="text-2xl font-bold text-white uppercase tracking-widest bg-black/50 px-4 rounded mt-2">
                              {boxState.rewards[boxState.currentIndex].label || boxState.rewards[boxState.currentIndex].type}
                          </div>
                          {boxState.rewards[boxState.currentIndex].extra && (
                              <div className="text-yellow-400 font-bold mt-2">
                                  {BRAWLERS[boxState.rewards[boxState.currentIndex].extra!.target as BrawlerType]?.name}
                              </div>
                          )}
                      </div>
                      <div className="absolute bottom-10 text-white/50 text-sm font-bold uppercase animate-pulse">DEVAM ETMEK İÇİN DOKUN</div>
                  </div>
              )}

              {boxState.phase === 'SUMMARY' && (
                  <div className="bg-[#1e3a8a] border-4 border-black p-8 rounded-xl flex flex-col items-center max-w-2xl w-full mx-4 shadow-2xl animate-scaleIn">
                      <h2 className="text-4xl font-brawl text-white mb-8 uppercase drop-shadow-md">ÖDÜLLER</h2>
                      <div className="flex flex-wrap justify-center gap-4">
                          {boxState.rewards.map((reward, idx) => (
                              <div key={idx} className="bg-black/30 p-4 rounded-lg flex flex-col items-center border border-white/10 w-24">
                                  <div className="text-white font-brawl text-xl">{reward.amount || reward.value}</div>
                                  <div className="text-[10px] text-white/70 font-bold font-bold uppercase truncate w-full text-center">{reward.type}</div>
                              </div>
                          ))}
                      </div>
                      <button 
                          onClick={(e) => { e.stopPropagation(); closeBox(); }}
                          className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-brawl text-xl px-8 py-2 rounded-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 shadow-lg"
                      >
                          TAMAM
                      </button>
                  </div>
              )}
          </div>
      )}

    </div>
  );
};

export default Lobby;
