
import React, { useState, useEffect } from 'react';
import { SHOP_OFFERS } from '../constants';
import { ShopOffer, BrawlerType } from '../types';
import { ArrowLeft, Gem, Zap, Check, Target, Shield, Skull, Crosshair, Droplet, User, Bomb, Sword, Loader2, CreditCard, Fingerprint, X, Trophy } from 'lucide-react';

interface ShopScreenProps {
    onClose: () => void;
    gold: number;
    gems: number;
    onBuy: (offer: ShopOffer) => boolean; // Returns true if success
    unlockedSkins?: string[]; // To check ownership
    hasGoatMultiplier?: boolean; // Check if user has GOAT mode
    hasGoatPlusMultiplier?: boolean; // Check if user has GOAT PLUS mode
}

const ShopScreen: React.FC<ShopScreenProps> = ({ onClose, gold, gems, onBuy, unlockedSkins = [], hasGoatMultiplier, hasGoatPlusMultiplier }) => {
    // Payment Simulation State
    const [purchasingOffer, setPurchasingOffer] = useState<ShopOffer | null>(null);
    const [paymentStep, setPaymentStep] = useState<'CONFIRM' | 'PROCESSING' | 'SUCCESS'>('CONFIRM');

    const handleBuyClick = (offer: ShopOffer) => {
        if (offer.costType === 'REAL_MONEY') {
            // Trigger Realistic Payment Flow
            setPurchasingOffer(offer);
            setPaymentStep('CONFIRM');
        } else {
            // Instant In-Game Currency Purchase
            const success = onBuy(offer);
            if (success) {
                // Optional: Trigger confetti or sound here
            }
        }
    };

    const confirmPayment = () => {
        setPaymentStep('PROCESSING');
        
        // Simulate Network/Processing Delay
        setTimeout(() => {
            setPaymentStep('SUCCESS');
            
            // Finalize and Close
            setTimeout(() => {
                if (purchasingOffer) {
                    onBuy(purchasingOffer);
                }
                setPurchasingOffer(null);
            }, 1500);
        }, 2000);
    };

    const cancelPayment = () => {
        setPurchasingOffer(null);
    };

    const renderCost = (offer: ShopOffer) => {
        if (offer.costType === 'FREE') {
            return <span className="text-white font-brawl text-2xl uppercase">ÜCRETSİZ</span>;
        }

        if (offer.costType === 'REAL_MONEY') {
             return <span className="text-black font-brawl text-xl">{offer.priceLabel}</span>;
        }

        return (
            <div className="flex items-center gap-1">
                 {offer.originalCost && (
                     <span className="text-slate-300 line-through text-sm font-bold mr-2 opacity-70">{offer.originalCost}</span>
                 )}
                 {offer.costType === 'GEMS' && <Gem size={20} className="text-green-400 fill-green-500" />}
                 {offer.costType === 'GOLD' && <div className="w-4 h-4 bg-yellow-400 rounded-full border border-black"></div>}
                 <span className="text-white font-brawl text-2xl">{offer.cost}</span>
            </div>
        );
    };

    const getThemeColors = (theme: string) => {
        switch (theme) {
            case 'PINK': return 'from-[#ff99cc] to-[#ff69b4] border-[#d63384]'; // Pink/Special
            case 'ORANGE': return 'from-[#fbbf24] to-[#f59e0b] border-[#d97706]'; // Gold/Level Up
            case 'BLUE': return 'from-[#60a5fa] to-[#3b82f6] border-[#1d4ed8]'; // Blue/Level Up
            case 'PURPLE': return 'from-[#c084fc] to-[#a855f7] border-[#7e22ce]'; // Daily
            case 'GREEN': return 'from-[#4ade80] to-[#22c55e] border-[#15803d]'; // Gems
            case 'RED': return 'from-red-500 to-red-700 border-red-900'; // Special Skins
            default: return 'from-slate-600 to-slate-800 border-slate-900';
        }
    };

    // Helper to get Brawler Icon
    const getBrawlerIcon = (type?: BrawlerType) => {
        switch(type) {
            case BrawlerType.COLT: return Target;
            case BrawlerType.EL_PRIMO: return Shield;
            case BrawlerType.NITA: return Skull;
            case BrawlerType.SHELLY: return Sword;
            case BrawlerType.BROCK: return Crosshair;
            case BrawlerType.BARLEY: return Droplet;
            case BrawlerType.BULL: return User;
            case BrawlerType.DYNAMIKE: return Bomb;
            default: return Target;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#1e3a8a] flex flex-col animate-fadeIn">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3 bg-[#1e3a8a] border-b-2 border-black/20 shadow-lg z-20">
                 <button onClick={onClose} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1 hover:brightness-110">
                    <ArrowLeft size={28} className="text-white" />
                </button>
                
                <h2 className="text-3xl font-brawl text-white drop-shadow-md tracking-wider">DÜKKAN</h2>

                <div className="flex gap-4">
                     {/* Gold */}
                    <div className="flex items-center bg-black/40 px-3 py-1 rounded-full border border-black/20 h-10">
                        <div className="bg-yellow-500 rounded p-0.5 border border-black mr-2">
                            <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                        </div>
                        <span className="text-white font-brawl text-lg">{gold}</span>
                    </div>
                    {/* Gems */}
                    <div className="flex items-center bg-black/40 px-3 py-1 rounded-full border border-black/20 h-10">
                        <Gem size={18} className="text-green-400 fill-green-500 mr-2 drop-shadow-sm" />
                        <span className="text-white font-brawl text-lg">{gems}</span>
                    </div>
                </div>
            </div>

            {/* Scroll Area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden bg-[#1e3a8a] p-4 flex items-center gap-6 custom-scrollbar">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://api.placeholder.com/50')] opacity-5 pointer-events-none -z-10"></div>

                {SHOP_OFFERS.map(offer => {
                    const colors = getThemeColors(offer.colorTheme);
                    
                    let isPurchased = false;
                    if (offer.type === 'DAILY') {
                        isPurchased = localStorage.getItem(`claimed_daily_${new Date().toDateString()}`) === 'true';
                    }
                    if (offer.id === 'goat_trophy' && hasGoatMultiplier) {
                        isPurchased = true;
                    }
                    if (offer.id === 'goat_trophy_plus' && hasGoatPlusMultiplier) {
                        isPurchased = true;
                    }

                    const BrawlerIcon = getBrawlerIcon(offer.brawlerType);

                    return (
                        <div key={offer.id} className="relative flex-shrink-0 w-64 h-[22rem] group">
                            {/* Top Tab (Timer or Title) */}
                            <div className="absolute -top-4 left-0 right-0 h-8 bg-black z-0 rounded-t-lg mx-2 flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                                    {offer.type === 'DAILY' ? 'GÜNLÜK HEDİYE' : offer.title}
                                </span>
                            </div>

                            {/* Main Card Body */}
                            <div className={`
                                w-full h-full rounded-xl border-4 flex flex-col items-center relative overflow-hidden bg-gradient-to-b shadow-xl
                                ${colors}
                            `}>
                                {/* Background Pattern inside card */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://api.placeholder.com/20')] bg-repeat"></div>
                                
                                {/* Item Visual Area */}
                                <div className="flex-1 flex flex-col items-center justify-center z-10 w-full relative">
                                    {/* Light Burst Effect */}
                                    <div className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent animate-pulse-slow"></div>

                                    {/* GOAT Trophy Icons */}
                                    {(offer.id === 'goat_trophy' || offer.id === 'goat_trophy_plus') && (
                                        <div className="relative scale-125">
                                             <div className={`
                                                w-24 h-24 rounded-full border-4 border-white shadow-[0_0_20px_rgba(250,204,21,0.8)] flex items-center justify-center animate-bounce-slow
                                                ${offer.id === 'goat_trophy_plus' ? 'bg-gradient-to-br from-red-500 to-purple-600' : 'bg-gradient-to-br from-yellow-300 to-yellow-600'}
                                             `}>
                                                 <Trophy size={60} className="text-white fill-white drop-shadow-md" />
                                             </div>
                                             <div className={`
                                                absolute -bottom-2 -right-4 text-white font-brawl px-2 py-1 rounded border-2 border-white rotate-[-10deg] shadow-lg
                                                ${offer.id === 'goat_trophy_plus' ? 'bg-purple-600 animate-pulse' : 'bg-red-600'}
                                             `}>
                                                 {offer.id === 'goat_trophy_plus' ? '100x' : '10x'}
                                             </div>
                                        </div>
                                    )}

                                    {offer.rewardType === 'GOLD' && offer.id !== 'goat_trophy' && offer.id !== 'goat_trophy_plus' && (
                                        <div className="relative">
                                             <div className="w-24 h-24 bg-yellow-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                                 <div className="w-16 h-16 bg-yellow-300 rounded-full"></div>
                                             </div>
                                        </div>
                                    )}
                                    {offer.rewardType === 'POWER_POINTS' && (
                                        <div className="relative">
                                             <div className="w-24 h-24 bg-[#ff55ff] rounded-xl border-4 border-black rotate-3 shadow-lg flex items-center justify-center">
                                                  <Zap size={60} className="text-white fill-white" />
                                             </div>
                                             {/* Cards behind */}
                                             <div className="absolute -left-4 top-2 w-20 h-24 bg-blue-500 rounded-xl border-2 border-black -rotate-12 -z-10"></div>
                                             <div className="absolute -right-4 top-2 w-20 h-24 bg-orange-500 rounded-xl border-2 border-black rotate-12 -z-10"></div>
                                        </div>
                                    )}
                                    {offer.rewardType === 'GEMS' && (
                                         <div className="relative">
                                             <div className="w-24 h-24 bg-green-500 rounded-xl border-4 border-black shadow-lg flex items-center justify-center">
                                                 <Gem size={60} className="text-green-100 fill-green-100" />
                                             </div>
                                        </div>
                                    )}
                                    {offer.rewardType === 'MEGA_BOX' && (
                                         <div className="relative">
                                             <div className="w-24 h-24 bg-yellow-400 rounded-xl border-4 border-black shadow-lg flex items-center justify-center relative overflow-hidden">
                                                  <div className="absolute inset-0 bg-red-500 skew-x-12 -ml-2 rounded-l-md"></div>
                                                  <div className="font-brawl text-5xl text-white z-10 drop-shadow-md">M</div>
                                             </div>
                                        </div>
                                    )}
                                    
                                    {/* SKIN VISUAL */}
                                    {offer.rewardType === 'SKIN' && (
                                         <div className="relative group-hover:scale-105 transition-transform duration-300">
                                             {/* Character Silhouette / Icon */}
                                             <div className="w-40 h-40 bg-black/40 rounded-full border-4 border-white/50 flex items-center justify-center shadow-lg relative overflow-hidden">
                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                 <BrawlerIcon size={100} className="text-white drop-shadow-lg z-10" />
                                             </div>
                                             <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded border border-black rotate-[-5deg]">
                                                 KOSTÜM
                                             </div>
                                        </div>
                                    )}

                                    {/* Amount / Name */}
                                    {offer.rewardType !== 'SKIN' && offer.id !== 'goat_trophy' && offer.id !== 'goat_trophy_plus' ? (
                                        <>
                                            <div className="mt-4 font-brawl text-4xl text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.5)] stroke-black" style={{ WebkitTextStroke: '1px black' }}>
                                                {offer.amount}
                                            </div>
                                            <div className="text-white font-bold text-xs uppercase tracking-wider drop-shadow-md">
                                                {offer.rewardType === 'GOLD' ? 'ALTIN' : offer.rewardType === 'GEMS' ? 'ELMAS' : offer.rewardType === 'MEGA_BOX' ? 'MEGA KUTU' : 'GÜÇ PUANI'}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="mt-4 px-2 text-center">
                                            <div className="font-brawl text-xl text-white drop-shadow-md stroke-black leading-tight" style={{ WebkitTextStroke: '1px black' }}>
                                                {offer.title}
                                            </div>
                                        </div>
                                    )}


                                    {/* Tag Badge */}
                                    {offer.tag && (
                                        <div className="absolute top-2 right-2 rotate-12 bg-red-600 text-white font-brawl text-sm px-2 py-1 border-2 border-white rounded shadow-lg animate-bounce">
                                            {offer.tag}
                                        </div>
                                    )}
                                </div>

                                {/* Buy Button Area */}
                                <div className="w-full p-4 bg-black/20 backdrop-blur-sm border-t-2 border-black/10 z-10">
                                    {isPurchased ? (
                                        <div className="w-full bg-slate-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 border-b-4 border-slate-800">
                                            <Check size={20} /> ALINDI
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleBuyClick(offer)}
                                            className={`
                                                w-full py-2 rounded-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center
                                                ${offer.costType === 'FREE' ? 'bg-yellow-400 hover:bg-yellow-300 border-yellow-600' : ''}
                                                ${offer.costType === 'REAL_MONEY' ? 'bg-white hover:bg-slate-100 border-slate-400 text-black' : ''}
                                                ${offer.costType === 'GEMS' || offer.costType === 'GOLD' ? 'bg-green-500 hover:bg-green-400 border-green-700' : ''}
                                            `}
                                        >
                                            {renderCost(offer)}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- PAYMENT OVERLAY (Simulating Google Play / App Store) --- */}
            {purchasingOffer && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
                    
                    {/* The "System" Card */}
                    <div className="bg-white w-full md:w-[400px] rounded-t-2xl md:rounded-2xl p-6 shadow-2xl relative animate-slideUp">
                        
                        {/* Header Area */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                    G
                                </div>
                                <span className="font-bold text-gray-700 text-sm">Google Play</span>
                            </div>
                            {paymentStep === 'CONFIRM' && (
                                <button onClick={cancelPayment} className="bg-gray-100 p-1 rounded-full hover:bg-gray-200">
                                    <X size={16} className="text-gray-500" />
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        {paymentStep === 'CONFIRM' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        {(purchasingOffer.id === 'goat_trophy' || purchasingOffer.id === 'goat_trophy_plus') ? (
                                            <Trophy size={32} className="text-yellow-500 fill-yellow-500" />
                                        ) : (
                                            <Gem size={32} className="text-blue-500" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 text-lg leading-tight">{purchasingOffer.title}</span>
                                        <span className="text-gray-500 text-sm mt-1">Brawl Stars (Supercell)</span>
                                        <span className="text-green-600 font-bold mt-1 text-base">{purchasingOffer.priceLabel}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={20} className="text-gray-600" />
                                        <div className="flex flex-col">
                                            <span className="text-gray-800 text-xs font-bold">Visa •••• 4242</span>
                                            <span className="text-gray-400 text-[10px]">Varsayılan yöntem</span>
                                        </div>
                                    </div>
                                    <span className="text-blue-600 text-xs font-bold">DEĞİŞTİR</span>
                                </div>

                                <button 
                                    onClick={confirmPayment}
                                    className="w-full bg-[#00875f] hover:bg-[#00704f] text-white font-bold py-3 rounded-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 mt-2"
                                >
                                    TEK TIKLA SATIN AL
                                </button>
                                
                                <div className="flex justify-center mt-2">
                                    <Fingerprint size={32} className="text-gray-300 animate-pulse" />
                                </div>
                            </div>
                        )}

                        {paymentStep === 'PROCESSING' && (
                            <div className="flex flex-col items-center justify-center py-8 gap-4">
                                <Loader2 size={48} className="text-[#00875f] animate-spin" />
                                <span className="text-gray-600 font-bold">İşleniyor...</span>
                            </div>
                        )}

                        {paymentStep === 'SUCCESS' && (
                            <div className="flex flex-col items-center justify-center py-8 gap-4">
                                <div className="w-16 h-16 bg-[#00875f] rounded-full flex items-center justify-center animate-bounce">
                                    <Check size={40} className="text-white" strokeWidth={4} />
                                </div>
                                <span className="text-gray-800 font-bold text-xl">Ödeme Başarılı!</span>
                            </div>
                        )}
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopScreen;
