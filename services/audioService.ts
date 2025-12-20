
const audioContext: AudioContext | null = null;
let contextInitialized = false;

const SOUND_URLS: Record<string, string> = {
    SHOOT: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3', 
    HIT: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',
    DEATH: 'https://assets.mixkit.co/active_storage/sfx/167/167-preview.mp3',
    COLLECT: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
    LEVEL_UP: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    PURCHASE: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3' // New distinct sound
};

const audioBuffers: Record<string, AudioBuffer> = {};

let actx: AudioContext | undefined;

export const initAudio = async () => {
    if (contextInitialized) return;
    
    try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        actx = new Ctx();
        contextInitialized = true;

        // Preload sounds
        const promises = Object.entries(SOUND_URLS).map(async ([key, url]) => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                if (actx) {
                    const decoded = await actx.decodeAudioData(arrayBuffer);
                    audioBuffers[key] = decoded;
                }
            } catch (e) {
                console.warn('Failed to load sound:', key);
            }
        });

        await Promise.all(promises);
    } catch (e) {
        console.warn('Audio initialization failed', e);
    }
};

const playSound = (key: string) => {
    if (!actx || !audioBuffers[key]) return;
    if (actx.state === 'suspended') actx.resume();

    try {
        const source = actx.createBufferSource();
        source.buffer = audioBuffers[key];
        source.connect(actx.destination);
        source.start(0);
    } catch (e) {
        // Ignore
    }
};

export const playShootSound = (type?: string) => playSound('SHOOT');
export const playHitSound = () => playSound('HIT');
export const playDeathSound = () => playSound('DEATH');
export const playCollectSound = () => playSound('COLLECT');
export const playClickSound = () => playSound('CLICK');
export const playPurchaseSound = () => playSound('PURCHASE');
