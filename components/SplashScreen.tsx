

import React, { useEffect, useState } from 'react';
import { GAME_TIPS } from '../constants';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("Sunucuya bağlanılıyor...");
    const [tip, setTip] = useState("");

    useEffect(() => {
        // Set random tip on mount
        setTip(GAME_TIPS[Math.floor(Math.random() * GAME_TIPS.length)]);

        const totalDuration = 3500; // 3.5 seconds total load time
        const intervalTime = 30;
        const steps = totalDuration / intervalTime;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newProgress = Math.min(100, (currentStep / steps) * 100);
            
            // Add some non-linear "lag" simulation to make it feel real
            if (newProgress > 20 && newProgress < 30 && Math.random() > 0.8) {
                // stall briefly
            } else if (newProgress > 70 && newProgress < 80) {
                 // slow down
                 setProgress(prev => Math.min(100, prev + 0.2));
            } else {
                setProgress(newProgress);
            }

            // Change text based on progress
            if (newProgress > 20 && newProgress < 40) setLoadingText("İçerik indiriliyor...");
            if (newProgress > 40 && newProgress < 70) setLoadingText("Oyuncu verileri yükleniyor...");
            if (newProgress > 70 && newProgress < 90) setLoadingText("Lobi oluşturuluyor...");
            if (newProgress >= 100) {
                setLoadingText("Tamamlandı!");
                clearInterval(timer);
                setTimeout(onComplete, 500); // Small delay after 100% before closing
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#1e3a8a] font-sans overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                {/* We use a gradient and a pattern to simulate the Snowtel/Winter vibe */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#60a5fa] via-[#3b82f6] to-[#1e3a8a]"></div>
                
                {/* Snowflake/Particle effects simulation */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://api.placeholder.com/1000')] bg-cover mix-blend-overlay"></div>
                
                {/* Character silhouette placeholder collage to mimic the splash art */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="w-[120%] h-full bg-[url('https://api.placeholder.com/1200x800')] bg-cover bg-center rotate-[-5deg] scale-110 blur-sm"></div>
                </div>
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
            </div>

            {/* Logo Area */}
            <div className="relative z-10 p-8 flex justify-between items-start animate-slideDown">
                <div className="flex flex-col">
                    <h1 className="font-brawl text-5xl md:text-7xl text-yellow-400 drop-shadow-[0_4px_0_#000] stroke-black" style={{ WebkitTextStroke: '2px black' }}>
                        BRAWL
                    </h1>
                    <h1 className="font-brawl text-5xl md:text-7xl text-white drop-shadow-[0_4px_0_#000] stroke-black -mt-2 ml-8" style={{ WebkitTextStroke: '2px black' }}>
                        STARS
                    </h1>
                </div>
                
                <div className="bg-blue-500/80 backdrop-blur-md px-3 py-1 rounded border border-white/30 text-white font-bold text-xs uppercase shadow-lg rotate-3">
                    SNOWTEL SEZONU
                </div>
            </div>

            {/* Center Area (Empty for visual space) */}
            <div className="flex-1 relative z-10 flex items-center justify-center">
                 {/* Optional Central Visual or just space for the background art to shine */}
            </div>

            {/* Bottom Loading Area */}
            <div className="relative z-10 w-full px-8 md:px-20 pb-8 flex flex-col gap-2">
                
                {/* Tip Section */}
                <div className="flex justify-center mb-4">
                     <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center max-w-lg">
                         <span className="text-yellow-400 font-bold text-xs uppercase mr-2">İPUCU:</span>
                         <span className="text-white text-xs md:text-sm font-medium">{tip}</span>
                     </div>
                </div>

                {/* Text */}
                <div className="flex justify-between items-end mb-1">
                    <span className="text-white font-brawl text-xl md:text-2xl drop-shadow-md tracking-wide stroke-black" style={{ WebkitTextStroke: '1px black' }}>
                        {loadingText}
                    </span>
                    <span className="text-white font-brawl text-xl drop-shadow-md">
                        {Math.floor(progress)}%
                    </span>
                </div>

                {/* Bar Container */}
                <div className="w-full h-8 bg-[#0f172a] rounded-full border-4 border-black relative overflow-hidden shadow-2xl">
                    {/* Bar Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:20px_20px]"></div>
                    
                    {/* Fill */}
                    <div 
                        className="h-full bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#a855f7] transition-all duration-100 ease-linear relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Shine effect on bar */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-sm"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 blur-sm"></div>
                    </div>
                </div>

                <div className="text-white/50 text-[10px] font-bold text-center mt-2 uppercase tracking-widest">
                    ID: 88219-X • SÜRÜM 1.12.8
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
