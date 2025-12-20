
import React, { useRef, useEffect, useState } from 'react';
import { BRAWL_PASS_TIERS, BRAWL_PASS_COST, MOCK_QUESTS } from '../constants';
import { BrawlPassTier, BrawlPassReward, Quest } from '../types';
import { 
    ArrowLeft, Home, Lock, Zap, Skull, Shield, 
    Star, Check, Gift, Gem, Smile, Heart, Target, Sword 
} from 'lucide-react';

interface BrawlPassScreenProps {
    onClose: () => void;
    currentTokens: number;
    currentTier: number;
    hasPass: boolean;
    claimedFreeRewards: number[];
    claimedPaidRewards: number[];
    onClaimReward: (tier: number, isPaid: boolean) => void;
    onBuyPass: () => void;
    gems: number;
    onBuyTier?: () => void;
}

const ITEM_WIDTH = 160;

const BrawlPassScreen: React.FC<BrawlPassScreenProps> = ({ 
    onClose, currentTokens, currentTier, hasPass,
    claimedFreeRewards, claimedPaidRewards, onClaimReward,
    onBuyPass, gems, onBuyTier
}) => {
    const [activeTab, setActiveTab] = useState<'REWARDS' | 'QUESTS'>('REWARDS');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll to current tier
    useEffect(() => {
        if (scrollRef.current) {
            const scrollX = Math.max(0, ((currentTier - 1) * ITEM_WIDTH) - (window.innerWidth / 2) + (ITEM_WIDTH / 2));
            scrollRef.current.scrollLeft = scrollX;
        }
    }, [currentTier, activeTab]);

    // Calculate progress for current tier bar
    const currentTierData = BRAWL_PASS_TIERS[currentTier] || BRAWL_PASS_TIERS[BRAWL_PASS_TIERS.length - 1];
    
    // For Top Bar
    const progressPercent = Math.min(100, (currentTokens / currentTierData.requiredTokens) * 100);

    const renderRewardItem = (reward: BrawlPassReward, tier: number, isPaid: boolean) => {
        const isReached = tier <= currentTier; 
        const isClaimed = isPaid ? claimedPaidRewards.includes(tier) : claimedFreeRewards.includes(tier);
        const isLocked = isPaid && !hasPass;
        
        let bgColor = isPaid ? 'bg-[#ffcc00]' : 'bg-[#3b82f6]'; 
        if (!isReached) bgColor = 'bg-slate-700';

        return (
            <div 
                onClick={() => {
                    if (isReached && !isClaimed && !isLocked) {
                        onClaimReward(tier, isPaid);
                    }
                }}
                className={`
                    w-32 h-32 rounded-lg border-4 border-black relative flex flex-col items-center justify-center shadow-lg transition-all
                    ${bgColor}
                    ${isReached && !isClaimed && !isLocked ? 'cursor-pointer hover:scale-105 hover:brightness-110 animate-pulse' : ''}
                    ${isClaimed ? 'opacity-50 grayscale' : ''}
                `}
            >
                {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-sm z-20">
                        <Lock className="text-white opacity-80" size={32} />
                    </div>
                )}

                {isClaimed && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Check className="text-green-400 drop-shadow-md" size={48} strokeWidth={4} />
                    </div>
                )}

                <div className="transform scale-90">
                    {reward.type === 'GOLD' && (
                        <div className="w-16 h-16 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                            <div className="w-10 h-10 bg-yellow-300 rounded-full"></div>
                        </div>
                    )}
                    {reward.type === 'POWER_POINTS' && (
                        <div className="w-16 h-16 bg-[#ff55ff] rounded-xl border-2 border-black flex items-center justify-center rotate-3">
                            <Zap size={30} className="text-white fill-white" />
                        </div>
                    )}
                    {reward.type === 'BIG_BOX' && (
                        <div className="w-20 h-16 bg-purple-600 border-2 border-black rounded flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-purple-800 skew-x-12 -ml-1"></div>
                            <Star size={20} className="text-white z-10" />
                        </div>
                    )}
                    {reward.type === 'MEGA_BOX' && (
                        <div className="w-20 h-16 bg-yellow-400 border-2 border-black rounded flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-red-500 skew-x-12 -ml-1"></div>
                            <Star size={20} className="text-white z-10" />
                        </div>
                    )}
                    {reward.type === 'GEMS' && (
                        <div className="w-16 h-16 bg-green-500 rounded-xl border-2 border-black flex items-center justify-center">
                            <Gem size={30} className="text-green-100 fill-green-100" />
                        </div>
                    )}
                    {reward.type === 'BRAWLER_SKIN' && (
                        <div className="w-20 h-20 bg-blue-900 border-2 border-yellow-400 rounded flex items-center justify-center overflow-hidden relative">
                             <Smile size={50} className="text-white" />
                             <div className="absolute bottom-0 bg-black/50 w-full text-[8px] text-white text-center">{reward.label}</div>
                        </div>
                    )}
                </div>

                <div className="absolute -bottom-3 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                    {reward.amount > 1 ? `x${reward.amount}` : reward.type.replace('_', ' ')}
                </div>
            </div>
        );
    };

    const renderQuestIcon = (quest: Quest) => {
        return (
            <div className={`
                w-16 h-16 rounded-lg border-2 border-black flex items-center justify-center relative overflow-hidden shadow-md
                ${quest.brawlerType ? 'bg-purple-600' : 'bg-blue-500'}
            `}>
                {quest.brawlerType && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-800"></div>
                )}
                {!quest.brawlerType && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                )}

                {/* Icons */}
                <div className="z-10 text-white drop-shadow-md">
                    {quest.iconType === 'KILL' && <Skull size={32} />}
                    {quest.iconType === 'DAMAGE' && <Target size={32} />}
                    {quest.iconType === 'HEAL' && <Heart size={32} className="fill-white" />}
                    {quest.iconType === 'WIN' && <Shield size={32} />}
                    {quest.iconType === 'PLAY' && <Star size={32} />}
                </div>

                {/* Brawler Portrait Placeholder */}
                {quest.brawlerType && (
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/40 rounded-tl flex items-center justify-center">
                         <div className="text-[8px] text-white font-bold">{quest.brawlerName?.substring(0,3)}</div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col font-sans bg-[#000033]">
            {/* --- TOP HEADER --- */}
            <div className="h-20 bg-[#1e3a8a] border-b-4 border-black flex items-center px-4 justify-between relative z-20 shadow-xl">
                 <button onClick={onClose} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1">
                    <ArrowLeft size={24} className="text-white" />
                </button>
                
                <div className="flex-1 flex flex-col items-center">
                    <div className="flex bg-black/30 p-1 rounded-lg gap-1 mb-1">
                        <button 
                            onClick={() => setActiveTab('REWARDS')}
                            className={`font-brawl px-6 py-1 rounded border border-black text-sm shadow-md transition-all ${activeTab === 'REWARDS' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                        >
                            ÖDÜLLER
                        </button>
                        <button 
                            onClick={() => setActiveTab('QUESTS')}
                            className={`font-brawl px-6 py-1 rounded border border-black text-sm shadow-md transition-all flex items-center gap-1 ${activeTab === 'QUESTS' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                        >
                            <Lock size={12} /> GÖREVLER
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {onBuyTier && (
                        <button 
                            onClick={onBuyTier}
                            className="bg-green-500 hover:bg-green-400 text-white font-brawl px-3 py-1 rounded border-2 border-black active:translate-y-1 shadow-md flex items-center gap-1"
                        >
                            <div className="flex items-center gap-1 bg-black/20 px-1.5 rounded">
                                <span className="text-xs">30</span>
                                <Gem size={12} className="fill-green-200" />
                            </div>
                            <span className="text-xs">+1 KADEME</span>
                        </button>
                    )}

                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-white border-2 border-black rounded-lg rotate-45 flex items-center justify-center shadow-sm">
                                <div className="-rotate-45 w-4 h-4 bg-purple-500 rounded-full"></div>
                            </div>
                            <div className="w-32 md:w-40 h-6 bg-black/50 rounded-full border-2 border-black relative overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${progressPercent}%` }}></div>
                                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs drop-shadow-md">
                                    {Math.floor(currentTokens)} / {currentTierData.requiredTokens}
                                </span>
                            </div>
                            <div className="w-10 h-10 bg-black rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-white font-brawl text-xl">{currentTier}</span>
                            </div>
                        </div>
                        <span className="text-blue-300 text-[10px] font-bold uppercase">SEZON BİTİŞİNE: 55g 10s</span>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6b21a8] to-[#1e1e24] -z-10"></div>
                <div className="absolute top-0 left-0 right-0 h-40 bg-[url('https://api.placeholder.com/200')] opacity-20 bg-repeat-x -z-10"></div>

                {activeTab === 'REWARDS' ? (
                    <>
                        {/* Left Panel: Pass Purchase */}
                        <div className="w-64 bg-[#7e22ce] border-r-4 border-black p-4 flex flex-col items-center justify-center gap-4 shadow-[10px_0_20px_rgba(0,0,0,0.5)] z-10 relative hidden md:flex">
                             <div className="absolute inset-0 bg-[url('https://api.placeholder.com/50')] opacity-10"></div>
                             
                             <div className="bg-yellow-400 border-4 border-black p-4 w-full rounded-xl flex flex-col items-center shadow-lg transform hover:scale-105 transition-transform">
                                 <h2 className="font-brawl text-2xl text-black drop-shadow-sm uppercase">BRAWL PASS</h2>
                                 <div className="my-2 w-full h-1 bg-black/20"></div>
                                 <div className="flex items-center gap-1 mb-2">
                                     <ul className="text-[10px] font-bold text-black space-y-1">
                                         <li>• Özel Görevler</li>
                                         <li>• Ekstra Ödüller</li>
                                         <li>• Kromatik İsim</li>
                                     </ul>
                                 </div>
                                 {hasPass ? (
                                     <div className="bg-green-600 text-white font-brawl w-full py-2 text-center rounded border-2 border-black uppercase text-lg">
                                         AKTİF
                                     </div>
                                 ) : (
                                     <button 
                                        onClick={onBuyPass}
                                        className="bg-green-500 hover:bg-green-400 w-full py-2 rounded-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-white font-brawl text-xl shadow-md flex items-center justify-center gap-1"
                                     >
                                         <span className="text-sm mr-1">{BRAWL_PASS_COST}</span>
                                         <Gem size={16} className="text-green-100 fill-green-100" />
                                         <span className="ml-1 text-sm">AL</span>
                                     </button>
                                 )}
                             </div>
        
                             <div className="bg-white/10 p-4 w-full rounded-xl border-2 border-white/20 flex flex-col items-center">
                                 <span className="font-brawl text-white text-xl uppercase">ÜCRETSİZ</span>
                                 <div className="w-12 h-8 bg-white/20 rounded-full mt-2 flex items-center justify-center">
                                     <div className="w-4 h-4 bg-white rounded-full"></div>
                                 </div>
                             </div>
                        </div>
        
                        {/* Right Panel: Timeline Scroll */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-x-auto overflow-y-hidden relative custom-scrollbar bg-black/20"
                        >
                             <div className="absolute top-0 bottom-0 flex" style={{ width: `${BRAWL_PASS_TIERS.length * ITEM_WIDTH}px` }}>
                                
                                <div className="absolute top-1/2 left-0 w-full h-4 bg-black/50 border-y border-white/10 -translate-y-1/2 z-0"></div>
                                <div className="absolute top-1/2 left-0 h-4 bg-yellow-500 border-y border-yellow-300 -translate-y-1/2 z-0 transition-all duration-1000" style={{ width: `${(currentTier - 1) * ITEM_WIDTH + ITEM_WIDTH/2}px` }}></div>
        
                                {BRAWL_PASS_TIERS.map((tierData) => (
                                    <div key={tierData.tier} className="relative w-40 flex-shrink-0 flex flex-col justify-between py-10 items-center h-full group border-r border-white/5">
                                        
                                        <div className="mb-8">
                                            {renderRewardItem(tierData.paidReward, tierData.tier, true)}
                                        </div>
        
                                        <div className={`
                                            z-10 w-10 h-10 rounded-full border-4 border-black flex items-center justify-center font-brawl text-lg shadow-lg
                                            ${tierData.tier <= currentTier ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-white'}
                                        `}>
                                            {tierData.tier}
                                        </div>
        
                                        <div className="mt-8">
                                            {renderRewardItem(tierData.freeReward, tierData.tier, false)}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </>
                ) : (
                    // QUESTS GRID
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-purple-900/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                            {MOCK_QUESTS.map(quest => {
                                const isExclusive = quest.type === 'EXCLUSIVE';
                                const progress = Math.min(100, (quest.currentProgress / quest.goal) * 100);

                                return (
                                    <div key={quest.id} className={`
                                        rounded-xl border-4 border-black p-3 relative flex items-center gap-3 shadow-lg transform transition-transform hover:scale-[1.02]
                                        ${isExclusive ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-[#2596be]'}
                                    `}>
                                        {/* Status Badge */}
                                        {quest.isNew && (
                                            <div className="absolute -top-3 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-black animate-bounce">
                                                YENİ
                                            </div>
                                        )}
                                        {quest.timeLeft && (
                                            <div className="absolute -top-3 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                                {quest.timeLeft}
                                            </div>
                                        )}
                                        
                                        {/* Exclusive Banner */}
                                        {isExclusive && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-widest z-10 opacity-80">
                                                BRAWL PASS ÖZEL
                                            </div>
                                        )}

                                        {/* Left Icon */}
                                        {renderQuestIcon(quest)}

                                        {/* Center Info */}
                                        <div className="flex-1 flex flex-col justify-center min-w-0">
                                            <p className={`text-sm font-bold uppercase leading-tight line-clamp-2 ${isExclusive ? 'text-black' : 'text-white'}`}>
                                                {quest.description}
                                            </p>
                                            
                                            {/* Progress Bar */}
                                            <div className="mt-2 w-full h-5 bg-black/40 rounded-full border border-black/20 relative overflow-hidden">
                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white z-10">
                                                    {quest.currentProgress} / {quest.goal}
                                                </div>
                                                <div className={`h-full ${isExclusive ? 'bg-white' : 'bg-orange-500'} transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Reward */}
                                        <div className="flex flex-col items-center justify-center bg-black/20 rounded-lg p-2 min-w-[60px]">
                                            <div className="w-8 h-8 bg-white border-2 border-black rounded-lg rotate-45 flex items-center justify-center shadow-sm mb-1">
                                                <div className="-rotate-45 w-4 h-4 bg-purple-500 rounded-full"></div>
                                            </div>
                                            <span className={`font-brawl text-lg leading-none ${isExclusive ? 'text-black' : 'text-white'}`}>{quest.rewardTokens}</span>
                                        </div>

                                        {/* Lock Icon for Exclusive if no pass */}
                                        {isExclusive && !hasPass && (
                                            <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center rounded-lg">
                                                <Lock size={32} className="text-white opacity-80" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrawlPassScreen;
