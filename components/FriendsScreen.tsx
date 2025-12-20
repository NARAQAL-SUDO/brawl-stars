import React, { useState } from 'react';
import { Friend } from '../types';
import { MOCK_FRIENDS } from '../constants';
import { 
    ArrowLeft, Home, Share2, Search, Trophy, 
    Smile, Zap, Skull, Shield, Crown, Ghost, Flame, Heart, Star, Sparkles, Sword, Target
} from 'lucide-react';

interface FriendsScreenProps {
  onClose: () => void;
  currentPlayerId: string;
}

const PROFILE_ICONS: Record<string, React.ElementType> = {
    'SKULL': Skull, 'ZAP': Zap, 'CROWN': Crown, 'GHOST': Ghost,
    'SMILE': Smile, 'FLAME': Flame, 'HEART': Heart, 'STAR': Star,
    'SPARKLES': Sparkles, 'SWORD': Sword, 'TARGET': Target, 'SHIELD': Shield
};

const FriendsScreen: React.FC<FriendsScreenProps> = ({ onClose, currentPlayerId }) => {
  const [activeTab, setActiveTab] = useState<'FRIENDS' | 'SUGGESTED' | 'INVITES'>('FRIENDS');

  // Sort friends: Online first, then by trophies
  const sortedFriends = [...MOCK_FRIENDS].sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return b.trophies - a.trophies;
  });

  const onlineCount = MOCK_FRIENDS.filter(f => f.isOnline).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#1e3a8a] flex flex-col animate-fadeIn font-sans select-none">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 bg-[#1e3a8a] border-b-2 border-black/20 shadow-lg z-10">
        <div className="flex flex-col ml-2">
            <h2 className="text-xl md:text-2xl font-brawl text-white uppercase drop-shadow-md leading-none">ARKADAŞLAR</h2>
            <div className="text-[10px] text-blue-300 font-bold uppercase">Ölüm Bekçisi</div>
        </div>
        <div className="flex gap-2">
            <div className="bg-green-500 px-3 py-1 rounded border border-black flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
                <span className="text-white text-xs font-bold">{onlineCount}</span>
            </div>
            <button onClick={onClose} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1 hover:brightness-110">
                <Home size={24} className="text-white" />
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] to-[#001133] -z-10"></div>
          <div className="absolute inset-0 opacity-5 bg-[url('https://api.placeholder.com/50')] -z-10"></div>

          {/* LEFT PANEL: Add Friend */}
          <div className="w-1/3 min-w-[250px] p-4 flex flex-col gap-4 border-r-2 border-black/20 bg-[#152860]">
             <div className="flex items-center gap-2 mb-2">
                 <button onClick={onClose} className="bg-blue-600 p-1.5 rounded border-2 border-black active:scale-95">
                    <ArrowLeft size={20} className="text-white" />
                 </button>
                 <span className="text-white font-brawl text-xl drop-shadow-md">ARKADAŞ EKLE</span>
             </div>

             <div className="bg-[#1e40af] p-4 rounded-xl border-2 border-[#1e3a8a] shadow-lg">
                 <div className="text-green-400 text-xs font-bold uppercase mb-1">
                     Sahip olduğun ID: <span className="text-white select-text">#{currentPlayerId.substring(0,8).toUpperCase()}</span>
                 </div>
                 
                 <div className="flex gap-2 mb-4">
                     <div className="flex-1 bg-white rounded border-2 border-black relative flex items-center">
                         <input 
                            type="text" 
                            placeholder="Oyuncu ID'sini gir" 
                            className="w-full h-full px-2 text-sm font-bold bg-transparent outline-none uppercase placeholder:normal-case placeholder:font-normal"
                         />
                     </div>
                     <button className="bg-gray-300 hover:bg-gray-200 text-gray-600 font-bold text-[10px] px-2 rounded border-b-4 border-gray-500 active:border-b-0 active:translate-y-1">
                         ARKADAŞ EKLE
                     </button>
                 </div>

                 <div className="flex items-center justify-center mb-2">
                     <span className="text-white/50 text-[10px] font-bold uppercase">VEYA</span>
                 </div>

                 <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-brawl text-lg py-2 rounded-lg border-b-4 border-[#1d4ed8] active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 shadow-lg transition-all">
                     <Share2 size={20} />
                     DAVET GÖNDER
                 </button>
             </div>
          </div>

          {/* RIGHT PANEL: Friend List */}
          <div className="w-2/3 flex flex-col">
              {/* Tabs */}
              <div className="flex bg-[#1e40af] border-b-2 border-black/20 px-2 pt-2 gap-1">
                  <button 
                    onClick={() => setActiveTab('FRIENDS')}
                    className={`flex-1 py-2 rounded-t-lg font-brawl text-sm md:text-base uppercase transition-colors text-center ${activeTab === 'FRIENDS' ? 'bg-yellow-400 text-black border-t-2 border-x-2 border-black/20' : 'bg-transparent text-blue-300 hover:text-white'}`}
                  >
                      ARKADAŞLAR ({MOCK_FRIENDS.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('SUGGESTED')}
                    className={`flex-1 py-2 rounded-t-lg font-brawl text-sm md:text-base uppercase transition-colors text-center ${activeTab === 'SUGGESTED' ? 'bg-yellow-400 text-black border-t-2 border-x-2 border-black/20' : 'bg-transparent text-blue-300 hover:text-white'}`}
                  >
                      ÖNERİLEN
                  </button>
                  <button 
                    onClick={() => setActiveTab('INVITES')}
                    className={`flex-1 py-2 rounded-t-lg font-brawl text-sm md:text-base uppercase transition-colors text-center ${activeTab === 'INVITES' ? 'bg-yellow-400 text-black border-t-2 border-x-2 border-black/20' : 'bg-transparent text-blue-300 hover:text-white'}`}
                  >
                      DAVETLER
                  </button>
              </div>

              {/* List Content */}
              <div className="flex-1 bg-[#10245a] overflow-y-auto p-2">
                  {activeTab === 'FRIENDS' ? (
                      <div className="flex flex-col gap-1">
                          {sortedFriends.map((friend, index) => {
                              const FriendIcon = PROFILE_ICONS[friend.icon] || Skull;
                              return (
                                <div 
                                    key={friend.id} 
                                    className="flex items-center h-14 bg-[#1e3a8a] border border-black/20 px-2 hover:bg-[#26449e] transition-colors group"
                                >
                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded border-2 border-black flex items-center justify-center mr-3 ${friend.isOnline ? 'bg-blue-500' : 'bg-purple-500'} group-hover:scale-105 transition-transform`}>
                                        <FriendIcon size={24} className="text-white drop-shadow-sm" />
                                    </div>

                                    {/* Name & Status */}
                                    <div className="flex flex-col flex-1">
                                        <span className={`font-brawl text-sm md:text-lg leading-none ${friend.isOnline ? 'text-white' : 'text-slate-300'}`}>
                                            {friend.name}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {friend.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                                            <span className={`text-[10px] font-bold uppercase ${friend.isOnline ? 'text-green-400' : 'text-slate-400'}`}>
                                                {friend.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Rank Icon (Visual) */}
                                    <div className="w-8 h-8 md:w-10 md:h-10 mx-2 flex items-center justify-center">
                                         <div className="w-6 h-6 bg-blue-400 rotate-45 border border-black shadow-sm group-hover:rotate-180 transition-transform duration-500"></div>
                                    </div>

                                    {/* Trophies */}
                                    <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded min-w-[70px] justify-end">
                                        <Trophy size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-yellow-400 font-brawl text-sm md:text-base">{friend.trophies}</span>
                                    </div>
                                </div>
                              );
                          })}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-blue-300/50">
                          <Search size={48} className="mb-2" />
                          <p className="font-bold">Liste Boş</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default FriendsScreen;