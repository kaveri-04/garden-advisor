import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.advisor": "Crop Advisor",
      "nav.research": "Research Hub",
      "nav.history": "My Garden",
      "nav.logout": "Logout",
      "nav.login": "Login",
      "nav.register": "Register",

      // Hero
      "hero.title": "Grow anything,\neven as a beginner",
      "hero.subtitle": "Answer a few simple questions — we'll tell you exactly what to plant and how to care for it.",
      "hero.badge1": "No expertise needed",
      "hero.badge2": "Step-by-step care",
      "hero.badge3": "Common mistakes fixed",
      "hero.cta": "Start Growing",
      "hero.login_cta": "Login to Save Progress",

      // Steps
      "step.where": "Where will you grow?",
      "step.where_sub": "Tell us about your space. You don't need a big garden — even a single pot on a balcony works!",
      "step.what": "What do you want to grow?",
      "step.what_sub": "Search for a crop or pick from our most popular options.",
      "step.soil": "Tell us about your soil",
      "step.soil_sub": "Don't worry if you don't know — we'll suggest the best option for you.",
      "step.location": "Where are you located?",
      "step.location_sub": "This helps us tailor advice for your climate and season.",
      "step.confirm": "Review your details",
      "step.confirm_sub": "Everything look right? Let's get your personalized recommendation!",

      // Space types
      "space.pots": "Pots / Containers",
      "space.pots_sub": "Balcony, terrace, windowsill",
      "space.garden": "Small Garden Bed",
      "space.garden_sub": "Front yard patch, side strip",
      "space.raised": "Raised / Grow Bag",
      "space.raised_sub": "Grow bag, wooden planter box",
      "space.indoors": "Indoors",
      "space.indoors_sub": "Kitchen, windowsill, shelf",

      // Soil types
      "soil.unknown": "I don't know",
      "soil.unknown_sub": "We'll recommend what's best",
      "soil.loamy": "Loamy (Dark, crumbly)",
      "soil.loamy_sub": "Best for most crops",
      "soil.sandy": "Sandy (Light, drains fast)",
      "soil.sandy_sub": "Needs more watering",
      "soil.clay": "Clay (Heavy, sticky)",
      "soil.clay_sub": "Holds moisture, needs drainage",
      "soil.red": "Red / Laterite",
      "soil.red_sub": "Common in South India",

      // Buttons
      "btn.next": "Next →",
      "btn.back": "← Back",
      "btn.get_recommendation": "Get My Recommendation 🌱",
      "btn.new_search": "New Search",
      "btn.save": "Save",

      // Results
      "result.your_plan": "Your Growing Plan",
      "result.fertilizers": "Fertilizer Schedule",
      "result.care_tips": "Care Tips",
      "result.mistakes": "Common Mistakes to Avoid",
      "result.watering": "Watering Schedule",
      "result.sunlight": "Sunlight Needs",
      "result.soil_prep": "Soil Preparation",
      "result.harvest": "Expected Harvest",
      "result.primary": "Primary",
      "result.secondary": "Secondary",
      "result.optional": "Optional",

      // Research Hub
      "research.title": "AgroIntel Research Hub",
      "research.subtitle": "Comprehensive farming intelligence — fertilizers, crops, soil & climate",
      "research.fertilizers": "Fertilizers",
      "research.crops": "Crops",
      "research.tap_to_see": "Tap any fertilizer to see full research data, crop suitability, side effects & conditions.",

      // Auth
      "auth.welcome": "Welcome back",
      "auth.new": "Create your account",
      "auth.email": "Email address",
      "auth.password": "Password",
      "auth.fullname": "Full name",
      "auth.phone": "Phone number (optional)",
      "auth.city": "City",
      "auth.state": "State",
      "auth.language": "Preferred language",
      "auth.login": "Sign in",
      "auth.register": "Create account",
      "auth.no_account": "Don't have an account?",
      "auth.have_account": "Already have an account?",
      "auth.forgot": "Forgot password?",

      // Language names
      "lang.en": "English",
      "lang.hi": "हिन्दी (Hindi)",
      "lang.te": "తెలుగు (Telugu)",
      "lang.ta": "தமிழ் (Tamil)",
      "lang.kn": "ಕನ್ನಡ (Kannada)",
      "lang.mr": "मराठी (Marathi)",
      "lang.bn": "বাংলা (Bengali)",
      "lang.gu": "ગુજરાતી (Gujarati)",

      // History
      "history.title": "My Garden History",
      "history.empty": "No recommendations yet. Start by searching for a crop!",
      "history.crop": "Crop",
      "history.space": "Space",
      "history.date": "Date",
      "history.view": "View Details",
    }
  },
  hi: {
    translation: {
      "hero.title": "कुछ भी उगाएं,\nशुरुआत करने वाले भी",
      "hero.subtitle": "कुछ सरल सवालों के जवाब दें — हम आपको बताएंगे क्या उगाएं और कैसे देखभाल करें।",
      "hero.badge1": "कोई विशेषज्ञता जरूरी नहीं",
      "hero.badge2": "चरण-दर-चरण देखभाल",
      "hero.badge3": "सामान्य गलतियाँ ठीक",
      "hero.cta": "उगाना शुरू करें",
      "step.where": "आप कहाँ उगाएंगे?",
      "step.what": "आप क्या उगाना चाहते हैं?",
      "step.soil": "अपनी मिट्टी के बारे में बताएं",
      "step.location": "आप कहाँ रहते हैं?",
      "step.confirm": "अपनी जानकारी देखें",
      "space.pots": "गमले / कंटेनर",
      "space.pots_sub": "बालकनी, छत, खिड़की",
      "space.garden": "छोटी बगीचे की क्यारी",
      "space.garden_sub": "सामने का यार्ड, साइड पट्टी",
      "space.raised": "उठी हुई क्यारी / ग्रो बैग",
      "space.raised_sub": "ग्रो बैग, लकड़ी का प्लांटर बॉक्स",
      "space.indoors": "घर के अंदर",
      "space.indoors_sub": "रसोई, खिड़की, शेल्फ",
      "btn.next": "आगे →",
      "btn.back": "← पीछे",
      "btn.get_recommendation": "मेरी सिफारिश पाएं 🌱",
      "result.your_plan": "आपकी उगाने की योजना",
      "result.fertilizers": "उर्वरक अनुसूची",
      "result.care_tips": "देखभाल के टिप्स",
      "result.mistakes": "आम गलतियाँ जो न करें",
      "result.watering": "सिंचाई का समय",
      "result.sunlight": "धूप की जरूरत",
      "result.harvest": "अनुमानित फसल",
      "auth.welcome": "वापस स्वागत है",
      "auth.login": "साइन इन करें",
      "auth.register": "खाता बनाएं",
      "research.title": "एग्रोइंटेल रिसर्च हब",
      "research.fertilizers": "उर्वरक",
      "research.crops": "फसलें",
    }
  },
  te: {
    translation: {
      "hero.title": "ఏదైనా పెంచండి,\nమొదటిసారి అయినా సరే",
      "hero.subtitle": "కొన్ని సులభమైన ప్రశ్నలకు జవాబివ్వండి — మేము మీకు ఏమి పెంచాలో, ఎలా జాగ్రత్తపడాలో చెప్తాం.",
      "hero.badge1": "నిపుణత అవసరం లేదు",
      "hero.badge2": "దశల వారీ సంరక్షణ",
      "hero.badge3": "సాధారణ తప్పులు సరిదిద్దబడ్డాయి",
      "hero.cta": "పెంచడం ప్రారంభించండి",
      "step.where": "మీరు ఎక్కడ పెంచుతారు?",
      "step.what": "మీరు ఏమి పెంచాలని అనుకుంటున్నారు?",
      "step.soil": "మీ నేల గురించి చెప్పండి",
      "step.location": "మీరు ఎక్కడ ఉన్నారు?",
      "space.pots": "కుండలు / కంటైనర్లు",
      "space.pots_sub": "బాల్కనీ, టెర్రేస్, కిటికీ",
      "space.garden": "చిన్న తోట మడి",
      "space.raised": "రెయిజ్డ్ బెడ్ / గ్రో బ్యాగ్",
      "space.indoors": "లోపల",
      "space.indoors_sub": "వంటగది, కిటికీ, చెక్క",
      "btn.next": "తదుపరి →",
      "btn.back": "← వెనుక",
      "btn.get_recommendation": "నా సిఫార్సు పొందండి 🌱",
      "result.your_plan": "మీ పెరుగుదల ప్రణాళిక",
      "result.fertilizers": "ఎరువుల షెడ్యూల్",
      "result.care_tips": "సంరక్షణ చిట్కాలు",
      "auth.welcome": "తిరిగి స్వాగతం",
      "auth.login": "లాగిన్ అవ్వండి",
      "auth.register": "ఖాతా సృష్టించండి",
      "research.title": "అగ్రోఇంటెల్ రిసెర్చ్ హబ్",
    }
  },
  ta: {
    translation: {
      "hero.title": "எதையும் வளர்க்கலாம்,\nதொடக்கக்காரர்களும் கூட",
      "hero.subtitle": "சில எளிய கேள்விகளுக்கு பதிலளியுங்கள் — நாங்கள் என்ன வளர்க்கணும், எப்படி பராமரிக்கணும் என்று சொல்கிறோம்.",
      "hero.badge1": "நிபுணத்துவம் தேவையில்லை",
      "hero.badge2": "படிப்படியான பராமரிப்பு",
      "hero.badge3": "பொதுவான தவறுகள் திருத்தப்பட்டன",
      "hero.cta": "வளர்க்கத் தொடங்குங்கள்",
      "step.where": "நீங்கள் எங்கு வளர்ப்பீர்கள்?",
      "step.what": "நீங்கள் என்ன வளர்க்க விரும்புகிறீர்கள்?",
      "space.pots": "தொட்டிகள் / கொள்கலன்கள்",
      "space.garden": "சிறிய தோட்டப் பாத்தி",
      "space.raised": "உயர்த்தப்பட்ட பாத்தி",
      "space.indoors": "வீட்டிற்கு உள்ளே",
      "btn.next": "அடுத்து →",
      "btn.back": "← பின்",
      "btn.get_recommendation": "என் பரிந்துரையைப் பெறுங்கள் 🌱",
      "auth.welcome": "மீண்டும் வரவேற்கிறோம்",
      "auth.login": "உள்நுழைய",
      "auth.register": "கணக்கு உருவாக்கு",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('gardenLang') || 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
