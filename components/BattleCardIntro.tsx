import React, { useEffect, useState } from 'react';
import { BrawlerType, BattleCardData, Character, GameMode } from '../types';
import { BRAWLERS, RARITY_INFO, PLAYER_TITLES } from '../constants';
import { 
    Skull, Zap, Crown, Ghost, Smile, Flame, Heart, Star, Sparkles, Sword, Target, Shield, Bomb, Crosshair, Droplet, User, ThumbsDown, ThumbsUp,
    Gamepad2, Rocket, Music, Sun, Moon, Anchor, Bug, Coffee, Fingerprint
} from 'lucide-react';

interface BattleCardIntroProps {
    playerName: string;
    playerTitle?: string;
    brawlerType: BrawlerType;
    skin?: string;
    battleCard: BattleCardData;
    onIntroComplete: () => void;
    opponents: Character[]; 
    gameMode: GameMode;
    masteryRank: string;
}

const PROFILE_ICONS: Record<string, React.ElementType> = {
    'SKULL': Skull, 'ZAP': Zap, 'CROWN': Crown, 'GHOST': Ghost,
    'SMILE': Smile, 'FLAME': Flame, 'HEART': Heart, 'STAR': Star,
    'SPARKLES': Sparkles, 'SWORD': Sword, 'TARGET': Target, 'SHIELD': Shield,
    'GAMEPAD': Gamepad2, 'ROCKET': Rocket, 'MUSIC': Music, 'SUN': Sun,
    'MOON': Moon, 'ANCHOR': Anchor, 'BUG': Bug, 'COFFEE': Coffee, 'FINGERPRINT': Fingerprint
};

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

const BattleCardIntro: React.FC<BattleCardIntroProps> = ({ 
    playerName, 
    playerTitle = "YILDIZ OYUNCU", 
    brawlerType, 
    skin, 
    battleCard, 
    onIntroComplete,
    opponents,
    gameMode,
    masteryRank
}) => {
    const [animationState, setAnimationState] = useState<'HIDDEN' | 'ENTER' | 'VS' | 'EXIT'>('HIDDEN');

    // Derived Icons
    const isIcon1Custom = battleCard.icon1.startsWith('data:');
    const Icon1 = isIcon1Custom ? 'img' : PROFILE_ICONS[battleCard.icon1] || Zap;
    
    const isIcon2Custom = battleCard.icon2.startsWith('data:');
    const Icon2 = isIcon2Custom ? 'img' : PROFILE_ICONS[battleCard.icon2] || Skull;

    useEffect(() => {
        // Animation Sequence
        setTimeout(() => setAnimationState('ENTER'), 100);
        setTimeout(() => setAnimationState('VS'), 800);
        setTimeout(() => setAnimationState('EXIT'), 3500);
        setTimeout(onIntroComplete, 4000);
    }, [onIntroComplete]);

    if (animationState === 'HIDDEN') return null;

    return (
        <div className={`fixed inset-0 z-[80] flex overflow-hidden font-sans ${animationState === 'EXIT' ? 'pointer-events-none' : ''}`}>
            
            {/* Background Split */}
            <div className={`absolute inset-0 flex transition-transform duration-500 ease-out ${animationState === 'EXIT' ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
                {/* Blue Side (Player) */}
                {/* Fixed narrowed type check by removing redundant HIDDEN check */}
                <div className={`w-[60%] h-full bg-[#3b82f6] transform skew-x-[-10deg] -ml-20 border-r-4 border-black relative z-10 transition-transform duration-700 ${animationState === 'ENTER' ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="absolute inset-0 bg-[url('https://api.placeholder.com/100')] opacity-10 bg-repeat skew-x-[10deg]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a] to-transparent"></div>
                </div>
                
                {/* Red Side (Opponents) */}
                {/* Fixed narrowed type check by removing redundant HIDDEN check */}
                <div className={`flex-1 h-full bg-[#ef4444] relative z-0 transition-transform duration-700 ${animationState === 'ENTER' ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="absolute inset-0 bg-[url('https://api.placeholder.com/100')] opacity-10 bg-repeat"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-[#991b1b] to-transparent"></div>
                </div>
            </div>

            {/* VS Text */}
            <div className={`absolute inset-0 flex items-center justify-center z-30 transition-all duration-500 ${animationState === 'VS' ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}>
                <div className="relative">
                    <span className="font-brawl text-9xl text-yellow-400 drop-shadow-[0_10px_0_#000] stroke-black z-10 relative" style={{ WebkitTextStroke: '4px black' }}>VS</span>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/20 rounded-full blur-xl -z-10 animate-pulse"></div>
                </div>
            </div>

            {/* --- PLAYER CARD (LEFT) --- */}
            <div className={`absolute bottom-0 left-0 top-0 w-1/2 z-20 flex flex-col justify-center items-center md:items-start md:pl-20 transition-all duration-700 ${animationState === 'ENTER' ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0'}`}>
                <div className="relative animate-slideRight">
                    {/* Brawler Model */}
                    <div className="scale-[1.8] md:scale-[2.5] origin-bottom mb-10 drop-shadow-2xl filter brightness-110">
                        <DetailedBrawlerFigure type={brawlerType} skin={skin} />
                    </div>

                    {/* Info Card */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-80 bg-[#1e1e24] border-4 border-black rounded-xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col gap-1">
                        {/* Battle Card Header */}
                        <div className="h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg border-2 border-black flex items-center p-2 gap-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://api.placeholder.com/20')] opacity-20"></div>
                            
                            <div className="w-14 h-14 bg-[#fbbf24] rounded-lg border-2 border-black flex items-center justify-center shadow-inner relative z-10 overflow-hidden">
                                {isIcon1Custom ? (
                                    <img src={battleCard.icon1} className="w-full h-full object-cover" />
                                ) : (
                                    <Icon1 size={28} className="text-white drop-shadow-md" />
                                )}
                            </div>
                            <div className="w-14 h-14 bg-[#ef4444] rounded-lg border-2 border-black flex items-center justify-center shadow-inner relative z-10 overflow-hidden">
                                {isIcon2Custom ? (
                                    <img src={battleCard.icon2} className="w-full h-full object-cover" />
                                ) : (
                                    <Icon2 size={28} className="text-white drop-shadow-md" />
                                )}
                            </div>
                            
                            <div className="w-16 h-14 bg-white rounded-lg border-2 border-black flex items-center justify-center shadow-sm ml-auto overflow-hidden relative z-10">
                                {battleCard.pinImage ? (
                                    <img src={battleCard.pinImage} alt="Pin" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${battleCard.pin}`} alt="Pin" className="w-10 h-10" />
                                )}
                            </div>
                        </div>

                        {/* Player Name & Title */}
                        <div className="bg-black/40 rounded-lg p-2 text-center border border-white/10">
                            <h2 className="text-blue-400 font-brawl text-2xl uppercase leading-none drop-shadow-md">{playerName}</h2>
                            <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">{playerTitle}</span>
                        </div>

                        {/* Mastery Rank */}
                        <div className="absolute -top-4 -right-4 bg-purple-600 border-2 border-black rounded-full px-3 py-1 flex items-center gap-1 shadow-lg transform rotate-12">
                            <Crown size={12} className="text-white fill-white" />
                            <span className="text-white text-[10px] font-bold uppercase">{masteryRank}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- OPPONENTS (RIGHT) --- */}
            <div className={`absolute top-0 right-0 bottom-0 w-1/2 z-20 flex flex-col justify-center items-center md:items-end md:pr-20 transition-all duration-700 delay-100 ${animationState === 'ENTER' ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0'}`}>
                
                {/* List of opponents (Just first 3 for visual) */}
                <div className="flex flex-col gap-4 animate-slideLeft">
                    {opponents.slice(0, 3).map((opp, idx) => (
                        <div key={opp.id} className="relative w-72 h-20 bg-[#1e1e24] border-4 border-black rounded-xl p-1 flex items-center gap-3 shadow-xl transform hover:scale-105 transition-transform">
                            {/* Opponent Portrait */}
                            <div className="w-16 h-16 bg-[#ef4444] rounded-lg border-2 border-black flex items-center justify-center overflow-hidden shrink-0 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-800"></div>
                                <div className="scale-75 text-white drop-shadow-md relative z-10">
                                    <DetailedBrawlerFigure type={opp.type} />
                                </div>
                            </div>

                            {/* Opponent Info */}
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-brawl text-red-400 text-xl uppercase truncate">{opp.name}</span>
                                <span className="text-white/50 text-[10px] font-bold uppercase">{BRAWLERS[opp.type].name}</span>
                            </div>

                            {/* Rank Icon (Fake) */}
                            <div className="w-10 flex flex-col items-center">
                                <div className="w-8 h-8 bg-black/40 rounded border border-white/10 flex items-center justify-center">
                                    <Skull size={16} className="text-red-500" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* "And X Others" Badge if more */}
                    {opponents.length > 3 && (
                        <div className="bg-black/60 text-white font-bold text-sm px-4 py-2 rounded-full border border-white/20 self-center uppercase tracking-wider">
                            + {opponents.length - 3} RAKİP DAHA
                        </div>
                    )}
                </div>
            </div>

            {/* Game Mode Banner */}
            <div className={`absolute top-10 left-1/2 -translate-x-1/2 z-40 bg-black/50 backdrop-blur-md px-8 py-2 rounded-xl border-2 border-white/20 transition-all duration-500 ${animationState === 'ENTER' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                <span className="text-white font-brawl text-2xl uppercase tracking-widest drop-shadow-md">
                    {gameMode === GameMode.SOLO ? 'TEK HESAPLAŞMA' : gameMode === GameMode.DUO ? 'ÇİFT HESAPLAŞMA' : 'NAKAVT'}
                </span>
            </div>

        </div>
    );
};

export default BattleCardIntro;