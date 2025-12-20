
import React, { useState, useEffect, useRef } from 'react';
import { Club, ChatMessage, GameMode, BrawlerType } from '../types';
import { MOCK_CHAT_MESSAGES, MOCK_CLUBS_LIST, BRAWLERS } from '../constants';
import { generateClubChatResponse } from '../services/geminiService';
import { ArrowLeft, Shield, Users, Trophy, MessageCircle, Home, LogOut, Settings, Send, Search, Lock, Plus, Swords, User, Droplet, Frown } from 'lucide-react';
import { playClickSound, initAudio } from '../services/audioService';

interface ClubScreenProps {
  club: Club | null;
  onClose: () => void;
  currentPlayerId: string;
  onLeaveClub: () => void;
  onJoinClub: (clubId: string) => void;
  userTrophies: number;
  initialTab?: 'MEMBERS' | 'CHAT';
  onAcceptInvite?: (name: string, brawler: BrawlerType) => void;
}

const ClubScreen: React.FC<ClubScreenProps> = ({ club, onClose, currentPlayerId, onLeaveClub, onJoinClub, userTrophies, initialTab = 'MEMBERS', onAcceptInvite }) => {
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'CHAT'>(initialTab);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize messages from localStorage or default when club changes
  useEffect(() => {
      if (club) {
          const key = `brawl_ai_chat_${club.id}`;
          const saved = localStorage.getItem(key);
          if (saved) {
              setMessages(JSON.parse(saved));
          } else {
              // Generate initial message if no history
              const president = club.members.find(m => m.role === 'BAŞKAN') || club.members[0];
              const initialMsg: ChatMessage = {
                  id: 'welcome',
                  senderName: president ? president.name : 'Sistem',
                  text: `Hoş geldin! ${club.name} kulübüne katıldın.`,
                  role: president ? president.role : 'SİSTEM',
                  isPlayer: false,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  type: 'TEXT'
              };
              // Use mock messages only for the default mock club to preserve "history" feel, otherwise fresh start
              if (club.id === 'club_default' && !saved) {
                   setMessages(MOCK_CHAT_MESSAGES);
              } else {
                   setMessages([initialMsg]);
              }
          }
      }
  }, [club?.id]);

  // Persist messages whenever they change
  useEffect(() => {
      if (club && messages.length > 0) {
          const key = `brawl_ai_chat_${club.id}`;
          localStorage.setItem(key, JSON.stringify(messages));
      }
  }, [messages, club]);

  // Auto-scroll chat to bottom
  useEffect(() => {
      if (activeTab === 'CHAT' && chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
  }, [activeTab, messages]);

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputMessage.trim() || !club) return;

      const playerMember = club.members.find(m => m.isPlayer);
      const playerName = playerMember ? playerMember.name : 'OYUNCU';
      const userText = inputMessage.trim();

      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          senderName: playerName,
          text: userText,
          role: playerMember ? playerMember.role : 'ÜYE',
          isPlayer: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'TEXT'
      };

      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // Check for keywords to trigger an Invite
      const lowerText = userText.toLowerCase();
      const isInviteRequest = lowerText.includes('davet') || lowerText.includes('invite') || lowerText.includes('maç') || lowerText.includes('gel') || lowerText.includes('vs');

      // Simulate Bot Response with AI
      setTimeout(async () => {
          const bots = club.members.filter(m => !m.isPlayer);
          if (bots.length > 0) {
              const randomBot = bots[Math.floor(Math.random() * bots.length)];
              
              let responseText = "";
              
              if (isInviteRequest) {
                  const responses = ["Tamam atıyorum.", "Geliyorum bekle.", "Hadi girelim, attım.", "Davet gönderdim!"];
                  responseText = responses[Math.floor(Math.random() * responses.length)];
              } else {
                  // Get context-aware response from Gemini
                  responseText = await generateClubChatResponse(userText, playerName, randomBot.name);
              }
              
              const botMsg: ChatMessage = {
                  id: (Date.now() + 1).toString(),
                  senderName: randomBot.name,
                  text: responseText,
                  role: randomBot.role,
                  isPlayer: false,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  type: 'TEXT'
              };
              setMessages(prev => [...prev, botMsg]);

              // If invite was requested, send the INVITE CARD shortly after the text response
              if (isInviteRequest) {
                  setTimeout(() => {
                      const inviteMsg: ChatMessage = {
                          id: (Date.now() + 2).toString(),
                          senderName: randomBot.name,
                          text: "Birlikte oynamak istiyor!",
                          role: randomBot.role,
                          isPlayer: false,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          type: 'INVITE',
                          inviteData: {
                              mode: GameMode.DUO,
                              map: 'Savaş Alanı'
                          }
                      };
                      setMessages(prev => [...prev, inviteMsg]);
                      playClickSound(); // Sound notification
                  }, 500);
              }
          }
      }, 2000 + Math.random() * 1500); // 2s - 3.5s delay for realism
  };

  const handleJoinInvite = (inviterName: string) => {
      initAudio();
      playClickSound();
      
      if (onAcceptInvite) {
          // Pick a random brawler for the bot
          const brawlerKeys = Object.keys(BRAWLERS) as BrawlerType[];
          const randomBrawler = brawlerKeys[Math.floor(Math.random() * brawlerKeys.length)];
          
          onAcceptInvite(inviterName, randomBrawler);
          onClose(); // Close club screen to simulate going to lobby
      }
  };

  const handleRejectInvite = () => {
      initAudio();
      playClickSound();
      // Visual feedback only, doesn't do anything logic-wise currently
  };

  const handleLeave = (e: React.MouseEvent) => {
      e.stopPropagation();
      onLeaveClub();
  };

  // --- CLUB BROWSER RENDER (NO CLUB) ---
  if (!club) {
      return (
        <div className="fixed inset-0 z-50 bg-[#1e3a8a] flex flex-col animate-fadeIn font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-2 bg-[#1e3a8a] border-b-4 border-[#0d2e80] shadow-lg z-20 h-16">
                <button onClick={onClose} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1 hover:brightness-110">
                    <ArrowLeft size={24} className="text-white" />
                </button>
                <h2 className="text-2xl font-brawl text-white uppercase drop-shadow-md tracking-wider">KULÜPLER</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 bg-[#3b82f6] p-4 flex flex-col overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] -z-10"></div>
                <div className="absolute inset-0 bg-[url('https://api.placeholder.com/50')] opacity-10 -z-10"></div>

                <div className="flex items-center gap-2 mb-4 bg-black/20 p-2 rounded-xl border border-white/10">
                    <Search className="text-white ml-2" />
                    <input 
                        type="text" 
                        placeholder="Kulüp Ara..." 
                        className="bg-transparent text-white font-bold w-full outline-none placeholder:text-blue-300"
                    />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                    {MOCK_CLUBS_LIST.map((mockClub) => {
                        const canJoin = userTrophies >= mockClub.requiredTrophies;
                        
                        return (
                            <div key={mockClub.id} className="bg-[#1e40af] border-2 border-black rounded-xl p-3 flex items-center justify-between shadow-md hover:bg-[#2563eb] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-black/40 rounded-lg border-2 border-white/20 flex items-center justify-center">
                                        <Shield size={28} className="text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-brawl text-white text-lg leading-none">{mockClub.name}</span>
                                        <span className="text-blue-200 text-xs font-bold line-clamp-1">{mockClub.description}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-0.5 text-[10px] text-white font-bold bg-black/30 px-1.5 rounded">
                                                <Users size={10} /> {mockClub.members.length}/30
                                            </div>
                                            <div className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-bold bg-black/30 px-1.5 rounded">
                                                <Trophy size={10} /> {mockClub.requiredTrophies}+
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => canJoin && onJoinClub(mockClub.id)}
                                    className={`
                                        px-4 py-2 rounded-lg border-b-4 active:border-b-0 active:translate-y-1 font-brawl uppercase text-sm min-w-[80px]
                                        ${canJoin 
                                            ? 'bg-green-500 hover:bg-green-400 border-green-700 text-white shadow-lg' 
                                            : 'bg-slate-600 border-slate-800 text-slate-400 cursor-not-allowed'}
                                    `}
                                >
                                    {canJoin ? 'KATIL' : 'YETERSİZ'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      );
  }

  // --- MY CLUB RENDER ---
  const playerMember = club.members.find(m => m.isPlayer);
  const role = playerMember ? playerMember.role : 'ÜYE';

  return (
    <div className="fixed inset-0 z-50 bg-[#1e3a8a] flex flex-col animate-fadeIn font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 bg-[#1e3a8a] border-b-4 border-[#0d2e80] shadow-lg z-20 h-16">
        <button onClick={onClose} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1 hover:brightness-110">
            <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-brawl text-white uppercase drop-shadow-md tracking-wider leading-none">{club.name}</h2>
            <div className="flex items-center gap-1">
                <Shield size={12} className="text-blue-300" />
                <span className="text-xs text-blue-300 font-bold uppercase tracking-widest">{club.members.length} ÜYE</span>
            </div>
        </div>
        <button onClick={handleLeave} className="bg-red-600 p-2 rounded-lg border-2 border-black active:translate-y-1 hover:brightness-110" title="Kulüpten Ayrıl">
            <LogOut size={24} className="text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] to-[#001133] -z-10"></div>
          
          {/* LEFT SIDE INFO (Desktop) or TOP INFO (Mobile) */}
          <div className="hidden md:flex w-64 bg-[#152860] border-r-2 border-black/20 p-4 flex-col gap-4">
              <div className="bg-[#1e40af] w-32 h-32 mx-auto rounded-xl border-4 border-black flex items-center justify-center shadow-xl">
                  <Shield size={64} className="text-white" />
              </div>
              
              <div className="bg-[#1e40af] p-3 rounded-xl border border-white/10 text-center">
                  <div className="text-blue-300 text-[10px] font-bold uppercase mb-1">Toplam Kupa</div>
                  <div className="text-white font-brawl text-2xl flex items-center justify-center gap-2">
                      <Trophy size={20} className="text-yellow-400 fill-yellow-400" />
                      {club.totalTrophies.toLocaleString()}
                  </div>
              </div>

              <div className="bg-[#1e40af] p-3 rounded-xl border border-white/10">
                  <div className="text-blue-300 text-[10px] font-bold uppercase mb-1">Açıklama</div>
                  <p className="text-white text-xs font-bold leading-relaxed opacity-80">
                      {club.description}
                  </p>
              </div>

              <div className="mt-auto">
                   <button onClick={handleLeave} className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 text-white font-brawl uppercase text-sm shadow-lg flex items-center justify-center gap-2">
                       <LogOut size={16} /> AYRIL
                   </button>
              </div>
          </div>

          {/* RIGHT SIDE TABS */}
          <div className="flex-1 flex flex-col">
              {/* Tab Headers */}
              <div className="flex bg-[#1e40af] border-b-2 border-black/20 px-2 pt-2 gap-2">
                  <button 
                    onClick={() => setActiveTab('MEMBERS')}
                    className={`flex-1 py-2 rounded-t-lg font-brawl text-sm md:text-base uppercase transition-colors text-center flex items-center justify-center gap-2 ${activeTab === 'MEMBERS' ? 'bg-[#3b82f6] text-white border-t-2 border-x-2 border-black/20 pb-3' : 'bg-transparent text-blue-300 hover:text-white'}`}
                  >
                      <Users size={18} /> ÜYELER
                  </button>
                  <button 
                    onClick={() => setActiveTab('CHAT')}
                    className={`flex-1 py-2 rounded-t-lg font-brawl text-sm md:text-base uppercase transition-colors text-center flex items-center justify-center gap-2 ${activeTab === 'CHAT' ? 'bg-[#3b82f6] text-white border-t-2 border-x-2 border-black/20 pb-3' : 'bg-transparent text-blue-300 hover:text-white'}`}
                  >
                      <MessageCircle size={18} /> SOHBET
                  </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 bg-[#3b82f6] overflow-hidden relative">
                   <div className="absolute inset-0 bg-[url('https://api.placeholder.com/50')] opacity-10 pointer-events-none"></div>

                   {activeTab === 'MEMBERS' && (
                       <div className="h-full overflow-y-auto p-2 md:p-4 custom-scrollbar flex flex-col gap-2">
                           {club.members.sort((a,b) => b.trophies - a.trophies).map((member, idx) => (
                               <div 
                                  key={member.id} 
                                  className={`
                                    flex items-center h-16 bg-[#1e40af] rounded-lg border border-black/20 px-3 shadow-sm hover:bg-[#2563eb] transition-colors
                                    ${member.isPlayer ? 'border-2 border-yellow-400 bg-[#2563eb]' : ''}
                                  `}
                               >
                                   <div className="w-8 font-brawl text-white text-lg drop-shadow-md text-center mr-2">{idx + 1}</div>
                                   
                                   <div className="w-10 h-10 bg-blue-500 rounded border-2 border-black flex items-center justify-center mr-3 relative">
                                        <Shield size={20} className="text-white" />
                                        {/* Status Dot */}
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-black ${member.status === 'Çevrimiçi' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
                                   </div>

                                   <div className="flex-1 flex flex-col justify-center">
                                       <span className={`font-brawl text-lg leading-none ${member.isPlayer ? 'text-green-300' : 'text-white'}`}>
                                           {member.name}
                                       </span>
                                       <span className="text-[10px] text-blue-200 font-bold uppercase">{member.role}</span>
                                   </div>

                                   <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded min-w-[80px] justify-end">
                                       <Trophy size={16} className="text-yellow-400 fill-yellow-400" />
                                       <span className="text-white font-brawl text-lg">{member.trophies.toLocaleString()}</span>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}

                   {activeTab === 'CHAT' && (
                       <div className="h-full flex flex-col">
                           <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar" ref={chatContainerRef}>
                               {messages.map((msg) => {
                                   
                                   // --- RENDER INVITE CARD (NEW BLUE DESIGN) ---
                                   if (msg.type === 'INVITE') {
                                       const sender = club.members.find(m => m.name === msg.senderName);
                                       const trophyCount = sender ? sender.trophies : 31309;

                                       return (
                                           <div key={msg.id} className="relative w-80 bg-[#1e40af] border-4 border-black rounded-lg p-2 font-sans select-none animate-scaleIn origin-top-left shadow-[0_4px_0_rgba(0,0,0,0.5)]">
                                               {/* Decorative crying emote */}
                                               <div className="absolute -top-6 -right-6 transform rotate-12 z-20 pointer-events-none">
                                                   <div className="relative">
                                                       <div className="absolute inset-0 bg-cyan-400 blur-md rounded-full opacity-50"></div>
                                                       <Droplet size={64} className="text-cyan-400 fill-cyan-400 drop-shadow-[0_2px_0_#000] stroke-black stroke-[1.5]" />
                                                       <div className="absolute top-4 left-3 flex gap-2">
                                                           <div className="w-2 h-3 bg-black rounded-full rotate-45"></div>
                                                           <div className="w-2 h-3 bg-black rounded-full -rotate-45"></div>
                                                       </div>
                                                       <Frown size={24} className="text-black absolute top-8 left-3" strokeWidth={3} />
                                                   </div>
                                               </div>

                                               {/* Header */}
                                               <div className="text-center mb-2">
                                                   <h3 className="text-white font-brawl text-2xl uppercase drop-shadow-md stroke-black" style={{WebkitTextStroke: '1px black'}}>TAKIM DAVETİ</h3>
                                               </div>

                                               {/* Profile Card */}
                                               <div className="bg-[#3b82f6] border-2 border-black rounded p-2 flex gap-3 mb-3 relative overflow-hidden">
                                                   <div className="absolute inset-0 bg-white/10 skew-x-12 -ml-20 w-1/2"></div> 

                                                   {/* Avatar */}
                                                   <div className="w-16 h-16 bg-white border-2 border-black relative z-10 shrink-0 flex items-center justify-center overflow-hidden">
                                                       <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${msg.senderName}`} alt="Avatar" className="w-full h-full object-cover" />
                                                   </div>

                                                   {/* Info */}
                                                   <div className="flex flex-col justify-center z-10 w-full">
                                                       <div className="flex items-center gap-2 border-l-2 border-white/20 pl-2">
                                                           <span className="text-2xl drop-shadow-md">🇹🇷</span>
                                                           <span className="text-white font-brawl text-xl stroke-black drop-shadow-md truncate" style={{WebkitTextStroke: '1px black'}}>{msg.senderName}</span>
                                                       </div>
                                                       <div className="flex items-center gap-1 pl-2">
                                                           <Trophy size={16} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />
                                                           <span className="text-white font-brawl text-lg drop-shadow-md stroke-black" style={{WebkitTextStroke: '1px black'}}>{trophyCount}</span>
                                                       </div>
                                                   </div>
                                               </div>

                                               {/* Buttons */}
                                               <div className="flex gap-2 mb-2">
                                                   <button 
                                                       onClick={handleRejectInvite}
                                                       className="flex-1 bg-red-600 hover:bg-red-500 border-b-4 border-red-800 rounded text-white font-brawl py-2 text-lg active:border-b-0 active:translate-y-1 shadow-lg transition-all"
                                                   >
                                                       REDDET
                                                   </button>
                                                   <button 
                                                       onClick={() => handleJoinInvite(msg.senderName)}
                                                       className="flex-1 bg-green-500 hover:bg-green-400 border-b-4 border-green-700 rounded text-white font-brawl py-2 text-lg active:border-b-0 active:translate-y-1 shadow-lg transition-all"
                                                   >
                                                       KABUL ET
                                                   </button>
                                               </div>

                                               {/* Mute Footer */}
                                               <div className="bg-[#152860] p-1.5 rounded text-center border border-white/10">
                                                   <span className="text-[8px] text-white font-bold uppercase block tracking-wider">
                                                       <span className="text-blue-200">🇹🇷 | {msg.senderName}</span> ADLI OYUNCUYU 10 DAKİKALIĞINA SESSİZE AL
                                                   </span>
                                                   <div className="w-4 h-4 bg-[#1e40af] border border-black rounded mx-auto mt-1"></div>
                                               </div>
                                           </div>
                                       );
                                   }

                                   // --- RENDER NORMAL TEXT ---
                                   return (
                                       <div key={msg.id} className={`flex flex-col ${msg.isPlayer ? 'items-end' : 'items-start'}`}>
                                           <div className="flex items-end gap-2 max-w-[80%]">
                                               {!msg.isPlayer && (
                                                   <div className="w-8 h-8 rounded bg-blue-500 border border-black flex-shrink-0"></div>
                                               )}
                                               <div className={`
                                                    px-3 py-2 rounded-xl text-sm font-bold text-white shadow-md
                                                    ${msg.isPlayer ? 'bg-[#3b82f6] rounded-br-none' : 'bg-[#1e40af] rounded-bl-none'}
                                               `}>
                                                   {!msg.isPlayer && <div className="text-[10px] text-yellow-400 mb-0.5 uppercase">{msg.senderName} <span className="text-blue-200">• {msg.role}</span></div>}
                                                   {msg.text}
                                               </div>
                                           </div>
                                           <span className="text-[9px] text-white/50 font-bold mt-1 px-1">{msg.timestamp}</span>
                                       </div>
                                   );
                               })}
                           </div>
                           
                           <form onSubmit={handleSendMessage} className="p-2 bg-[#1e3a8a] border-t-2 border-black/20 flex gap-2">
                               <input 
                                  className="flex-1 bg-black/30 border-2 border-white/10 rounded-lg px-3 text-white font-bold placeholder:text-white/30 focus:border-blue-400 outline-none"
                                  placeholder="Bir mesaj yaz..."
                                  value={inputMessage}
                                  onChange={(e) => setInputMessage(e.target.value)}
                                  maxLength={100}
                               />
                               <button type="submit" className="bg-blue-500 p-2 rounded-lg border-2 border-black active:translate-y-1">
                                   <Send size={20} className="text-white" />
                                </button>
                           </form>
                       </div>
                   )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default ClubScreen;
