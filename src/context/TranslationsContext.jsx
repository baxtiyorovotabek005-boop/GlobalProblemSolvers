import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    nav: { home: 'Home', problems: 'Problems', achievements: 'Achievements', contact: 'Contact', community: 'Community' },
    hero: { subtitle: 'Crowdsourcing ideas to solve the world biggest challenges.', cta: 'Explore Challenges', cta2: 'View Community', stats: { challenges: 'Global Challenges', solutions: 'Solutions', countries: 'Countries' } },
    problems: { title: '10 Global Challenges', causes: 'Causes:', effects: 'Effects:', submit: 'Submit Solution', lock: 'Log in to submit', success: 'Solution submitted!' },
    achievements: { title: 'Hall of Fame', tab1: 'Achievements', tab2: 'Track Progress', xp: 'Total XP', today: 'Today', week: 'This Week', rating: 'Rating', badges: 'Your Badges', empty: 'No achievements yet', mySolutions: 'My Solutions', daily: 'Daily Top', annual: 'Annual Top' },
    donation: { title: 'Support the Mission', subtitle: 'GPS is free for everyone, forever.', learnMore: 'Learn More' },
    contact: { title: 'Join the Movement', email: 'Email', telegram: 'Telegram' },
    footer: { problems: 'Problems', community: 'Community' },
    login: { title: 'Join GPS', subtitle: 'Create your profile', step1: 'Who are you?', step2: 'Where are you from?', step3: 'Almost there!', continue: 'Continue', back: 'Back', skip: 'Skip', confirm: 'Confirm & Join', name: 'Full Name', age: 'Age', phone: 'Phone (Optional)', country: 'Country', nameError: 'At least 2 characters', ageError: 'Age 10-120', countryError: 'Select your country' },
    community: { title: 'Community Hub', comingSoon: 'Coming soon with real-time chat...' }
  },
  uz: {
    nav: { home: 'Bosh sahifa', problems: 'Muammolar', achievements: 'Yutuqlar', contact: 'Aloqa', community: 'Hamjamiyat' },
    hero: { subtitle: 'Dunyo muammolarini hal qilish uchun goyalar.', cta: 'Muammolarni korish', cta2: 'Hamjamiyat', stats: { challenges: 'Global Muammolar', solutions: 'Yechimlar', countries: 'Mamlakatlar' } },
    problems: { title: '10 ta Global Muammo', causes: 'Sabablar:', effects: 'Oqibatlar:', submit: 'Yechim yuborish', lock: 'Kirish talab', success: 'Yechim yuborildi!' },
    achievements: { title: 'Shon-sharaf', tab1: 'Yutuqlar', tab2: 'Kuzatish', xp: 'Jami XP', today: 'Bugun', week: 'Hafta', rating: 'Baho', badges: 'Sizning medallar', empty: 'Yutuq yoq', mySolutions: 'Mening yechimlarim', daily: 'Kunlik TOP', annual: 'Yillik TOP' },
    donation: { title: 'Loyihani qollab-quvvatlang', subtitle: 'GPS hamma uchun bepul.', learnMore: 'Batafsil' },
    contact: { title: 'Harakatga qoshiling', email: 'Email', telegram: 'Telegram' },
    footer: { problems: 'Muammolar', community: 'Hamjamiyat' },
    login: { title: 'GPS ga qoshilish', subtitle: 'Profilingizni yarating', step1: 'Kim ekanchis?', step2: 'Qayerdansiz?', step3: 'Tayyormis!', continue: 'Davom', back: 'Orqaga', skip: 'Otkazib', confirm: 'Tasdiqla', name: 'To liq ism', age: 'Yosh', phone: 'Telefon (ixtiyoriy)', country: 'Davlat', nameError: 'Kamida 2 harf', ageError: 'Yosh 10-120', countryError: 'Davlat tanlang' },
    community: { title: 'Hamjamiyat', comingSoon: 'Tez kunda chat...' }
  },
  ru: {
    nav: { home: 'Glavnaya', problems: 'Problemy', achievements: 'Dostizheniya', contact: 'Kontakt', community: 'Soobschestvo' },
    hero: { subtitle: 'Sbory idey dlya resheniya globalnyh problem.', cta: 'Problemy', cta2: 'Soobschestvo', stats: { challenges: 'Problem', solutions: 'Resheniy', countries: 'Stran' } },
    problems: { title: '10 Globalnyh Problem', causes: 'Prichiny:', effects: 'Posledstviya:', submit: 'Otpravit reshenie', lock: 'Voydite dlya otpravki', success: 'Reshenie otpravleno!' },
    achievements: { title: 'Doska pocheta', tab1: 'Dostizheniya', tab2: 'Progress', xp: 'Vsego XP', today: 'Segodnya', week: 'Nedelya', rating: 'Reyting', badges: 'Vashi znachki', empty: 'Poka net', mySolutions: 'Mo resheniya', daily: 'Top dnya', annual: 'Top goda' },
    donation: { title: 'Podderzhat proekt', subtitle: 'GPS besplaten dlya vseh.', learnMore: 'Uzat bolshe' },
    contact: { title: 'Prisoedinyaytes', email: 'Email', telegram: 'Telegram' },
    footer: { problems: 'Problemy', community: 'Soobschestvo' },
    login: { title: 'Prisoedinitsya', subtitle: 'Sozdajte profil', step1: 'Kto vy?', step2: 'Otkuuda?', step3: 'Pochti gotovo!', continue: 'Dalee', back: 'Nazad', skip: 'Propustit', confirm: 'Podtverdit', name: 'Imya', age: 'Vozrast', phone: 'Telefon (opcionno)', country: 'Strana', nameError: 'Min 2 simvola', ageError: 'Vozrast 10-120', countryError: 'Vyberite stranu' },
    community: { title: 'Soobschestvo', comingSoon: 'Skoro s chatom...' }
  }
}

const TranslationsContext = createContext()

export function TranslationsProvider({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('gps_lang')
    if (saved && translations[saved]) setLang(saved)
  }, [])

  const changeLang = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang)
      localStorage.setItem('gps_lang', newLang)
    }
  }

  const t = translations[lang] || translations.en

  return (
    <TranslationsContext.Provider value={{ lang, changeLang, t, translations: translations[lang] }}>
      {children}
    </TranslationsContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(TranslationsContext)
  if (!context) throw new Error('useTranslations must be used within TranslationsProvider')
  return context
}