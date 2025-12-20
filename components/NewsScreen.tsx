
import React, { useState } from 'react';
import { MOCK_NEWS } from '../constants';
import { NewsItem } from '../types';
import { ArrowLeft, X, Youtube, Newspaper, Info, PlayCircle } from 'lucide-react';

interface NewsScreenProps {
    onClose: () => void;
}

const NewsScreen: React.FC<NewsScreenProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'NEWS' | 'VIDEO'>('NEWS');
    const heroItem = MOCK_NEWS.find(item => item.isHero);
    const listItems = MOCK_NEWS.filter(item => !item.isHero);

    return (
        <div className="fixed inset-0 z-50 bg-[#1e3a8a] flex flex-col animate-fadeIn">
            {/* --- TOP BAR --- */}
            <div className="flex items-center justify-between p-2 bg-[#1e3a8a] border-b-4 border-[#0d2e80] shadow-lg z-20 h-16">
                <div className="flex items-center gap-2">
                     <div 
                        onClick={() => setActiveTab('NEWS')}
                        className={`
                            px-4 py-2 rounded-t-lg font-brawl text-lg border-x-2 border-t-2 border-black/20 cursor-pointer flex items-center gap-2 transition-all
                            ${activeTab === 'NEWS' ? 'bg-[#3b82f6] text-white translate-y-2 pb-4' : 'bg-[#1e40af] text-blue-300 hover:bg-[#2563eb] translate-y-2'}
                        `}
                     >
                         <Newspaper size={20} />
                         HABERLER
                     </div>
                     <div 
                        onClick={() => setActiveTab('VIDEO')}
                        className={`
                            px-4 py-2 rounded-t-lg font-brawl text-lg border-x-2 border-t-2 border-black/20 cursor-pointer flex items-center gap-2 transition-all
                            ${activeTab === 'VIDEO' ? 'bg-[#3b82f6] text-white translate-y-2 pb-4' : 'bg-[#1e40af] text-blue-300 hover:bg-[#2563eb] translate-y-2'}
                        `}
                     >
                         <Youtube size={20} />
                         VİDEOLAR
                     </div>
                </div>

                <div className="text-white font-brawl text-2xl drop-shadow-md uppercase tracking-wider absolute left-1/2 -translate-x-1/2 top-4">
                    BRAWL HABER
                </div>

                <button onClick={onClose} className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg border-2 border-black active:scale-95 transition-transform">
                    <X size={24} className="text-white" />
                </button>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 bg-[#3b82f6] p-4 flex gap-4 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://api.placeholder.com/50')] opacity-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#3b82f6] to-[#1e3a8a] -z-10"></div>

                {/* LEFT: HERO SECTION (Big Card) */}
                <div className="hidden md:flex flex-col w-1/2 h-full bg-[#1e1e24] rounded-xl border-4 border-black shadow-2xl overflow-hidden relative group cursor-pointer hover:brightness-110 transition-all">
                    {heroItem && (
                        <>
                            {/* Hero Image Area */}
                            <div className="flex-1 bg-gradient-to-br from-pink-600 to-purple-800 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://api.placeholder.com/600')] opacity-30 bg-cover bg-center"></div>
                                {/* Silhouette / Icon */}
                                <div className="z-10 transform group-hover:scale-105 transition-transform duration-700">
                                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                                        <span className="text-9xl font-brawl text-black">?</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Text Content */}
                            <div className="h-1/3 bg-white p-6 flex flex-col justify-between relative">
                                {/* Diagonal decoration */}
                                <div className="absolute -top-6 left-0 right-0 h-12 bg-white -skew-y-3"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">YENİ</div>
                                        <span className="text-slate-400 text-xs font-bold uppercase">{heroItem.date}</span>
                                    </div>
                                    <h1 className="font-brawl text-3xl md:text-4xl text-black leading-none mb-2">{heroItem.title}</h1>
                                    <p className="text-slate-600 text-sm line-clamp-2 font-medium">{heroItem.description}</p>
                                </div>

                                <button className="self-start bg-yellow-400 hover:bg-yellow-300 text-black font-brawl text-xl px-8 py-2 rounded-lg border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all shadow-lg uppercase mt-2 relative z-10">
                                    {heroItem.linkText || 'İNCELE'}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* RIGHT: NEWS LIST */}
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
                    {listItems.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white rounded-lg border-2 border-black flex h-32 overflow-hidden shadow-lg hover:translate-x-1 transition-transform cursor-pointer group"
                        >
                            {/* Image Thumbnail */}
                            <div className={`w-32 bg-slate-800 relative flex items-center justify-center overflow-hidden flex-shrink-0`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-80"></div>
                                {item.type === 'UPDATE' && <Newspaper className="text-white relative z-10 opacity-50 group-hover:scale-110 transition-transform" size={40} />}
                                {item.type === 'EVENT' && <PlayCircle className="text-white relative z-10 opacity-50 group-hover:scale-110 transition-transform" size={40} />}
                                {item.type === 'MAINTENANCE' && <Info className="text-white relative z-10 opacity-50 group-hover:scale-110 transition-transform" size={40} />}
                                {item.type === 'COMMUNITY' && <Youtube className="text-white relative z-10 opacity-50 group-hover:scale-110 transition-transform" size={40} />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-3 flex flex-col justify-center">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-[10px] font-bold uppercase px-1.5 rounded text-white
                                        ${item.type === 'UPDATE' ? 'bg-blue-500' : ''}
                                        ${item.type === 'EVENT' ? 'bg-green-500' : ''}
                                        ${item.type === 'MAINTENANCE' ? 'bg-orange-500' : ''}
                                        ${item.type === 'COMMUNITY' ? 'bg-purple-500' : ''}
                                    `}>
                                        {item.type === 'UPDATE' ? 'GÜNCELLEME' : item.type === 'MAINTENANCE' ? 'BAKIM' : 'ETKİNLİK'}
                                    </span>
                                    <span className="text-slate-400 text-[10px] font-bold uppercase">{item.date}</span>
                                </div>
                                <h3 className="font-brawl text-lg text-black leading-tight mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                <p className="text-slate-500 text-xs font-bold line-clamp-2">{item.description}</p>
                            </div>

                            {/* Arrow Indicator */}
                            <div className="w-8 flex items-center justify-center border-l border-slate-100 bg-slate-50 group-hover:bg-blue-50 transition-colors">
                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-slate-400 group-hover:border-l-blue-500"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsScreen;
