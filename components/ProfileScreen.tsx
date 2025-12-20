
import React, { useState } from 'react';
import { BrawlerType, Club, BrawlerRarity, BattleCardData } from '../types';
import { BRAWLERS, RARITY_INFO, PLAYER_TITLES } from '../constants';
import { 
    X, Settings, Edit2, Palette, Copy, Share2, Info, 
    Trophy, Skull, Shield, Target, Zap, Sword, Crown, 
    Ghost, Smile, Flame, Heart, Star, Sparkles, User, Users, Check, Bomb, Crosshair, Droplet, Upload, Image as ImageIcon,
    Gamepad2, Rocket, Music, Sun, Moon, Anchor, Bug, Coffee, Fingerprint
} from 'lucide-react';

interface ProfileScreenProps {
    onClose: () => void;
    playerName: string;
    onNameChange: (name: string) => void;
    playerTag: string;
    profileIcon: string;
    onIconChange: (icon: string) => void;
    totalTrophies: number;
    highestTrophies: number;
    soloVictories: number;
    favoriteBrawler: BrawlerType;
    onSelectFavoriteBrawler: (type: BrawlerType) => void;
    unlockedBrawlers: BrawlerType[];
    battleCard: BattleCardData;
    onUpdateBattleCard: (data: BattleCardData) => void;
    club?: Club | null;
    brawlerLevel: number;
}

const PROFILE_ICONS: Record<string, React.ElementType> = {
    'SKULL': Skull, 'ZAP': Zap, 'CROWN': Crown, 'GHOST': Ghost,
    'SMILE': Smile, 'FLAME': Flame, 'HEART': Heart, 'STAR': Star,
    'SPARKLES': Sparkles, 'SWORD': Sword, 'TARGET': Target, 'SHIELD': Shield,
    'GAMEPAD': Gamepad2, 'ROCKET': Rocket, 'MUSIC': Music, 'SUN': Sun,
    'MOON': Moon, 'ANCHOR': Anchor, 'BUG': Bug, 'COFFEE': Coffee, 'FINGERPRINT': Fingerprint
};

const PIN_SEEDS = ['happy', 'cool', 'angry', 'love', 'shock', 'wink', 'laugh', 'cry'];

// --- DETAILED BRAWLER RENDERER ---
const DetailedBrawlerFigure = ({ type, skin }: { type: BrawlerType, skin?: string }) => {
    const renderContent = () => {
        switch (type) {
            case BrawlerType.SHELLY:
                return (
                    <div className="relative w-40 h-60 flex flex-col items-center">
                        <div className="absolute top-0 w-48 h-48 bg-purple-700 rounded-full z-0"></div>
                        <div className="absolute top-10 w-32 h-32 bg-[#f0e68c] rounded-full z-10 border-4 border-black">
                            <div className="absolute top-10 left-0 w-full h-10 bg-yellow-400 rotate-[-5deg]"></div>
                            <div className="absolute top-14 left-6 w-4 h-4 bg-black rounded-full"></div>
                            <div className="absolute top-14 right-6 w-4 h-4 bg-black rounded-full"></div>
                            <div className="absolute top-18 left-4 w-6 h-3 bg-pink-300 rotate-12 opacity-80"></div>
                        </div>
                        <div className="absolute top-0 w-48 h-20 bg-purple-700 rounded-t-full z-20 clip-path-polygon"></div>
                        <div className="absolute top-36 w-24 h-24 bg-blue-500 rounded-b-xl z-5 border-4 border-black"><div className="w-full h-full bg-yellow-400 w-8 mx-auto"></div></div>
                        <div className="absolute top-24 -right-16 w-12 h-32 bg-slate-700 rotate-[-15deg] border-4 border-black rounded z-20"></div>
                    </div>
                );
            case BrawlerType.COLT:
                return (
                    <div className="relative w-40 h-60 flex flex-col items-center">
                        <div className="absolute top-0 w-40 h-40 bg-red-600 rounded-t-xl z-10 skew-x-[-10deg] border-4 border-black"></div>
                        <div className="absolute top-12 w-28 h-32 bg-[#f0e68c] rounded-b-xl z-5 border-4 border-black">
                            <div className="absolute top-8 left-6 w-4 h-4 bg-black rounded-full"></div>
                            <div className="absolute top-8 right-6 w-4 h-4 bg-black rounded-full"></div>
                            <div className="absolute top-0 -left-2 w-4 h-16 bg-red-600"></div>
                            <div className="absolute top-0 -right-2 w-4 h-16 bg-red-600"></div>
                        </div>
                        <div className="absolute top-40 w-24 h-20 bg-blue-600 rounded-xl z-0 border-4 border-black"><div className="w-full h-full bg-red-600 w-4 mx-auto"></div></div>
                        <div className="absolute top-20 -left-12 w-10 h-24 bg-slate-400 rotate-12 border-4 border-black"></div>
                        <div className="absolute top-20 -right-12 w-10 h-24 bg-slate-400 rotate-[-12deg] border-4 border-black"></div>
                    </div>
                );
            case BrawlerType.EL_PRIMO:
                return (
                    <div className="relative w-48 h-64 flex flex-col items-center">
                        <div className="absolute top-0 w-32 h-40 bg-blue-600 rounded-2xl z-10 border-4 border-black overflow-hidden">
                            <div className="absolute top-12 left-4 w-10 h-8 bg-[#eec078] rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                            <div className="absolute top-12 right-4 w-10 h-8 bg-[#eec078] rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#eec078] rounded-lg"></div>
                        </div>
                        <div className="absolute top-36 w-40 h-28 bg-[#eec078] rounded-xl z-0 border-4 border-black">
                            <div className="absolute top-20 w-full h-8 bg-black"><div className="w-10 h-10 bg-slate-300 rounded-full mx-auto -mt-1 border-2 border-black"></div></div>
                        </div>
                    </div>
                );
            case BrawlerType.SPIKE:
                return (
                    <div className="relative w-40 h-52 flex flex-col items-center scale-110">
                        <div className="absolute top-10 w-36 h-40 bg-green-500 rounded-[40px] z-10 border-4 border-black">
                            <div className="absolute top-10 left-8 w-6 h-6 bg-black rounded-full"></div>
                            <div className="absolute top-10 right-8 w-6 h-6 bg-black rounded-full"></div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-10 h-8 bg-black rounded-full"></div>
                        </div>
                        <div className="absolute top-0 w-16 h-16 bg-red-500 rounded-full z-0 border-4 border-black flex items-center justify-center"><div className="w-6 h-6 bg-yellow-400 rounded-full"></div></div>
                        <div className="absolute top-24 -left-10 w-12 h-20 bg-green-500 rounded-full rotate-[-30deg] border-4 border-black"></div>
                        <div className="absolute top-24 -right-10 w-12 h-20 bg-green-500 rounded-full rotate-[30deg] border-4 border-black"></div>
                    </div>
                );
            case BrawlerType.DYNAMIKE:
                return (
                    <div className="relative w-40 h-60 flex flex-col items-center">
                        <div className="absolute top-0 w-36 h-20 bg-red-600 rounded-t-full z-20 border-4 border-black">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 rounded-full"></div>
                        </div>
                        <div className="absolute top-16 w-28 h-24 bg-[#f0e68c] z-10 border-x-4 border-black">
                            <div className="absolute bottom-0 w-full h-12 bg-white rounded-b-xl"></div>
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-pink-300 rounded-full border-2 border-black"></div>
                        </div>
                        <div className="absolute top-36 w-24 h-20 bg-red-600 rounded-b-xl z-0 border-4 border-black"></div>
                        <div className="absolute top-24 -right-12 w-8 h-24 bg-red-500 border-2 border-black rotate-12 flex flex-col gap-1 items-center p-1">
                            <div className="w-full h-1 bg-black"></div>
                            <div className="text-[8px] font-bold text-white">TNT</div>
                        </div>
                    </div>
                );
            case BrawlerType.NITA:
                return (
                    <div className="relative w-40 h-56 flex flex-col items-center">
                        <div className="absolute top-0 w-44 h-40 bg-red-800 rounded-full z-10 border-4 border-black shadow-lg">
                            <div className="absolute -top-2 -left-2 w-12 h-12 bg-red-800 rounded-full border-4 border-black"></div>
                            <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-800 rounded-full border-4 border-black"></div>
                            <div className="absolute top-10 left-8 w-6 h-6 bg-black rounded-full border-2 border-white/50"><div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div></div>
                            <div className="absolute top-10 right-8 w-6 h-6 bg-black rounded-full border-2 border-white/50"><div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div></div>
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-10 bg-[#fca5a5] rounded-full border-2 border-black/20"><div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-4 bg-black rounded-full"></div></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-16 bg-[#f0e68c] rounded-b-3xl border-x-2 border-b-2 border-black flex flex-col items-center justify-end pb-2">
                                <div className="w-16 h-2 bg-black rounded-full mb-1 opacity-80"></div>
                                <div className="w-3 h-3 bg-black rounded-full"></div>
                            </div>
                        </div>
                        <div className="absolute top-36 w-32 h-24 bg-[#0ea5e9] rounded-xl z-0 border-4 border-black flex flex-col items-center"><div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-black mt-4"></div></div>
                    </div>
                );
            case BrawlerType.BULL:
                return (
                    <div className="relative w-48 h-60 flex flex-col items-center">
                        <div className="absolute top-0 w-36 h-24 bg-black rounded-t-2xl z-20 border-4 border-black skew-x-[-5deg]"></div>
                        <div className="absolute top-16 w-32 h-32 bg-[#eec078] rounded-xl z-10 border-4 border-black">
                            <div className="absolute top-0 -left-2 w-4 h-16 bg-black"></div>
                            <div className="absolute top-0 -right-2 w-4 h-16 bg-black"></div>
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full flex justify-center gap-6">
                                <div className="w-2 h-1 bg-black rotate-12"></div>
                                <div className="w-2 h-1 bg-black -rotate-12"></div>
                            </div>
                            <div className="absolute top-12 left-6 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-12 right-6 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-6 h-6 border-4 border-yellow-400 rounded-full"></div>
                        </div>
                        <div className="absolute top-44 w-44 h-24 bg-[#1e293b] rounded-xl z-0 border-4 border-black flex justify-center">
                            <div className="w-16 h-full bg-white clip-path-polygon"></div>
                            <div className="absolute top-4 w-12 h-12 bg-red-600 rounded-full border-2 border-black flex items-center justify-center"><div className="w-8 h-8 bg-black rounded-full"></div></div>
                        </div>
                        <div className="absolute top-24 -right-16 w-16 h-32 bg-slate-600 border-4 border-black rounded rotate-[-10deg] z-20 flex flex-col items-center"><div className="w-full h-2 bg-black mt-2"></div><div className="w-10 h-10 bg-black rounded-full mt-auto mb-2"></div></div>
                    </div>
                );
            case BrawlerType.BROCK:
                return (
                    <div className="relative w-40 h-60 flex flex-col items-center">
                        <div className="absolute top-2 w-32 h-16 bg-black rounded-t-xl z-20 border-x-4 border-t-4 border-black"></div>
                        <div className="absolute top-16 w-28 h-28 bg-[#8d5524] rounded-b-xl z-10 border-4 border-black">
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-10 flex gap-1">
                                <div className="flex-1 bg-black rounded-sm border border-gray-600"></div><div className="w-2 h-1 bg-black mt-4"></div><div className="flex-1 bg-black rounded-sm border border-gray-600"></div>
                            </div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-6 border-b-4 border-white rounded-full"></div>
                        </div>
                        <div className="absolute top-40 w-24 h-24 bg-[#3b82f6] rounded-xl z-0 border-4 border-black flex flex-col items-center"><div className="w-full h-8 bg-black/20 mt-2"></div></div>
                        <div className="absolute top-10 -left-16 w-20 h-48 bg-slate-600 border-4 border-black rounded flex flex-col items-center z-30">
                            <div className="w-full h-4 bg-red-500 border-b-2 border-black"></div>
                            <div className="w-12 h-12 bg-black rounded-full mt-4 border-4 border-slate-400"></div>
                            <div className="w-12 h-12 bg-black rounded-full mt-2 border-4 border-slate-400"></div>
                            <div className="w-12 h-12 bg-black rounded-full mt-2 border-4 border-slate-400"></div>
                        </div>
                    </div>
                );
            case BrawlerType.BARLEY:
                return (
                    <div className="relative w-40 h-60 flex flex-col items-center">
                        <div className="absolute top-0 w-24 h-12 bg-black rounded-t-lg z-30 border-2 border-gray-600"></div>
                        <div className="absolute top-10 w-36 h-4 bg-black rounded-full z-30"></div>
                        <div className="absolute top-12 w-24 h-24 bg-[#ca8a04] rounded-full z-20 border-4 border-black flex items-center justify-center overflow-hidden">
                            <div className="w-12 h-12 bg-white rounded-full border-4 border-black flex items-center justify-center"><div className="w-4 h-4 bg-black rounded-full"></div></div>
                            <div className="absolute bottom-4 w-20 h-8 border-t-4 border-white rounded-full"></div>
                        </div>
                        <div className="absolute top-32 w-20 h-28 bg-red-700 rounded-xl z-10 border-4 border-black flex flex-col items-center">
                            <div className="w-full h-full bg-[#1e3a8a] w-12 border-x-2 border-black/20"></div>
                            <div className="absolute top-2 w-4 h-4 bg-yellow-400 rounded-full border border-black"></div><div className="absolute top-8 w-4 h-4 bg-yellow-400 rounded-full border border-black"></div>
                        </div>
                        <div className="absolute top-20 -right-12 w-12 h-24 bg-green-500 border-4 border-black rounded-full z-30 flex flex-col items-center justify-center rotate-12 opacity-90"><div className="text-white font-bold text-xs">XXX</div><div className="w-full h-full bg-white/20 absolute top-0 left-0 rounded-full clip-path-wave"></div></div>
                    </div>
                );
            case BrawlerType.EDGAR:
                return (
                    <div className="relative w-40 h-60 flex flex-col items-center">
                        <div className="absolute top-0 w-36 h-36 bg-black rounded-full z-30 border-4 border-black overflow-hidden">
                            <div className="absolute bottom-2 right-4 w-16 h-16 bg-[#f0e68c] rounded-full"></div>
                            <div className="absolute bottom-8 right-8 w-4 h-4 bg-white rounded-full border-2 border-black flex items-center justify-center"><div className="w-1 h-1 bg-black rounded-full"></div></div>
                            <div className="absolute top-0 left-0 w-24 h-36 bg-black rotate-12"></div>
                        </div>
                        <div className="absolute top-28 w-44 h-16 bg-purple-700 rounded-full z-20 border-4 border-black flex items-center justify-center overflow-hidden">
                            <div className="w-full h-4 bg-white/20 rotate-3"></div><div className="w-full h-4 bg-white/20 rotate-3 mt-2"></div>
                            <div className="absolute top-10 -right-4 w-12 h-24 bg-purple-700 border-4 border-black rotate-[-20deg] rounded-b-lg"><div className="w-full h-4 bg-white/20 mt-4"></div><div className="w-full h-4 bg-white/20 mt-4"></div></div>
                            <div className="absolute top-10 -left-4 w-12 h-24 bg-purple-700 border-4 border-black rotate-[20deg] rounded-b-lg"><div className="w-full h-4 bg-white/20 mt-4"></div><div className="w-full h-4 bg-white/20 mt-4"></div></div>
                        </div>
                        <div className="absolute top-36 w-24 h-24 bg-black rounded-xl z-10 border-4 border-black flex flex-col items-center"><div className="w-12 h-12 bg-white/10 rounded-full mt-4"></div></div>
                    </div>
                );
            case BrawlerType.STU:
                return (
                    <div className="relative w-40 h-64 flex flex-col items-center">
                        <div className="absolute top-0 w-32 h-32 bg-[#3b82f6] rounded-full z-20 border-4 border-black flex items-center justify-center overflow-hidden">
                            <div className="w-24 h-16 bg-black rounded-full flex items-center justify-center"><div className="w-12 h-12 bg-yellow-400 rounded-full animate-pulse border-2 border-white"><div className="w-4 h-4 bg-white rounded-full absolute top-2 right-2"></div></div></div>
                            <div className="absolute top-2 w-full flex justify-between px-4"><div className="w-4 h-4 bg-white clip-path-star"></div><div className="w-4 h-4 bg-white clip-path-star"></div></div>
                        </div>
                        <div className="absolute top-28 w-28 h-20 bg-red-600 rounded-xl z-10 border-4 border-black flex justify-center"><div className="w-4 h-full bg-white"></div><div className="w-4 h-full bg-white ml-4"></div></div>
                        <div className="absolute top-44 w-24 h-24 bg-gray-800 rounded-full z-0 border-8 border-black flex items-center justify-center animate-spin-slow">
                            <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-black"></div><div className="absolute w-full h-2 bg-black"></div><div className="absolute w-2 h-full bg-black"></div>
                        </div>
                        <div className="absolute top-32 -left-12 w-12 h-8 bg-gray-600 border-4 border-black rotate-[-20deg]"></div>
                        <div className="absolute top-32 -left-16 w-8 h-8 bg-orange-500 rounded-full blur-sm animate-pulse"></div>
                    </div>
                );
            case BrawlerType.INFERNO:
                return (
                    <div className="relative w-40 h-64 flex flex-col items-center">
                        {/* Tank on Back */}
                        <div className="absolute top-10 -right-8 w-16 h-32 bg-red-700 rounded-lg border-4 border-black z-0"></div>
                        {/* Head */}
                        <div className="absolute top-0 w-32 h-32 bg-orange-500 rounded-full z-20 border-4 border-black overflow-hidden flex flex-col items-center">
                            {/* Visor */}
                            <div className="w-24 h-12 bg-yellow-300 mt-8 rounded-full border-2 border-black"></div>
                            {/* Mask Grill */}
                            <div className="w-16 h-8 bg-gray-800 mt-2 rounded border border-gray-600"></div>
                        </div>
                        {/* Body Armor */}
                        <div className="absolute top-28 w-36 h-28 bg-red-800 rounded-xl z-10 border-4 border-black flex flex-col items-center">
                            <div className="w-24 h-full bg-red-600 border-x-2 border-black/20"></div>
                        </div>
                        {/* Flamethrower Arm */}
                        <div className="absolute top-32 -left-16 w-24 h-12 bg-gray-700 rounded border-4 border-black flex items-center z-30">
                            <div className="w-4 h-full bg-black ml-auto"></div>
                            <div className="w-4 h-8 bg-orange-500 animate-pulse"></div>
                        </div>
                    </div>
                );
            case BrawlerType.FROSTBITE:
                return (
                    <div className="relative w-40 h-64 flex flex-col items-center transform scale-110">
                        {/* Ice Body */}
                        <div className="absolute top-10 w-36 h-40 bg-[#06b6d4] rounded-[30px] z-10 border-4 border-[#164e63] flex flex-col items-center shadow-inner">
                             <div className="absolute top-0 w-full h-full bg-gradient-to-b from-[#ecfeff] to-transparent opacity-30 rounded-[30px]"></div>
                             {/* Face */}
                             <div className="mt-8 flex gap-6">
                                 <div className="w-3 h-3 bg-[#164e63] rounded-full"></div>
                                 <div className="w-3 h-3 bg-[#164e63] rounded-full"></div>
                             </div>
                             <div className="mt-2 w-4 h-2 bg-[#164e63] rounded-full opacity-50"></div>
                        </div>
                        {/* Ice Spikes (Shoulders) */}
                        <div className="absolute top-4 -left-4 w-12 h-16 bg-[#22d3ee] rotate-[-20deg] border-4 border-[#164e63] rounded-t-full z-0"></div>
                        <div className="absolute top-4 -right-4 w-12 h-16 bg-[#22d3ee] rotate-[20deg] border-4 border-[#164e63] rounded-t-full z-0"></div>
                        {/* Crown */}
                        <div className="absolute -top-4 w-20 h-16 bg-[#22d3ee] clip-path-polygon z-20 border-2 border-[#164e63]"></div>
                        <div className="absolute top-0 flex gap-1">
                             <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[30px] border-b-[#cffafe]"></div>
                             <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[40px] border-b-[#cffafe] -mt-4"></div>
                             <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[30px] border-b-[#cffafe]"></div>
                        </div>
                    </div>
                );
            case BrawlerType.VOLT:
                return (
                    <div className="relative w-40 h-64 flex flex-col items-center">
                        {/* Aura */}
                        <div className="absolute top-10 w-40 h-40 bg-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        {/* Head */}
                        <div className="absolute top-0 w-24 h-24 bg-[#581c87] rounded-xl z-20 border-4 border-black flex items-center justify-center overflow-hidden shadow-lg">
                            <div className="w-20 h-12 bg-[#facc15] rounded-lg border-2 border-black flex items-center justify-center">
                                <div className="w-16 h-2 bg-black opacity-20"></div>
                            </div>
                        </div>
                        {/* Antenna */}
                        <div className="absolute -top-8 w-2 h-12 bg-black z-10"></div>
                        <div className="absolute -top-10 w-6 h-6 bg-[#facc15] rounded-full border-2 border-black z-20 animate-bounce"></div>
                        {/* Body */}
                        <div className="absolute top-24 w-20 h-24 bg-[#7e22ce] rounded-b-xl z-10 border-4 border-black flex flex-col items-center">
                             <div className="w-10 h-10 bg-yellow-400 rounded-full mt-4 flex items-center justify-center border-2 border-black">
                                 <Zap size={20} className="text-black fill-black" />
                             </div>
                        </div>
                        {/* Speed Legs */}
                        <div className="absolute top-48 left-2 w-6 h-16 bg-[#2e1065] -rotate-12 border-2 border-black"></div>
                        <div className="absolute top-48 right-2 w-6 h-16 bg-[#2e1065] rotate-12 border-2 border-black"></div>
                    </div>
                );
            default:
                const config = BRAWLERS[type as BrawlerType];
                return (
                    <div className="relative w-40 h-60 flex flex-col items-center justify-center">
                        <div className="w-40 h-40 rounded-full border-8 border-black flex items-center justify-center shadow-lg" style={{ backgroundColor: config.color }}>
                            <span className="font-brawl text-6xl text-white drop-shadow-md stroke-black" style={{ WebkitTextStroke: '2px black' }}>{config.name[0]}</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="transform transition-transform hover:scale-105 duration-300">
            {renderContent()}
        </div>
    );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({
    onClose,
    playerName,
    onNameChange,
    playerTag,
    profileIcon,
    onIconChange,
    totalTrophies,
    highestTrophies,
    soloVictories,
    favoriteBrawler,
    onSelectFavoriteBrawler,
    unlockedBrawlers,
    battleCard,
    onUpdateBattleCard,
    club,
    brawlerLevel
}) => {
    // Mode States
    const [iconSelectorMode, setIconSelectorMode] = useState<'PROFILE' | 'BATTLE_ICON_1' | 'BATTLE_ICON_2' | 'PIN' | 'TITLE' | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isSelectingBrawler, setIsSelectingBrawler] = useState(false);
    const [tempName, setTempName] = useState(playerName);
    const [customTitle, setCustomTitle] = useState('');
    
    // Derived Stats
    const duoVictories = Math.floor(soloVictories * 0.8);
    const threeVsThreeVictories = Math.floor(totalTrophies / 10);
    const maxChallengeWins = 15;
    
    const brawlerConfig = BRAWLERS[favoriteBrawler];
    const isCustomIcon = profileIcon.startsWith('data:');
    const CurrentIcon = isCustomIcon ? 'img' : PROFILE_ICONS[profileIcon] || Skull;
    
    const isBattleIcon1Custom = battleCard.icon1.startsWith('data:');
    const BattleIcon1 = isBattleIcon1Custom ? 'img' : PROFILE_ICONS[battleCard.icon1] || Zap;
    
    const isBattleIcon2Custom = battleCard.icon2.startsWith('data:');
    const BattleIcon2 = isBattleIcon2Custom ? 'img' : PROFILE_ICONS[battleCard.icon2] || Skull;

    // Get player role if in club
    const playerMember = club?.members.find(m => m.isPlayer);
    const playerRole = playerMember?.role;

    const handleNameSave = () => {
        if (tempName.trim().length > 2) {
            onNameChange(tempName.trim());
            setIsEditingName(false);
        }
    };

    const handleIconSelect = (key: string) => {
        if (iconSelectorMode === 'PROFILE') {
            onIconChange(key);
        } else if (iconSelectorMode === 'BATTLE_ICON_1') {
            onUpdateBattleCard({ ...battleCard, icon1: key });
        } else if (iconSelectorMode === 'BATTLE_ICON_2') {
            onUpdateBattleCard({ ...battleCard, icon2: key });
        }
        setIconSelectorMode(null);
    };

    const handlePinSelect = (seed: string) => {
        onUpdateBattleCard({ ...battleCard, pin: seed, pinImage: undefined }); // Clear custom image if preset selected
        setIconSelectorMode(null);
    };

    const handleTitleSelect = (title: string) => {
        onUpdateBattleCard({ ...battleCard, title: title });
        setIconSelectorMode(null);
    };

    const handleCustomTitleSave = () => {
        if (customTitle.trim().length > 0) {
            onUpdateBattleCard({ ...battleCard, title: customTitle.trim().toUpperCase() });
            setIconSelectorMode(null);
            setCustomTitle('');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateBattleCard({ 
                    ...battleCard, 
                    pin: 'custom', 
                    pinImage: reader.result as string 
                });
                setIconSelectorMode(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onIconChange(reader.result as string);
                setIconSelectorMode(null);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-[#1a1a2e] flex flex-col font-sans overflow-hidden animate-scaleIn">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e3a8a] z-20 border-b-4 border-black/20">
                <button onClick={onClose} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:scale-95 shadow-md">
                    <X size={28} className="text-white" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="font-brawl text-2xl text-white uppercase drop-shadow-md">PROFİL</span>
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="flex-1 flex flex-col md:flex-row relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0055d4] to-[#1e1e24] -z-20"></div>
                <div className="absolute inset-0 bg-[url('https://api.placeholder.com/100')] opacity-10 bg-repeat -z-10"></div>

                {/* --- LEFT COLUMN: BRAWLER & BATTLE CARD --- */}
                <div className="w-full md:w-[45%] relative flex flex-col justify-between p-4 md:p-0 overflow-hidden">
                    
                    {/* Brawler Display Area */}
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        {/* Burst Background behind brawler */}
                        <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent opacity-50 scale-150"></div>
                        
                        <div className="relative w-full h-full flex items-center justify-center cursor-pointer group" onClick={() => setIsSelectingBrawler(true)}>
                             {/* Click indicator */}
                             <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="bg-black/60 text-white font-bold px-4 py-2 rounded-lg border-2 border-white backdrop-blur-sm animate-bounce">
                                     DEĞİŞTİR
                                 </div>
                             </div>

                             {/* Visual */}
                             <div className="relative z-10 animate-bounce-slow scale-[1.5]">
                                 <DetailedBrawlerFigure type={favoriteBrawler} />
                             </div>
                             {/* Shadow */}
                             <div className="absolute bottom-20 w-48 h-8 bg-black/40 blur-lg rounded-[100%]"></div>
                        </div>

                        {/* Brawler Info */}
                        <div className="absolute bottom-32 md:bottom-40 left-4 md:left-8 flex flex-col items-start z-20 pointer-events-none">
                            <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest bg-black/40 px-2 rounded mb-1">
                                EN SEVDİĞİM SAVAŞÇI
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="bg-white p-1 rounded-lg border-2 border-black shadow-sm">
                                    <Settings size={16} className="text-black" />
                                </div>
                                <span className="font-brawl text-4xl text-white uppercase drop-shadow-[0_4px_0_rgba(0,0,0,1)] stroke-black" style={{ WebkitTextStroke: '1.5px black' }}>
                                    {brawlerConfig.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Battle Card (Bottom Left) */}
                    <div className="relative md:absolute bottom-4 left-4 right-4 md:right-auto md:w-80 flex flex-col gap-1 z-20">
                        <div className="h-24 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] rounded-xl border-4 border-black shadow-xl flex items-center p-2 gap-3 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-3 py-0.5 rounded-full border border-white/20 uppercase">
                                SAVAŞ KARTI
                            </div>
                            
                            {/* Icon 1 */}
                            <div 
                                className="w-16 h-16 bg-[#fbbf24] rounded-lg border-2 border-black flex items-center justify-center shadow-inner relative overflow-hidden cursor-pointer hover:brightness-110 active:scale-95"
                                onClick={() => setIconSelectorMode('BATTLE_ICON_1')}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-500"></div>
                                {isBattleIcon1Custom ? (
                                    <img src={battleCard.icon1} className="w-full h-full object-cover relative z-10" />
                                ) : (
                                    <BattleIcon1 size={32} className="text-white relative z-10 drop-shadow-md" />
                                )}
                            </div>
                            {/* Icon 2 */}
                            <div 
                                className="w-16 h-16 bg-[#ef4444] rounded-lg border-2 border-black flex items-center justify-center shadow-inner relative overflow-hidden cursor-pointer hover:brightness-110 active:scale-95"
                                onClick={() => setIconSelectorMode('BATTLE_ICON_2')}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-700"></div>
                                {isBattleIcon2Custom ? (
                                    <img src={battleCard.icon2} className="w-full h-full object-cover relative z-10" />
                                ) : (
                                    <BattleIcon2 size={32} className="text-white relative z-10 drop-shadow-md" />
                                )}
                            </div>
                            {/* Pin */}
                            <div 
                                className="w-20 h-16 bg-white rounded-lg border-2 border-black flex items-center justify-center shadow-sm relative ml-auto cursor-pointer hover:bg-gray-100 active:scale-95 overflow-hidden"
                                onClick={() => setIconSelectorMode('PIN')}
                            >
                                {battleCard.pinImage ? (
                                    <img src={battleCard.pinImage} alt="Custom Pin" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${battleCard.pin}`} alt="Pin" className="w-12 h-12" />
                                )}
                                
                                <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 border border-black">
                                    <Edit2 size={8} className="text-white" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Title Bar */}
                        <div 
                            className="bg-black/80 border-2 border-white/20 rounded-lg py-1 px-3 text-center cursor-pointer hover:bg-black transition-colors flex items-center justify-center gap-2"
                            onClick={() => setIconSelectorMode('TITLE')}
                        >
                            <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest truncate">
                                {battleCard.title || 'ÜNVAN SEÇ'}
                            </span>
                            <Edit2 size={10} className="text-white opacity-50" />
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: STATS --- */}
                <div className="w-full md:w-[55%] bg-[#152860]/90 backdrop-blur-md md:skew-x-[-5deg] md:translate-x-4 border-l-4 border-black shadow-[-10px_0_20px_rgba(0,0,0,0.5)] flex flex-col p-4 md:p-8 h-full overflow-y-auto custom-scrollbar relative z-10">
                    
                    {/* Un-skew content container */}
                    <div className="md:skew-x-[5deg] h-full flex flex-col gap-6">
                        
                        {/* HEADER SECTION */}
                        <div className="flex gap-4 items-start">
                            {/* Profile Icon Box */}
                            <div 
                                className="relative w-24 h-24 bg-[#1e40af] rounded-xl border-4 border-black shadow-lg cursor-pointer group hover:scale-105 transition-transform overflow-hidden"
                                onClick={() => setIconSelectorMode('PROFILE')}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] z-0"></div>
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    {isCustomIcon ? (
                                        <img src={profileIcon} className="w-full h-full object-cover" />
                                    ) : (
                                        <CurrentIcon size={48} className="text-white drop-shadow-lg" />
                                    )}
                                </div>
                                <div className="absolute top-1 left-1 bg-white p-0.5 rounded border border-black z-20">
                                    <Settings size={10} className="text-black" />
                                </div>
                                {/* Player Tag Badge */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-white/20 whitespace-nowrap z-20">
                                    #{playerTag}
                                </div>
                            </div>

                            {/* Name & Club Info */}
                            <div className="flex-1 flex flex-col gap-2">
                                {/* NAME EDITOR */}
                                <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-lg border-2 border-black/50 shadow-inner h-14">
                                    {isEditingName ? (
                                        <div className="flex items-center gap-2 w-full">
                                            <input 
                                                autoFocus
                                                type="text" 
                                                value={tempName} 
                                                onChange={(e) => setTempName(e.target.value)}
                                                maxLength={12}
                                                className="bg-transparent border-none outline-none font-brawl text-2xl text-white w-full uppercase"
                                            />
                                            <button onClick={handleNameSave} className="bg-green-500 p-1 rounded border border-black">
                                                <Check size={16} className="text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="font-brawl text-2xl md:text-3xl text-[#38bdf8] drop-shadow-md tracking-wider truncate">
                                                {playerName}
                                            </span>
                                            <div className="ml-auto flex gap-2">
                                                <button 
                                                    onClick={() => setIsEditingName(true)}
                                                    className="bg-gradient-to-r from-pink-500 to-purple-500 p-1.5 rounded-lg border-2 border-black active:scale-95 shadow-sm"
                                                >
                                                    <Edit2 size={16} className="text-white" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 bg-[#1e1e24] p-2 rounded-lg border-2 border-black/50 shadow-inner">
                                    <div className="w-8 h-8 bg-yellow-400 rounded border border-black flex items-center justify-center">
                                        {club ? <Shield size={16} className="text-black" /> : <Users size={16} className="text-black"/>}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-brawl text-sm uppercase leading-none">
                                            {club ? club.name : 'KULÜPSÜZ'}
                                        </span>
                                        <span className="text-white/50 text-[10px] font-bold uppercase">
                                            {club ? (playerRole || 'ÜYE') : 'KATIL'}
                                        </span>
                                    </div>
                                    <div className="ml-auto">
                                        <button className="bg-white p-1.5 rounded-lg border-2 border-black active:scale-95">
                                            <Share2 size={16} className="text-black" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ICON / PIN / TITLE SELECTOR MODAL (Inline) */}
                        {iconSelectorMode && (
                            <div className="bg-[#0f172a] border-2 border-white/20 p-3 rounded-xl mb-2 animate-fadeIn relative">
                                <div className="text-white text-xs font-bold uppercase mb-2">
                                    {iconSelectorMode === 'PROFILE' ? 'PROFİL İKONU SEÇ' : 
                                     iconSelectorMode === 'PIN' ? 'EMOJİ / RESİM SEÇ' : 
                                     iconSelectorMode === 'TITLE' ? 'ÜNVAN SEÇ' : 'SAVAŞ KARTI İKONU SEÇ'}
                                </div>
                                
                                {iconSelectorMode === 'PIN' ? (
                                    <div className="flex flex-col gap-3">
                                        {/* Upload Section */}
                                        <label className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 p-2 rounded-lg border-2 border-black cursor-pointer group transition-colors">
                                            <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-black">
                                                <Upload size={20} className="text-blue-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-brawl uppercase text-sm">Resim Yükle</span>
                                                <span className="text-blue-200 text-[10px] font-bold">Cihazından dosya seç</span>
                                            </div>
                                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                        </label>

                                        <div className="text-white/50 text-[10px] font-bold uppercase text-center">- VEYA HAZIR EMOJİ SEÇ -</div>

                                        {/* Presets Grid */}
                                        <div className="grid grid-cols-4 gap-2">
                                            {PIN_SEEDS.map((seed) => (
                                                <button 
                                                    key={seed}
                                                    onClick={() => handlePinSelect(seed)}
                                                    className={`p-2 rounded-lg border-2 flex items-center justify-center transition-all bg-white border-black hover:bg-gray-200 ${battleCard.pin === seed ? 'bg-yellow-200' : ''}`}
                                                >
                                                    <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`} alt="Pin" className="w-8 h-8" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : iconSelectorMode === 'TITLE' ? (
                                    <div className="flex flex-col gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                                        {/* Custom Title Input */}
                                        <div className="flex gap-2 mb-2">
                                            <input 
                                                type="text" 
                                                className="flex-1 bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-sm font-bold uppercase placeholder:text-white/30 outline-none focus:border-yellow-400"
                                                placeholder="ÖZEL ÜNVAN OLUŞTUR..."
                                                maxLength={20}
                                                value={customTitle}
                                                onChange={(e) => setCustomTitle(e.target.value)}
                                            />
                                            <button 
                                                onClick={handleCustomTitleSave}
                                                className="bg-green-500 hover:bg-green-400 text-white font-bold text-xs px-3 rounded border border-black"
                                            >
                                                AYARLA
                                            </button>
                                        </div>
                                        
                                        <div className="text-white/50 text-[10px] font-bold uppercase text-center mb-1">- HAZIR ÜNVANLAR -</div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {PLAYER_TITLES.map((title) => (
                                                <button 
                                                    key={title}
                                                    onClick={() => handleTitleSelect(title)}
                                                    className={`
                                                        px-2 py-1.5 rounded border text-[10px] font-bold uppercase transition-all truncate
                                                        ${battleCard.title === title ? 'bg-yellow-400 text-black border-yellow-600' : 'bg-slate-700 text-white border-slate-900 hover:bg-slate-600'}
                                                    `}
                                                >
                                                    {title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {/* New: Custom Icon Upload for Profile */}
                                        {iconSelectorMode === 'PROFILE' && (
                                            <label className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 p-2 rounded-lg border-2 border-black cursor-pointer group transition-colors mb-2">
                                                <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-black">
                                                    <Upload size={16} className="text-purple-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-brawl uppercase text-xs">RESİM YÜKLE</span>
                                                    <span className="text-purple-200 text-[9px] font-bold">Galeriden seç</span>
                                                </div>
                                                <input type="file" accept="image/*" onChange={handleProfileIconUpload} className="hidden" />
                                            </label>
                                        )}

                                        <div className="grid grid-cols-6 gap-2">
                                            {Object.entries(PROFILE_ICONS).map(([key, Icon]) => (
                                                <button 
                                                    key={key}
                                                    onClick={() => handleIconSelect(key)}
                                                    className={`p-2 rounded-lg border-2 flex items-center justify-center transition-all 
                                                        ${(iconSelectorMode === 'PROFILE' && profileIcon === key) || 
                                                          (iconSelectorMode === 'BATTLE_ICON_1' && battleCard.icon1 === key) ||
                                                          (iconSelectorMode === 'BATTLE_ICON_2' && battleCard.icon2 === key)
                                                          ? 'bg-green-500 border-white scale-110' : 'bg-black/40 border-black/20 hover:bg-black/60'}`}
                                                >
                                                    <Icon size={20} className="text-white" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={() => setIconSelectorMode(null)}
                                    className="absolute top-2 right-2 text-white/50 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {/* STATS GRID */}
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {/* ... [Stats Boxes Unchanged] ... */}
                            <div className="bg-[#1e40af] p-2 rounded-lg border-2 border-black/20 flex flex-col relative group hover:bg-[#2563eb] transition-colors">
                                <div className="flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Trophy size={24} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />
                                </div>
                                <div className="text-center mt-3 mb-1 text-white font-brawl text-sm uppercase">KUPA</div>
                                <div className="bg-black/30 rounded px-2 py-1 flex justify-between items-center mb-1">
                                    <span className="text-[9px] text-white/60 font-bold uppercase">ŞU ANKİ</span>
                                    <span className="text-white font-bold text-sm">{totalTrophies}</span>
                                </div>
                                <div className="bg-black/30 rounded px-2 py-1 flex justify-between items-center">
                                    <span className="text-[9px] text-white/60 font-bold uppercase">REKOR</span>
                                    <span className="text-white font-bold text-sm">{highestTrophies}</span>
                                </div>
                            </div>

                            <div className="bg-[#6b21a8] p-2 rounded-lg border-2 border-black/20 flex flex-col relative group hover:bg-[#7e22ce] transition-colors">
                                <div className="flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2 bg-white rounded-full p-0.5 border border-black">
                                    <Shield size={20} className="text-purple-600 fill-purple-200" />
                                </div>
                                <div className="text-center mt-3 mb-1 text-white font-brawl text-sm uppercase">AŞAMALI</div>
                                <div className="bg-black/30 rounded px-2 py-1 flex justify-between items-center mb-1">
                                    <span className="text-[9px] text-white/60 font-bold uppercase">ŞU ANKİ</span>
                                    <span className="text-[#fbbf24] font-bold text-xs flex items-center gap-1"><Star size={10} /> I</span>
                                </div>
                                <div className="bg-black/30 rounded px-2 py-1 flex justify-between items-center">
                                    <span className="text-[9px] text-white/60 font-bold uppercase">EN YÜKSEK</span>
                                    <span className="text-[#fbbf24] font-bold text-xs flex items-center gap-1"><Star size={10} /> II</span>
                                </div>
                            </div>

                            <div className="bg-[#1e3a8a] p-2 rounded-lg border border-white/10 flex items-center gap-3 shadow-sm">
                                <div className="w-10 h-10 bg-red-500 rounded border-2 border-black flex items-center justify-center shadow-md">
                                    <Users size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-white/70 font-bold uppercase">3'E 3 ZAFER</span>
                                    <span className="text-white font-brawl text-lg leading-none">{threeVsThreeVictories}</span>
                                </div>
                            </div>

                            <div className="bg-[#1e3a8a] p-2 rounded-lg border border-white/10 flex items-center gap-3 shadow-sm">
                                <div className="w-10 h-10 bg-green-500 rounded border-2 border-black flex items-center justify-center shadow-md">
                                    <Skull size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-white/70 font-bold uppercase">TEK ZAFER</span>
                                    <span className="text-white font-brawl text-lg leading-none">{soloVictories}</span>
                                </div>
                            </div>

                            <div className="bg-[#1e3a8a] p-2 rounded-lg border border-white/10 flex items-center gap-3 shadow-sm">
                                <div className="w-10 h-10 bg-orange-500 rounded border-2 border-black flex items-center justify-center shadow-md">
                                    <User size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-white/70 font-bold uppercase">ÇİFT ZAFER</span>
                                    <span className="text-white font-brawl text-lg leading-none">{duoVictories}</span>
                                </div>
                            </div>

                            <div className="bg-[#1e3a8a] p-2 rounded-lg border border-white/10 flex items-center gap-3 shadow-sm">
                                <div className="w-10 h-10 bg-yellow-500 rounded border-2 border-black flex items-center justify-center shadow-md">
                                    <Zap size={20} className="text-white fill-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-white/70 font-bold uppercase">MAKS. ZAFER</span>
                                    <span className="text-white font-brawl text-lg leading-none">{maxChallengeWins}</span>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM BANNER */}
                        {club && (
                            <div className="mt-auto bg-[#1e40af] border-2 border-black p-2 rounded-lg flex items-center gap-3 shadow-lg">
                                <div className="w-12 h-12 bg-blue-600 rounded border-2 border-black flex items-center justify-center">
                                    <Shield size={32} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-brawl text-white text-lg uppercase tracking-wide">{club.name}</span>
                                    <span className="text-[10px] text-blue-200 font-bold uppercase">{playerRole || 'ÜYE'}</span>
                                </div>
                            </div>
                        )}
                        {!club && (
                             <div className="mt-auto bg-black/40 border-2 border-white/10 p-2 rounded-lg flex items-center justify-center gap-3 border-dashed">
                                 <span className="text-white/50 font-bold text-xs uppercase">KULÜP YOK</span>
                             </div>
                        )}

                    </div>
                </div>
            </div>

            {/* --- FAVORITE BRAWLER SELECTOR MODAL --- */}
            {isSelectingBrawler && (
                <div className="absolute inset-0 z-[70] bg-[#1e3a8a] flex flex-col animate-scaleIn">
                    <div className="flex items-center justify-between p-4 bg-[#1e40af] border-b-4 border-black/20">
                        <button onClick={() => setIsSelectingBrawler(false)} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1">
                            <X size={24} className="text-white" />
                        </button>
                        <h2 className="text-2xl font-brawl text-white uppercase drop-shadow-md">FAVORİ SAVAŞÇI SEÇ</h2>
                        <div className="w-10"></div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-3 bg-[url('https://api.placeholder.com/50')] bg-repeat">
                        {unlockedBrawlers.map(type => {
                            const config = BRAWLERS[type];
                            const rarity = RARITY_INFO[config.rarity];
                            
                            return (
                                <div 
                                    key={type}
                                    onClick={() => {
                                        onSelectFavoriteBrawler(type);
                                        setIsSelectingBrawler(false);
                                    }}
                                    className={`
                                        aspect-square rounded-xl border-4 border-black bg-gradient-to-b ${rarity.bgGradient} relative flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform
                                        ${favoriteBrawler === type ? 'border-yellow-400 shadow-[0_0_15px_rgba(255,255,0,0.5)] scale-105 z-10' : ''}
                                    `}
                                >
                                    <div className="text-white drop-shadow-md mb-2 scale-75">
                                        <DetailedBrawlerFigure type={type} />
                                    </div>
                                    <span className="text-white font-brawl text-sm uppercase stroke-black drop-shadow-md" style={{ WebkitTextStroke: '0.5px black' }}>
                                        {config.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;
