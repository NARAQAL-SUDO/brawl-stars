import React, { useEffect, useState } from 'react';
import { GameStats, BrawlerType } from '../types';
import { RotateCcw, Home, Trophy, Sword, Target, Shield, Bomb, Skull, User, Crosshair, Droplet, Zap, Star, Crown } from 'lucide-react';
import { BRAWLERS, RARITY_INFO } from '../constants';
import { generateMatchCommentary } from '../services/geminiService';

interface GameOverProps {
  stats: GameStats;
  totalTrophies: number;
  onRestart: () => void;
  onHome: () => void;
  playerBrawlerType: BrawlerType; // To display the character model
}

// --- DETAILED BRAWLER RENDERER ---
const DetailedBrawlerFigure = ({ type, skin }: { type: BrawlerType, skin?: string }) => {
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

const GameOver: React.FC<GameOverProps> = ({ stats, totalTrophies, onRestart, onHome, playerBrawlerType }) => {
    const [commentary, setCommentary] = useState<string>('');

    useEffect(() => {
        const fetchCommentary = async () => {
            const text = await generateMatchCommentary(stats);
            setCommentary(text);
        };
        fetchCommentary();
    }, [stats]);

    const isVictory = stats.rank === 1;
    const isTop3 = stats.rank <= 3;
    const trophyColor = stats.trophyChange > 0 ? 'text-green-400' : stats.trophyChange < 0 ? 'text-red-500' : 'text-slate-400';

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden animate-fadeIn">
            {/* Background */}
            <div className={`absolute inset-0 ${isVictory ? 'bg-gradient-to-b from-yellow-500 to-orange-600' : 'bg-gradient-to-b from-slate-800 to-black'} -z-20`}></div>
            {isVictory && (
                <div className="absolute inset-0 bg-[url('https://api.placeholder.com/100')] opacity-10 bg-repeat animate-spin-slow origin-center scale-[3] -z-10"></div>
            )}

            {/* Victory/Defeat Banner */}
            <div className={`
                w-full py-6 text-center transform -skew-y-3 mb-8 shadow-2xl border-y-4 border-black
                ${isVictory ? 'bg-[#facc15]' : isTop3 ? 'bg-[#3b82f6]' : 'bg-[#ef4444]'}
            `}>
                <h1 className="font-brawl text-6xl md:text-8xl text-white drop-shadow-[0_5px_0_#000] stroke-black tracking-widest" style={{ WebkitTextStroke: '3px black' }}>
                    {isVictory ? 'HESAPLAŞMA!' : isTop3 ? 'ZAFER!' : 'YENİLGİ'}
                </h1>
                <div className="text-white font-bold text-xl uppercase tracking-[0.5em] drop-shadow-md mt-2">
                    {isVictory ? '1. Sıradasın' : `${stats.rank}. Sıradasın`}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 z-10 w-full max-w-5xl px-4">
                
                {/* Left: Character & Rank */}
                <div className="flex flex-col items-center animate-slideRight">
                    <div className="relative scale-125 mb-8">
                        <DetailedBrawlerFigure type={playerBrawlerType} />
                        {isVictory && (
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                                <Crown size={64} className="text-yellow-400 fill-yellow-400 drop-shadow-lg animate-bounce" />
                            </div>
                        )}
                    </div>
                    
                    {/* Commentary Bubble */}
                    {commentary && (
                        <div className="relative bg-white text-black p-4 rounded-xl border-4 border-black max-w-xs text-center font-bold text-sm shadow-lg animate-popIn">
                            "{commentary}"
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-4 border-l-4 border-black transform rotate-45"></div>
                        </div>
                    )}
                </div>

                {/* Right: Stats Panel */}
                <div className="flex-1 bg-[#1e1e24] border-4 border-black rounded-xl p-6 shadow-2xl w-full max-w-md animate-slideLeft">
                    
                    {/* Trophies Result */}
                    <div className="flex justify-center items-center mb-6 gap-2 bg-black/40 p-2 rounded-lg border border-white/10">
                        <Trophy size={48} className={`fill-current ${trophyColor}`} />
                        <span className={`font-brawl text-5xl ${trophyColor} drop-shadow-md`}>
                            {stats.trophyChange > 0 ? `+${stats.trophyChange}` : stats.trophyChange}
                        </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#2d2d35] p-3 rounded-lg flex flex-col items-center border border-white/10">
                            <span className="text-slate-400 text-xs font-bold uppercase mb-1">LEŞ</span>
                            <div className="flex items-center gap-2">
                                <Skull size={20} className="text-white" />
                                <span className="font-brawl text-2xl text-white">{stats.kills}</span>
                            </div>
                        </div>
                        <div className="bg-[#2d2d35] p-3 rounded-lg flex flex-col items-center border border-white/10">
                            <span className="text-slate-400 text-xs font-bold uppercase mb-1">HASAR</span>
                            <div className="flex items-center gap-2">
                                <Target size={20} className="text-red-400" />
                                <span className="font-brawl text-2xl text-white">{(stats.kills * 3000 + stats.powerCubesCollected * 500).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="bg-[#2d2d35] p-3 rounded-lg flex flex-col items-center border border-white/10">
                            <span className="text-slate-400 text-xs font-bold uppercase mb-1">SÜRE</span>
                            <div className="flex items-center gap-2">
                                <RotateCcw size={20} className="text-blue-400" />
                                <span className="font-brawl text-2xl text-white">{Math.floor(stats.duration / 1000)}s</span>
                            </div>
                        </div>
                        {stats.masteryPointsGained !== undefined && stats.masteryPointsGained > 0 && (
                            <div className="bg-[#2d2d35] p-3 rounded-lg flex flex-col items-center border border-purple-500/30">
                                <span className="text-purple-300 text-xs font-bold uppercase mb-1">USTALIK</span>
                                <div className="flex items-center gap-2">
                                    <Shield size={20} className="text-purple-400" />
                                    <span className="font-brawl text-2xl text-purple-400">+{stats.masteryPointsGained}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar (Experience/Tokens) */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs font-bold text-white mb-1 uppercase">
                            <span>Jetonlar</span>
                            <span className="text-yellow-400">+20</span>
                        </div>
                        <div className="w-full h-4 bg-black rounded-full overflow-hidden border border-white/20">
                            <div className="h-full bg-blue-500 w-3/4"></div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button 
                            onClick={onHome}
                            className="flex-1 bg-white hover:bg-slate-200 text-black font-brawl text-xl py-3 rounded-lg border-b-4 border-slate-400 active:border-b-0 active:translate-y-1 shadow-lg uppercase flex items-center justify-center gap-2"
                        >
                            <Home size={20} /> ÇIKIŞ
                        </button>
                        <button 
                            onClick={onRestart}
                            className="flex-[2] bg-yellow-400 hover:bg-yellow-300 text-black font-brawl text-xl py-3 rounded-lg border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 shadow-lg uppercase flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={20} /> TEKRAR OYNA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameOver;