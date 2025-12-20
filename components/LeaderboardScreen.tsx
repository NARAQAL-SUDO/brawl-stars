
import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, BrawlerType } from '../types';
import { fetchLeaderboard } from '../services/leaderboardService';
import { BRAWLERS, RARITY_INFO } from '../constants';
import { 
    ArrowLeft, Trophy, Globe, MapPin, Skull, Zap, Crown, Ghost, Smile, Flame, 
    Heart, Star, Sparkles, Sword, Target, Shield, Loader2, Gem, Users,
    Gamepad2, Rocket, Music, Sun, Moon, Anchor, Bug, Coffee, Fingerprint, Bomb, Crosshair, Droplet, User
} from 'lucide-react';

interface LeaderboardScreenProps {
    onClose: () => void;
    currentPlayerName: string;
    currentPlayerTrophies: number;
    profileIcon: string;
    clubName: string;
    playerId?: string;
}

const PROFILE_ICONS: Record<string, React.ElementType> = {
    'SKULL': Skull, 'ZAP': Zap, 'CROWN': Crown, 'GHOST': Ghost,
    'SMILE': Smile, 'FLAME': Flame, 'HEART': Heart, 'STAR': Star,
    'SPARKLES': Sparkles, 'SWORD': Sword, 'TARGET': Target, 'SHIELD': Shield,
    'GAMEPAD': Gamepad2, 'ROCKET': Rocket, 'MUSIC': Music, 'SUN': Sun,
    'MOON': Moon, 'ANCHOR': Anchor, 'BUG': Bug, 'COFFEE': Coffee, 'FINGERPRINT': Fingerprint
};

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ 
    onClose, 
    currentPlayerName, 
    currentPlayerTrophies,
    profileIcon,
    clubName,
    playerId = 'player_me'
}) => {
    const [activeLocation, setActiveLocation] = useState<'GLOBAL' | 'LOCAL'>('GLOBAL');
    const [activeCategory, setActiveCategory] = useState<'TROPHIES' | 'CLUBS' | 'BRAWLERS' | 'SPENDERS'>('TROPHIES');
    const [selectedBrawler, setSelectedBrawler] = useState<BrawlerType>(BrawlerType.SHELLY);
    const [timeRange, setTimeRange] = useState<'SEASON' | 'ALL_TIME'>('SEASON');
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [playerRank, setPlayerRank] = useState<number>(0);

    const isCustomIcon = profileIcon.startsWith('data:');
    const CurrentPlayerIcon = isCustomIcon ? 'img' : PROFILE_ICONS[profileIcon] || Skull;
    const myTotalSpent = parseFloat(localStorage.getItem('brawl_ai_total_spent') || '0');

    // Calculate a "simulated" brawler trophy count for the player (since we don't track it individually yet)
    // In a real app, this would come from the brawler's state
    const getBrawlerTrophies = () => {
        // Shelly usually has more, others less. Let's make it look plausible.
        const base = Math.floor(currentPlayerTrophies / 8); 
        const brawlerFactor = selectedBrawler === BrawlerType.SHELLY ? 1.5 : 1.0;
        return Math.floor(base * brawlerFactor);
    };

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            setLoading(true);
            try {
                // Determine which trophy value to send for the player row
                const displayTrophies = activeCategory === 'BRAWLERS' ? getBrawlerTrophies() : currentPlayerTrophies;

                const myEntry: LeaderboardEntry = {
                    id: playerId,
                    name: currentPlayerName,
                    trophies: displayTrophies,
                    icon: profileIcon,
                    club: clubName,
                    rank: 0,
                    totalSpent: myTotalSpent
                };

                // Map UI category to service call
                let fetchType: 'GLOBAL' | 'LOCAL' | 'SPENDERS' | 'BRAWLERS' = 'GLOBAL';
                if (activeCategory === 'SPENDERS') fetchType = 'SPENDERS';
                else if (activeCategory === 'BRAWLERS') fetchType = 'BRAWLERS';
                else if (activeLocation === 'LOCAL') fetchType = 'LOCAL';

                const result = await fetchLeaderboard(fetchType, myEntry, selectedBrawler.toLowerCase());
                
                if (isMounted) {
                    setData(result.list);
                    setPlayerRank(result.playerRank);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Leaderboard error", error);
                if (isMounted) setLoading(false);
            }
        };

        loadData();
        return () => { isMounted = false; };
    }, [activeLocation, activeCategory, selectedBrawler, currentPlayerTrophies, currentPlayerName, profileIcon, clubName, playerId, myTotalSpent]);

    // Helper for Brawler Icons in Grid
    const BrawlerIconSmall = ({ type }: { type: BrawlerType }) => {
        return (
            <div className="w-full h-full flex items-center justify-center p-1 text-white">
                 {type === BrawlerType.SHELLY && <Sword size={24} />}
                 {type === BrawlerType.COLT && <Target size={24} />}
                 {type === BrawlerType.EL_PRIMO && <Shield size={24} />}
                 {type === BrawlerType.DYNAMIKE && <Bomb size={24} />}
                 {type === BrawlerType.NITA && <Skull size={24} />}
                 {type === BrawlerType.BULL && <User size={24} />}
                 {type === BrawlerType.BROCK && <Crosshair size={24} />}
                 {type === BrawlerType.BARLEY && <Droplet size={24} />}
                 {type === BrawlerType.EDGAR && <Zap size={24} />}
                 {type === BrawlerType.STU && <Star size={24} />}
                 {type === BrawlerType.SPIKE && <Smile size={24} />}
                 {![BrawlerType.SHELLY, BrawlerType.COLT, BrawlerType.EL_PRIMO, BrawlerType.DYNAMIKE, BrawlerType.NITA, BrawlerType.BULL, BrawlerType.BROCK, BrawlerType.BARLEY, BrawlerType.EDGAR, BrawlerType.STU, BrawlerType.SPIKE].includes(type) && <Users size={24} />}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0055d4] flex flex-col font-sans select-none animate-fadeIn overflow-hidden">
            {/* --- TOP TABS (SEASON / ALL TIME) --- */}
            <div className="flex items-center gap-1 p-2 bg-[#0044aa] z-30">
                <button 
                    onClick={() => setTimeRange('SEASON')}
                    className={`px-4 py-1.5 rounded border-2 border-black font-brawl text-[10px] md:text-xs uppercase transition-all ${timeRange === 'SEASON' ? 'bg-[#ff6600] text-white shadow-[0_2px_0_#000]' : 'bg-[#333] text-gray-400'}`}
                >
                    ŞU ANKİ SEZON
                </button>
                <button 
                    onClick={() => setTimeRange('ALL_TIME')}
                    className={`px-4 py-1.5 rounded border-2 border-black font-brawl text-[10px] md:text-xs uppercase transition-all ${timeRange === 'ALL_TIME' ? 'bg-[#ff6600] text-white shadow-[0_2px_0_#000]' : 'bg-[#333] text-gray-400'}`}
                >
                    TÜM ZAMANLAR
                </button>
                <h1 className="ml-auto mr-4 text-white font-brawl text-2xl md:text-3xl drop-shadow-md stroke-black" style={{ WebkitTextStroke: '1px black' }}>
                    LİDERLİK TABLOLARI
                </h1>
                <button onClick={onClose} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1">
                    <ArrowLeft size={20} className="text-white" />
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* --- LEFT SIDEBAR (SCREENSOT STYLE) --- */}
                <div className="w-80 bg-[#0055d4] p-2 flex flex-col gap-2 border-r-4 border-black/20 z-20 overflow-y-auto custom-scrollbar">
                    
                    {/* World / Local Selector */}
                    <div className="flex border-2 border-black rounded overflow-hidden bg-black/40 h-10 mb-2">
                        <button 
                            onClick={() => setActiveLocation('GLOBAL')}
                            className={`flex-1 flex items-center justify-center gap-2 font-brawl text-xs transition-all ${activeLocation === 'GLOBAL' ? 'bg-orange-500 text-white shadow-inner' : 'bg-transparent text-white/70'}`}
                        >
                            <Trophy size={14} className="text-yellow-400 fill-yellow-400" />
                            DÜNYA
                        </button>
                        <button 
                            onClick={() => setActiveLocation('LOCAL')}
                            className={`flex-1 flex items-center justify-center gap-2 font-brawl text-xs border-l-2 border-black transition-all ${activeLocation === 'LOCAL' ? 'bg-orange-500 text-white shadow-inner' : 'bg-transparent text-white/70'}`}
                        >
                            <MapPin size={14} className="text-blue-400" />
                            YEREL (TR)
                            <Trophy size={14} className="text-yellow-400 fill-yellow-400" />
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-0.5 h-10 mb-2">
                        {[
                            { id: 'TROPHIES', label: 'TOPLAM KUPA' },
                            { id: 'CLUBS', label: 'KULÜPLER' },
                            { id: 'BRAWLERS', label: 'SAVAŞÇILAR' },
                            { id: 'SPENDERS', label: 'ZENGİNLER' }
                        ].map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as any)}
                                className={`
                                    flex-1 flex items-center justify-center rounded-t border-t-2 border-x-2 border-black font-brawl text-[8px] md:text-[10px] uppercase leading-none px-1 text-center transition-all
                                    ${activeCategory === cat.id ? 'bg-[#555] text-white' : 'bg-[#333] text-gray-400 hover:bg-[#444]'}
                                `}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Brawler Grid */}
                    {activeCategory === 'BRAWLERS' ? (
                        <div className="grid grid-cols-4 gap-1 p-1 bg-black/20 rounded border-2 border-black/40 overflow-y-auto">
                            {Object.values(BrawlerType).map((type) => {
                                const isSelected = selectedBrawler === type;
                                const config = BRAWLERS[type];
                                const rarity = RARITY_INFO[config.rarity];

                                return (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedBrawler(type)}
                                        className={`
                                            aspect-square rounded border-2 transition-all relative overflow-hidden group
                                            ${isSelected ? 'border-white scale-105 z-10 shadow-[0_0_10px_white]' : 'border-black opacity-80 hover:opacity-100'}
                                            bg-gradient-to-b ${rarity.bgGradient}
                                        `}
                                    >
                                        <BrawlerIconSmall type={type} />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-[6px] text-white font-bold text-center uppercase py-0.5 truncate">
                                            {config.name}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                            <Trophy size={64} className="text-white/20 mb-4" />
                            <p className="text-white/40 font-brawl text-sm">
                                {activeCategory === 'CLUBS' ? 'KULÜP SIRALAMASI' : activeCategory === 'SPENDERS' ? 'ZENGİNLER SIRALAMASI' : 'KUPA SIRALAMASI'}
                            </p>
                        </div>
                    )}
                </div>

                {/* --- MAIN PLAYER LIST (RIGHT) --- */}
                <div className="flex-1 bg-[#1e1e24] relative flex flex-col overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://api.placeholder.com/200')] bg-repeat -z-10"></div>
                    <div className="absolute inset-0 bg-[#3b82f6] opacity-90 -z-20"></div>

                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <Loader2 size={48} className="text-yellow-400 animate-spin mb-2" />
                            <span className="text-white font-brawl uppercase">Yükleniyor...</span>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
                            {data.map((entry, idx) => {
                                const isMe = entry.id === playerId;
                                const isCustomEntry = entry.icon.startsWith('data:');
                                const EntryIcon = isCustomEntry ? 'img' : PROFILE_ICONS[entry.icon] || Skull;

                                return (
                                    <div 
                                        key={entry.id} 
                                        className={`
                                            flex items-center h-14 border-b-2 border-black/40 transition-colors
                                            ${isMe ? 'bg-orange-500/30' : idx % 2 === 0 ? 'bg-[#555]/50' : 'bg-[#444]/50'}
                                            hover:bg-white/10
                                        `}
                                    >
                                        {/* Rank Number Box */}
                                        <div className="w-12 h-10 bg-[#777] border-2 border-black rounded ml-4 flex items-center justify-center shadow-inner">
                                            <span className="font-brawl text-2xl text-white drop-shadow-md">{entry.rank}</span>
                                        </div>

                                        {/* Player Icon */}
                                        <div className="w-10 h-10 bg-white border-2 border-black rounded ml-4 flex items-center justify-center overflow-hidden shrink-0">
                                            {isCustomEntry ? (
                                                <img src={entry.icon} className="w-full h-full object-cover" />
                                            ) : (
                                                <EntryIcon size={24} className="text-black" />
                                            )}
                                        </div>

                                        {/* Name & Title */}
                                        <div className="flex-1 flex flex-col justify-center ml-3 min-w-0">
                                            <span className={`font-brawl text-lg md:text-xl leading-none truncate drop-shadow-md tracking-wider ${entry.rank === 1 ? 'text-cyan-400' : 'text-white'}`}>
                                                {entry.name}
                                            </span>
                                            <span className={`text-[9px] font-bold uppercase truncate tracking-widest ${entry.rank === 1 ? 'text-yellow-400' : 'text-red-500'}`}>
                                                {idx === 0 ? 'TOP ONE' : (entry.club || '!! Carry Ranks !!')}
                                            </span>
                                        </div>

                                        {/* Badge (XP Level Style) */}
                                        <div className="hidden md:flex items-center justify-center w-12 h-12 relative mr-8 shrink-0 scale-90">
                                             <div className="absolute inset-0 bg-white/20 rotate-45 rounded border border-black"></div>
                                             <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rotate-45 rounded-full border border-black opacity-30"></div>
                                             <span className="font-brawl text-xs text-white z-10">{Math.floor(Math.random() * 200) + 1}</span>
                                        </div>

                                        {/* Trophies / Value */}
                                        <div className="flex items-center gap-1 bg-black/40 px-4 h-full min-w-[120px] justify-end border-l-2 border-black/20">
                                            {activeCategory === 'SPENDERS' ? (
                                                 <>
                                                    <span className="text-green-400 font-bold text-xs">$</span>
                                                    <span className="text-green-400 font-brawl text-xl">{(entry.totalSpent || 0).toLocaleString()}</span>
                                                 </>
                                            ) : (
                                                 <>
                                                    <Trophy size={18} className="text-yellow-500 fill-yellow-500 drop-shadow-sm" />
                                                    <span className="text-yellow-500 font-brawl text-xl drop-shadow-md">{entry.trophies.toLocaleString()}</span>
                                                 </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* --- STICKY PLAYER ROW (BOTTOM) --- */}
                    {!loading && (
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#ff6600] border-t-4 border-black shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center px-4 z-40 transform -skew-x-2">
                             {/* Rank Number Box */}
                             <div className="w-12 h-10 bg-[#777] border-2 border-black rounded flex items-center justify-center shadow-inner transform skew-x-2">
                                <span className="font-brawl text-2xl text-white drop-shadow-md">{playerRank > 999 ? '-' : playerRank}</span>
                             </div>

                             {/* Player Icon */}
                             <div className="w-12 h-12 bg-white border-2 border-black rounded ml-4 flex items-center justify-center overflow-hidden shrink-0 transform skew-x-2">
                                 {isCustomIcon ? (
                                     <img src={profileIcon} className="w-full h-full object-cover" />
                                 ) : (
                                     <CurrentPlayerIcon size={28} className="text-black" />
                                 )}
                             </div>

                             {/* Name & Title */}
                             <div className="flex-1 flex flex-col justify-center ml-3 min-w-0 transform skew-x-2">
                                 <span className="font-brawl text-xl md:text-2xl text-white leading-none truncate drop-shadow-md tracking-wider">
                                     {currentPlayerName}
                                 </span>
                                 <span className="text-[10px] font-bold text-black uppercase truncate tracking-widest">
                                     {activeCategory === 'BRAWLERS' ? `${BRAWLERS[selectedBrawler].name} KUPASI` : (clubName || 'HyperGravity')}
                                 </span>
                             </div>

                             {/* Trophies / Value */}
                             <div className="flex items-center gap-1 px-4 h-full min-w-[140px] justify-end transform skew-x-2">
                                 {activeCategory === 'SPENDERS' ? (
                                      <>
                                         <span className="text-white font-bold text-sm">$</span>
                                         <span className="text-white font-brawl text-2xl drop-shadow-md">{myTotalSpent.toLocaleString()}</span>
                                      </>
                                 ) : (
                                      <>
                                         <Trophy size={24} className="text-white fill-white drop-shadow-md" />
                                         <span className="text-white font-brawl text-3xl drop-shadow-md">
                                             {activeCategory === 'BRAWLERS' ? getBrawlerTrophies().toLocaleString() : currentPlayerTrophies.toLocaleString()}
                                         </span>
                                      </>
                                 )}
                             </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
};

export default LeaderboardScreen;
