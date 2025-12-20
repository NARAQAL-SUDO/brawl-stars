
import React, { useRef, useEffect, useState } from 'react';
import { TROPHY_ROAD_REWARDS } from '../constants';
import { TrophyReward } from '../types';
import { ArrowLeft, Check, Lock, Star, Zap, Skull, Shield, Crown, Ghost, Smile, Flame, Heart, Sparkles, Sword, Target } from 'lucide-react';

interface TrophyRoadScreenProps {
    currentTrophies: number;
    claimedRewards: number[];
    onClaimReward: (reward: TrophyReward) => void;
    onClose: () => void;
    profileIcon: string;
}

const PROFILE_ICONS: Record<string, React.ElementType> = {
    'SKULL': Skull, 'ZAP': Zap, 'CROWN': Crown, 'GHOST': Ghost,
    'SMILE': Smile, 'FLAME': Flame, 'HEART': Heart, 'STAR': Star,
    'SPARKLES': Sparkles, 'SWORD': Sword, 'TARGET': Target, 'SHIELD': Shield
};

const ITEM_WIDTH = 272; // Width of one reward item + margin (w-64 = 256px + mx-2 = 16px)

const TrophyRoadScreen: React.FC<TrophyRoadScreenProps> = ({ 
    currentTrophies, 
    claimedRewards, 
    onClaimReward, 
    onClose,
    profileIcon
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const CurrentProfileIcon = PROFILE_ICONS[profileIcon] || Skull;

    // --- DRAG TO SCROLL STATE ---
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Calculate dynamic progress bar width based on items reached
    const getProgressWidth = () => {
        // Polyfill logic for findLastIndex
        let lastReachedIndex = -1;
        for (let i = TROPHY_ROAD_REWARDS.length - 1; i >= 0; i--) {
            if (currentTrophies >= TROPHY_ROAD_REWARDS[i].trophies) {
                lastReachedIndex = i;
                break;
            }
        }
        
        // If haven't reached first reward
        if (lastReachedIndex === -1) {
            // Calculate partial progress to first reward
            const firstReward = TROPHY_ROAD_REWARDS[0];
            const percent = Math.min(1, currentTrophies / firstReward.trophies);
            return percent * (ITEM_WIDTH / 2); 
        }

        // If completed everything
        if (lastReachedIndex === TROPHY_ROAD_REWARDS.length - 1) {
            return (TROPHY_ROAD_REWARDS.length) * ITEM_WIDTH; 
        }

        // Between rewards
        const prev = TROPHY_ROAD_REWARDS[lastReachedIndex];
        const next = TROPHY_ROAD_REWARDS[lastReachedIndex + 1];
        
        const segmentProgress = (currentTrophies - prev.trophies) / (next.trophies - prev.trophies);
        
        // Base width (completed items) + Partial segment width + Half item width to center on icon
        return (lastReachedIndex * ITEM_WIDTH) + (segmentProgress * ITEM_WIDTH) + (ITEM_WIDTH / 2);
    };

    // Auto scroll to current progress on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            const passedMilestones = TROPHY_ROAD_REWARDS.filter(r => r.trophies <= currentTrophies);
            const index = passedMilestones.length > 0 ? passedMilestones.length - 1 : 0;
            
            // Center the current item
            const targetScrollX = (index * ITEM_WIDTH) - (window.innerWidth / 2) + (ITEM_WIDTH / 2);
            
            // Use scrollTo for smooth initial positioning without interfering with drag later
            scrollContainerRef.current.scrollTo({
                left: Math.max(0, targetScrollX),
                behavior: 'smooth'
            });
        }
    }, [currentTrophies]);

    // --- DRAG HANDLERS ---
    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const nextGoal = TROPHY_ROAD_REWARDS.find(r => r.trophies > currentTrophies);
    const progressWidth = getProgressWidth();
    const totalTrackWidth = (TROPHY_ROAD_REWARDS.length + 1) * ITEM_WIDTH;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0055d4] animate-fadeIn">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between p-4 bg-[#1e3a8a] border-b-4 border-[#10245a] shadow-lg z-20 select-none">
                <button onClick={onClose} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1 hover:brightness-110">
                    <ArrowLeft size={32} className="text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-brawl text-white drop-shadow-md tracking-wider uppercase">KUPA YOLU</h2>
                    {nextGoal ? (
                        <div className="text-blue-300 text-xs font-bold uppercase tracking-wide">
                            Sonraki Hedef: <span className="text-white">{nextGoal.trophies}</span>
                        </div>
                    ) : (
                         <div className="text-yellow-400 text-xs font-bold uppercase tracking-wide">TÜM HEDEFLER TAMAMLANDI!</div>
                    )}
                </div>
                <div className="w-12"></div> {/* Spacer for center alignment */}
            </div>

            {/* --- MAIN SCROLL AREA --- */}
            <div className="flex-1 relative overflow-hidden bg-[url('https://api.placeholder.com/50')] bg-repeat opacity-100">
                {/* Background Pattern Overlay */}
                <div className="absolute inset-0 bg-[#3b82f6] opacity-90 -z-20"></div>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                {/* Info Text */}
                <div className="absolute top-4 left-0 right-0 text-center z-10 px-4 pointer-events-none select-none">
                     <p className="text-white/80 font-bold text-sm md:text-base drop-shadow-md">
                         Kaydırmak için basılı tut ve sürükle!
                     </p>
                </div>

                {/* Progress Track Container */}
                <div 
                    ref={scrollContainerRef}
                    className="w-full h-full overflow-x-auto flex items-center px-[50vw] pb-10 custom-scrollbar cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={onMouseDown}
                    onMouseLeave={onMouseLeave}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                >
                    {/* The Track Lines */}
                    <div 
                        className="absolute left-0 h-4 bg-black/40 border-y-2 border-black/20 top-1/2 -translate-y-1/2 -z-10"
                        style={{ width: `${totalTrackWidth}px` }}
                    ></div>
                    <div 
                        className="absolute left-0 h-4 bg-orange-500 border-y-2 border-yellow-600 top-1/2 -translate-y-1/2 -z-10 transition-all duration-1000" 
                        style={{ width: `${progressWidth}px` }}
                    ></div>

                    {/* Milestones */}
                    {TROPHY_ROAD_REWARDS.map((reward, index) => {
                        const isReached = currentTrophies >= reward.trophies;
                        const isClaimed = claimedRewards.includes(reward.id);
                        const isNext = !isReached && (!TROPHY_ROAD_REWARDS[index-1] || currentTrophies >= TROPHY_ROAD_REWARDS[index-1].trophies);
                        
                        return (
                            <div key={reward.id} className="relative flex-shrink-0 w-64 h-80 flex flex-col items-center justify-center mx-2 group">
                                
                                {/* Trophy Number on Track */}
                                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 mt-16 flex flex-col items-center z-0">
                                    <div className={`w-14 h-14 rotate-45 border-4 border-black flex items-center justify-center shadow-lg transition-colors ${isReached ? 'bg-orange-500' : 'bg-slate-700'}`}>
                                        <div className="-rotate-45">
                                            {isReached ? <Check size={24} className="text-white" /> : <Lock size={20} className="text-slate-400" />}
                                        </div>
                                    </div>
                                    <div className="bg-black text-white font-brawl px-3 py-1 mt-2 rounded border border-white/20 text-sm pointer-events-none">
                                        {reward.trophies}
                                    </div>
                                    
                                    {/* Player Icon Indicator */}
                                    {isReached && (!TROPHY_ROAD_REWARDS[index+1] || currentTrophies < TROPHY_ROAD_REWARDS[index+1].trophies) && (
                                        <div className="absolute -top-16 animate-bounce z-20 pointer-events-none">
                                            <div className="w-12 h-12 bg-blue-500 rounded-lg border-2 border-black flex items-center justify-center shadow-xl">
                                                <CurrentProfileIcon size={28} className="text-white" />
                                            </div>
                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black mx-auto mt-[-2px]"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Reward Box */}
                                <div className={`
                                    relative -mt-24 w-40 h-40 flex flex-col items-center justify-center transition-transform duration-300
                                    ${isReached && !isClaimed ? 'scale-110 cursor-pointer animate-pulse' : 'scale-100'}
                                    ${isClaimed ? 'opacity-50 grayscale' : ''}
                                `}
                                onClick={(e) => {
                                    if (!isDragging && isReached && !isClaimed) {
                                        e.stopPropagation();
                                        onClaimReward(reward);
                                    }
                                }}
                                >
                                    {/* Box Visuals */}
                                    {reward.type === 'GOLD' && (
                                        <div className="w-28 h-28 bg-yellow-500 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center relative pointer-events-none">
                                            <div className="w-16 h-16 bg-yellow-300 rounded-full"></div>
                                            <div className="absolute bottom-2 text-white font-brawl text-xl drop-shadow-md">{reward.amount}</div>
                                        </div>
                                    )}
                                    {reward.type === 'POWER_POINTS' && (
                                        <div className="w-28 h-28 bg-[#ff55ff] rounded-2xl border-4 border-black shadow-xl flex items-center justify-center relative pointer-events-none">
                                            <Zap size={50} className="text-white" />
                                            <div className="absolute bottom-2 text-white font-brawl text-xl drop-shadow-md">{reward.amount}</div>
                                        </div>
                                    )}
                                    {(reward.type === 'BIG_BOX' || reward.type === 'MEGA_BOX') && (
                                        <div className={`
                                            w-32 h-24 border-4 border-black rounded-xl shadow-xl flex items-center justify-center relative pointer-events-none
                                            ${reward.type === 'MEGA_BOX' ? 'bg-yellow-400' : 'bg-purple-600'}
                                        `}>
                                            <div className={`absolute inset-0 ${reward.type === 'MEGA_BOX' ? 'bg-red-500' : 'bg-purple-800'} skew-x-12 -ml-2 rounded-l-md`}></div>
                                            <Star size={30} className="text-white relative z-10" />
                                            {reward.type === 'MEGA_BOX' && <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 font-bold border border-black">MEGA</div>}
                                            {reward.amount > 1 && <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs px-1.5 font-bold border border-black rounded-full">x{reward.amount}</div>}
                                        </div>
                                    )}

                                    {/* Label */}
                                    <div className={`
                                        mt-4 px-3 py-1 rounded text-white font-bold text-xs uppercase tracking-wide text-center w-full shadow-md pointer-events-none
                                        ${isReached ? 'bg-[#3b82f6] border border-white/20' : 'bg-slate-700'}
                                    `}>
                                        {isClaimed ? <span className="flex items-center justify-center gap-1"><Check size={12}/> ALINDI</span> : reward.label}
                                    </div>
                                    
                                    {isReached && !isClaimed && (
                                        <div className="absolute -top-4 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded border border-black animate-bounce pointer-events-none">
                                            TIKLA!
                                        </div>
                                    )}
                                </div>

                                {isNext && (
                                    <div className="absolute top-10 text-white font-brawl text-lg animate-pulse drop-shadow-md pointer-events-none">
                                        SONRAKİ HEDEF
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TrophyRoadScreen;
