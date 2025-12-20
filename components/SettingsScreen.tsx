
import React, { useState } from 'react';
import { ArrowLeft, Check, Gamepad2 } from 'lucide-react';

interface SettingsScreenProps {
    onClose: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
    // Mock States for UI
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [hapticEnabled, setHapticEnabled] = useState(true);
    const [blockInvites, setBlockInvites] = useState(false);

    const ToggleButton = ({ label, isOn, onToggle }: { label: string, isOn: boolean, onToggle: () => void }) => (
        <div className="flex flex-col items-center gap-1 w-full">
            <span className="text-white font-brawl text-[10px] md:text-xs uppercase drop-shadow-md tracking-wide text-center h-8 flex items-end justify-center leading-tight pb-1 w-full">{label}</span>
            <div className="flex w-full max-w-[140px] border-2 border-black rounded-lg overflow-hidden shadow-lg cursor-pointer h-10" onClick={onToggle}>
                <div className={`flex-1 flex items-center justify-center font-brawl text-xs md:text-sm ${isOn ? 'bg-[#22c55e] text-white' : 'bg-[#374151] text-[#9ca3af]'} transition-colors border-r border-black/20`}>AÇIK</div>
                <div className={`flex-1 flex items-center justify-center font-brawl text-xs md:text-sm ${!isOn ? 'bg-[#ef4444] text-white' : 'bg-[#374151] text-[#9ca3af]'} transition-colors`}>KAPALI</div>
            </div>
        </div>
    );

    const MenuButton = ({ label, subLabel }: { label: string, subLabel?: string }) => (
        <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] border-b-4 border-[#1d4ed8] active:border-b-0 active:translate-y-1 text-white rounded-lg px-2 py-3 flex flex-col items-center justify-center shadow-lg transition-all relative overflow-hidden group border-2 border-black h-16 md:h-20">
             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             {subLabel && <span className="text-[10px] text-blue-200 uppercase font-bold mb-0.5 leading-none">{subLabel}</span>}
             <span className="font-brawl text-xs md:text-sm uppercase leading-tight drop-shadow-md text-center stroke-black" style={{ WebkitTextStroke: '0.5px black' }}>{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fadeIn p-4 font-sans select-none">
             <div className="w-full max-w-5xl bg-[#1e3a8a] border-4 border-black rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[95vh] relative animate-scaleIn">
                
                {/* Header */}
                <div className="flex items-center justify-between p-3 bg-[#1e40af] border-b-4 border-[#0d2e80] shadow-lg z-20 relative">
                    <button onClick={onClose} className="bg-blue-600 p-2 rounded-lg border-2 border-black active:translate-y-1 hover:brightness-110 shadow-md">
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h2 className="text-3xl font-brawl text-white uppercase drop-shadow-[0_2px_0_#000] tracking-wider stroke-black absolute left-1/2 -translate-x-1/2" style={{ WebkitTextStroke: '1px black' }}>AYARLAR</h2>
                    <div className="w-10"></div> 
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#3b82f6] relative custom-scrollbar">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('https://api.placeholder.com/50')] opacity-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a] to-[#3b82f6] -z-10"></div>

                    {/* 1. Toggles Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
                        <ToggleButton label="SES EFEKTLERİ" isOn={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
                        <ToggleButton label="MÜZİK" isOn={musicEnabled} onToggle={() => setMusicEnabled(!musicEnabled)} />
                        <ToggleButton label="DOKUNMATİK GERİ BİLDİRİM" isOn={hapticEnabled} onToggle={() => setHapticEnabled(!hapticEnabled)} />
                        <ToggleButton label="ARKADAŞLIK İSTEKLERİNİ ENGELLE" isOn={blockInvites} onToggle={() => setBlockInvites(!blockInvites)} />
                    </div>

                    {/* 2. Middle Row (IDs) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                         {/* Supercell ID */}
                         <div className="bg-[#1f2937] p-2 rounded-xl border-2 border-black flex items-center justify-between gap-2 shadow-lg relative overflow-hidden group cursor-pointer hover:brightness-110">
                             <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500"></div>
                             <div className="flex flex-col ml-3 z-10">
                                 <span className="text-[10px] text-slate-300 font-bold uppercase mb-1">SUPERCELL ID</span>
                                 <div className="bg-[#22c55e] text-white text-[10px] font-bold px-2 py-0.5 rounded border border-black flex items-center gap-1 w-fit shadow-sm">
                                     <Check size={10} strokeWidth={4} /> <span className="font-brawl">BAĞLANDI</span>
                                 </div>
                             </div>
                             <div className="w-10 h-8 bg-white rounded border-2 border-black flex items-center justify-center z-10 shadow-sm">
                                 <span className="font-brawl text-black text-xs">ID</span>
                             </div>
                         </div>
                         
                         {/* Play with Friends */}
                         <button className="bg-[#06c755] hover:bg-[#05a345] border-2 border-black border-b-4 active:border-b-2 active:translate-y-1 text-white font-brawl uppercase rounded-xl shadow-lg flex items-center justify-center p-2 text-sm md:text-base gap-2">
                             <span className="drop-shadow-md stroke-black" style={{ WebkitTextStroke: '0.5px black' }}>LINE</span>
                             <span className="text-[10px] md:text-xs">ARKADAŞLARINLA OYNA</span>
                         </button>

                         {/* Google Play */}
                         <button className="bg-[#3b82f6] hover:bg-[#2563eb] border-2 border-black border-b-4 active:border-b-2 active:translate-y-1 text-white font-brawl uppercase rounded-xl shadow-lg flex items-center justify-center p-2 gap-2 text-xs md:text-sm">
                             <Gamepad2 size={24} className="drop-shadow-sm" /> 
                             <span className="drop-shadow-md stroke-black" style={{ WebkitTextStroke: '0.5px black' }}>Google Play ile Giriş</span>
                         </button>
                    </div>

                    {/* 3. Bottom Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MenuButton label="Kontrolleri Düzenle" />
                        <MenuButton label="Hizmet Koşulları" />
                        <MenuButton label="Gizlilik Politikası" />
                        <MenuButton label="Yardım ve Destek" />
                        <MenuButton label="Türkçe" subLabel="DİL" />
                        <MenuButton label="Turkey (TR)" subLabel="KONUM" />
                        <MenuButton label="Hazırlayanlar" />
                        <MenuButton label="Ebeveyn Kılavuzu" />
                    </div>
                </div>
                
                {/* ID Footer */}
                <div className="bg-[#1e40af] p-2 flex justify-center border-t-4 border-[#0d2e80] z-20">
                    <span className="text-white/50 text-[10px] font-bold uppercase">ID: 88219-X • SÜRÜM 1.12.8</span>
                </div>
             </div>
        </div>
    );
};

export default SettingsScreen;
