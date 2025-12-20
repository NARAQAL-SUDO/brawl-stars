
import { GoogleGenAI } from "@google/genai";
import { GameStats } from "../types";

// Initialize Gemini AI with the pre-configured API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FALLBACK_COMMENTARIES = [
    "Muhteşem bir zafer! Arenanın kralı sensin!",
    "Buna 'ezici güç' denir! Harika oynadın.",
    "Şanssızlık... Bir dahaki sefere alırsın!",
    "Kupalar gitti ama onurunu korudun.",
    "Tam bir strateji dehasısın!",
    "Hızına kimse yetişemedi!",
    "Biraz daha dikkatli olmalısın, rakipler dişli.",
    "Efsanevi bir performanstı!",
    "Brawl Stars tarihine geçecek bir maçtı.",
    "Kutuları topladın, rakipleri dağıttın!"
];

const FALLBACK_CHAT_RESPONSES = [
    "Vay canına, tebrikler!",
    "Hadi maça girelim.",
    "Aynen katılıyorum.",
    "Bu sezon çok zor.",
    "Güzel oyun.",
    "Biraz kupa kasmam lazım.",
    "Selam!",
    "GG!",
];

/**
 * Generates an energetic and witty commentary based on end-of-match stats using Gemini AI.
 */
export const generateMatchCommentary = async (stats: GameStats): Promise<string> => {
  // Determine a context-aware fallback immediately for robust UX.
  const simpleFallback = stats.rank === 1 
      ? "HESAPLAŞMA! Arenanın hakimi sensin, tebrikler!" 
      : stats.rank <= 3 
          ? "İyi iş çıkardın, podyuma girmeyi başardın!"
          : "Zorlu bir maçtı, bir dahaki sefere daha iyisini yapacaksın!";

  try {
    // Using 'gemini-3-flash-preview' for basic text generation tasks as per coding guidelines.
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      Sen heyecanlı bir Türk Brawl Stars spikerisin. "Hesaplaşma" (Showdown) modu oynandı.
      
      Oyuncu İsmi: ${stats.playerName}
      Karakter: ${stats.brawlerName}
      Sıralama: ${stats.rank}. oldu (${stats.totalPlayers} kişi arasından)
      Leş (Kills): ${stats.kills}
      Toplanan Enerji Küpü: ${stats.powerCubesCollected}
      Kupa Değişimi: ${stats.trophyChange > 0 ? '+' + stats.trophyChange : stats.trophyChange}
      Hayatta Kalma Süresi: ${Math.floor(stats.duration / 1000)} saniye
      
      Lütfen maç hakkında kısa, enerjik ve esprili bir yorum yap. Oyuncunun ismini kullanabilirsin.
      1. olduysa "HESAPLAŞMA!" diye bağır ve kupa kazancını öv.
      Kupa kaybettiyse teselli et veya "Eksi yedik!" diye üzül.
      Türkçe konuş. Maksimum 2 cümle.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    // Directly access the .text property from GenerateContentResponse.
    return response.text || simpleFallback;
  } catch (error: any) {
    console.warn("Gemini yorumu alınamadı (Fallback kullanılıyor):", error.message);
    return simpleFallback;
  }
};

/**
 * Generates a contextual response for club chat interactions.
 */
export const generateClubChatResponse = async (userMessage: string, playerName: string, botName: string): Promise<string> => {
    try {
        // Using 'gemini-3-flash-preview' for conversational text tasks.
        const model = "gemini-3-flash-preview";
        
        const prompt = `
            Sen Brawl Stars oyununda bir kulüp üyesisin. Adın ${botName}.
            Kulüp arkadaşın ${playerName} şöyle bir mesaj yazdı: "${userMessage}"
            
            Bu mesaja Brawl Stars oyuncusu gibi, samimi, kısa ve Türkçe bir cevap ver.
            Mesajın içeriğine göre tepki ver (Örn: 1. oldum dediyse tebrik et, yenildim dediyse teselli et, karakterden bahsettiyse yorum yap).
            Oyun terimleri (kupa, rank, ulti, pusma, gg, wp, noob, pro) kullanabilirsin.
            Asla yapay zeka olduğunu belli etme. Sadece bir oyuncu gibi konuş.
            Maksimum 1 cümle olsun.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        // Directly access the .text property and trim for clean output.
        return response.text?.trim() || FALLBACK_CHAT_RESPONSES[Math.floor(Math.random() * FALLBACK_CHAT_RESPONSES.length)];
    } catch (error) {
        console.warn("Gemini chat hatası:", error);
        return FALLBACK_CHAT_RESPONSES[Math.floor(Math.random() * FALLBACK_CHAT_RESPONSES.length)];
    }
};
