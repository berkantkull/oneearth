export type Locale = "tr" | "en";

export type Copy = {
  home: string; lights: string; light: string; demo: string; tagline: string; titleLead: string; titleTail: string;
  explore: string; choosePlace: string; cancel: string; leaveLight: string; empty: string; copyright: string;
  earthLight: string; closeDetails: string; copyLink: string; copied: string; dialogClose: string;
  remembers: string; joinedEarth: string; seeLight: string; oneWordQuestion: string; wordPrompt: string;
  change: string; wordPlaceholder: string; wordRule: string; privacy: string; demoWarning: string;
  placing: string; placeLight: string; submitError: string; fallbackEyebrow: string; fallbackTitle: string;
  fallbackCopy: string; loadError: string; loading: string;
};

export const messages: Record<Locale, Copy> = {
  tr: {
    home: "ONE EARTH ana sayfa", lights: "ışık", light: "ışık", demo: "Deneme", tagline: "Tek dünya. Milyonlarca ses.",
    titleLead: "Buradaydın.", titleTail: "Dünya bunu hatırlıyor.", explore: "Çevirmek için sürükle · Bir ışığa dokun",
    choosePlace: "Yaklaşık konumunu seçmek için dünyaya dokun", cancel: "Vazgeç", leaveLight: "Işığını bırak",
    empty: "Henüz hiç ışık yok. İlki senin olabilir.", copyright: "© 2026 Berkant Kul. Tüm hakları saklıdır.",
    earthLight: "Dünya’dan bir ışık", closeDetails: "Işık ayrıntılarını kapat", copyLink: "Bağlantıyı kopyala",
    copied: "Bağlantı kopyalandı", dialogClose: "Pencereyi kapat", remembers: "Dünya hatırlıyor",
    joinedEarth: "Işığın artık Dünya’nın bir parçası.", seeLight: "Işığını gör", oneWordQuestion: "Senin tek kelimen ne?",
    wordPrompt: "Bir his, bir umut ya da bir anı. Burada olduğunu anlatan tek kelime.", change: "Değiştir",
    wordPlaceholder: "Kelimen", wordRule: "Tek kelime · Boşluksuz · Her dilde", privacy: "Seçtiğin yaklaşık konum ve kelime herkese açık olur. GPS konumunu istemiyoruz.",
    demoWarning: "GitHub Pages sürümünde ışık yalnızca bu oturumda görünür; kalıcı olarak kaydedilmez.", placing: "Işık yerleştiriliyor",
    placeLight: "Işığımı yerleştir", submitError: "Işığın yerleştirilemedi. Lütfen tekrar dene.", fallbackEyebrow: "Dünya hâlâ burada",
    fallbackTitle: "Tarayıcın 3B dünyayı açamadı.", fallbackCopy: "Yakın tarihli ışıkları yine de aşağıdan görebilirsin.",
    loadError: "Güncel ışıklara ulaşılamadı.", loading: "Dünya hazırlanıyor",
  },
  en: {
    home: "ONE EARTH home", lights: "lights", light: "light", demo: "Demo", tagline: "One planet. Millions of voices.",
    titleLead: "You were here.", titleTail: "And the Earth remembers.", explore: "Drag to explore · Tap a light",
    choosePlace: "Tap the Earth to choose an approximate place", cancel: "Cancel", leaveLight: "Leave your light",
    empty: "There are no lights yet. Yours can be the first.", copyright: "© 2026 Berkant Kul. All rights reserved.",
    earthLight: "A light from Earth", closeDetails: "Close light details", copyLink: "Copy link", copied: "Link copied",
    dialogClose: "Close dialog", remembers: "The Earth remembers", joinedEarth: "Your light is now part of Earth.",
    seeLight: "See your light", oneWordQuestion: "What is your one word?", wordPrompt: "A feeling, a hope, a memory. One word that says you were here.",
    change: "Change", wordPlaceholder: "Your word", wordRule: "One word · No spaces · Any language",
    privacy: "Your approximate place and word will be public. We never request your GPS location.",
    demoWarning: "On GitHub Pages, this light exists only for this session and is not saved.", placing: "Placing your light",
    placeLight: "Place my light", submitError: "Your light could not be placed. Please try again.", fallbackEyebrow: "The Earth is still here",
    fallbackTitle: "Your browser could not open the 3D globe.", fallbackCopy: "You can still visit recent lights below.",
    loadError: "The latest lights could not be reached.", loading: "Preparing Earth",
  },
};
