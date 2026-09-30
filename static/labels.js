const LABELS = {
  en: {
    rasi: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
    nakshatra: ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
    planets: { Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu", Mandi: "Mandi", Gulika: "Gulika" },
    planetAbbr: { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke", Gulika: "Gu", Mandi: "Md" },
    dasaLords: { Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu" },
    dasaLevels: { mahadasa: "Mahadasa", antardasa: "Antardasa", antaram: "Antaram", sookshma: "Sookshma", prana: "Prana" },
    vargas: { D1: "D1 - Rasi", D2: "D2 - Hora", D3: "D3 - Drekkana", D7: "D7 - Saptamsa", D9: "D9 - Navamsa", D10: "D10 - Dasamsa", D12: "D12 - Dwadasamsa", D60: "D60 - Shashtiamsa" },
    yogas: {
      "Mangal Dosha": "Mangal Dosha",
      "Gaja Kesari Yoga": "Gaja Kesari Yoga",
      "Budhaditya Yoga": "Budhaditya Yoga",
      "Chandra-Mangal Yoga": "Chandra-Mangal Yoga",
      "Kemadruma Yoga (simplified)": "Kemadruma Yoga (simplified)",
      "Ruchaka Yoga": "Ruchaka Yoga", "Bhadra Yoga": "Bhadra Yoga", "Hamsa Yoga": "Hamsa Yoga",
      "Malavya Yoga": "Malavya Yoga", "Sasa Yoga": "Sasa Yoga",
      "Soorya Chandraadhi Yoga": "Soorya Chandraadhi Yoga", "Jeevanam Yoga": "Jeevanam Yoga",
    },
    taraCategories: { Janma: "Janma", Sampat: "Sampat", Vipat: "Vipat", Kshema: "Kshema", Pratyak: "Pratyak", Sadhaka: "Sadhaka", Vadha: "Vadha", Mitra: "Mitra", "Ati-Mitra": "Ati-Mitra" },
    ui: {
      title: "Namma Jothidam", tagline: "your personal jathakam, cast in a moment",
      name: "Name", gender: "Gender", male: "Male", female: "Female", other: "Other",
      dob: "Date of Birth", tob: "Time of Birth", pob: "Place of Birth", pobPlaceholder: "Start typing a city...",
      pobNoResults: "No matching places found", pobSelectPrompt: "Please select a place from the list",
      calculate: "Calculate Chart", savedCharts: "Saved Charts", loadChart: "Load", deleteChart: "Delete", deleteConfirm: "Delete this saved chart? This cannot be undone.", newChart: "New Chart",
      lagna: "Lagna", chartTab: "Chart", dasaTab: "Dasa", yogaTab: "Yogas", taraTab: "Tara Balam", detailsTab: "Graha Details",
      expand: "Expand", collapse: "Collapse", noYogas: "No yogas detected in this starter rule set.",
      colPlanet: "Planet", colRasi: "Rasi", colRasiLord: "Rasi Lord", colAbsDeg: "Absolute Degree",
      colDegInSign: "Degree in Sign", colStar: "Star", colPada: "Pada", colStarLord: "Star Lord",
      colPushkara: "Pushkara Navamsa",
      induLagna: "Indu Lagna", induLagnaHint: "Wealth ascendant — sign lord in parentheses",
      reading: "Reading", sources: "Sources", back: "Back",
      yogaFromMoon: "Not formed from Lagna, but present counting from the Moon.",
      sooryaChandraadhiCalc: "The Sun is in house {house} from the lagna, and rasi number {house} counting from Mesha is {target}. The Moon is in {moon}.",
      jeevanamCalc: "The Moon is in {moon}, rasi number {n} counting from Mesha. House {n} from the lagna is {target}, and it holds {planets}.",
      jeevanamEarning: "Earnings come through {planets}.", noneWord: "none",
      peyarchiTab: "Moorthy", colEnters: "Enters", colWhen: "Date and time", colMoonThen: "Moon then",
      colCount: "Count", colMoorthi: "Moorthi", peyarchiAll: "All planets", rahuKetu: "Rahu / Ketu",
      peyarchiRetro: "(retrograde, back)", peyarchiReentry: "(re-entry)", peyarchiNow: "Now",
      peyarchiCarried: "began before 2026 and still running then",
      drekkanaTab: "Drekkana Lords Aathipathyam", colDrekkana: "Drekkana", colController: "Controller", colControllerIn: "Controller in",
      colFromPlanet: "From planet", colResult: "Result", drekkanaOrdinal: ["1st", "2nd", "3rd"],
      drekkanaWeak: "\u26A0 {n}th from it, so it cannot perform well", drekkanaOk: "Fine", drekkanaOwn: "Its own controller",
      drekkanaNone: "No planet's controller is 6th or 8th from it.", drekkanaSummary: "Weakened by their controller",
      drekkanaPariharam: "Pariharam \u00B7 Vakkarakali Amman",
      sashtashtagamTab: "Navamsa Sashtashtagam", colD1Rasi: "D1 rasi", colD1House: "D1 house", colD9Rasi: "D9 rasi",
      colAathipathyam: "Rules in D1 (aathipathyam)", sashtashtagamWeak: "⚠ {n}th in D9", sashtashtagamOk: "Fine",
      sashtashtagamNone: "No planet is 6th or 8th in D9, which is a huge plus in the jathakam.",
      sashtashtagamSummary: "6th or 8th in D9, bringing issues related to the planet and its houses",
      sashtashtagamNoLordship: "rules no house, sits in house {house}",
      topHome: "Jathakam", topPariharam: "Pariharam", topPrasannam: "Prasannam", vargottamaWord: "vargottama",
      hiddenTab: "Hidden Ucham / Neecham", hiddenWhereTitle: "Where each planet hides them",
      hiddenTransitsTitle: "Rahu and Ketu over the hidden padas, 2026 to 2035",
      colSitsIn: "Sits in", colHides: "Hides its", colHiddenIn: "Hidden in", colBhavam: "Bhavam",
      colNode: "Rahu / Ketu", colTensionIn: "Tension in", colDates: "Dates", hiddenCellKey: "pada \u00B7 rasi \u00B7 bhavam",
      hiddenNext: "Next", hiddenSummaryLine: "{node} over {pada}, where {planet} hides its {kind}",
      tensionKaraka: "{planet}'s karakathvam ({karakas})", tensionBhavam: "the {house} bhavam ({meaning})",
      hiddenNoTransits: "Rahu and Ketu do not pass over any of these padas between 2026 and 2035.",
      hiddenNote: "Each planet hides its ucham, neecham and moolatrikonam in the pada found by counting from its Kaala Purusha pada to where it sits, and then the same number again. When transit Rahu or Ketu passes over one of these padas it brings tension in that planet's karakathvam and in the bhavam the pada falls in. The Reading page explains the method.",
      pushkaraQualityTitle: "Pushkara Navamsa padas that count",
      pushkaraQualityIntro: "Only the Pushkara padas in the 6th, 8th and 9th place of their rasi are counted and graded A, B or C. There are nine of them, and any that hold a planet in this chart are highlighted.",
      colPosition: "Position in rasi", colTara: "Tara", colQuality: "Quality", colPlanetsHere: "Planets here", colPushkaraPada: "Pushkara pada",
      pushkaraDasaWorks: "dasa works", pushkaraDasaFails: "dasa doesn't work",
      pushkaraDasaTag: "Pushkara {grade}, dasa works", pushkaraDasaTagFails: "Pushkara {grade}, dasa doesn't work",
      colGrade: "Grade", pushkaraLegend: "Pushkara Navamsa. A, B and C are the grade, for the 8th, 9th and 6th pada of the rasi, and Present means one of the other Pushkara padas, with no grade.",
      prasNow: "Now", prasUseLocation: "Use my location", prasChangePlace: "Change place",
      prasTime: "Time", prasPlace: "Place", prasMyLocation: "Your location ({lat}, {lon})",
      prasLocating: "Finding your location\u2026", prasCasting: "Casting the chart\u2026",
      prasDenied: "We couldn't get your location. Type the place you are in below.",
      prasPlaceholder: "Start typing a city...", prasError: "Could not cast the chart: ",
      chandraNadi: "Chandra Nadi", prasMoonRasi: "Rasi it is crossing", prasMoonStar: "Star",
      prasMoonPada: "Pada", prasMoonDegree: "Degree in the rasi", prasMoonAbs: "Absolute degree",
      prasMoonHint: "The Moon's position at the moment of the prasannam.",
      sashtashtagamTimingTitle: "When it shows",
      sashtashtagamTimingIntro: "For {planet}, the sensitive point is {star} pada {pada}, from {rasi} {from} to {to}. Issues are likely while {planet} is passing through it.",
      sashtashtagamUpcoming: "Coming up", sashtashtagamAllPeriods: "All {n} periods, 2026 to 2031", sashtashtagamNowTag: "now",
      sashtashtagamNoTransit: "{planet} does not reach this pada between 2026 and 2031.",
      sashtashtagamNoneLeft: "No more periods before the end of 2031.",
      sashtashtagamNextShort: "next in {star} pada {pada}, {when}",
      sashtashtagamNote: "Each planet's D9 rasi counted from its D1 rasi (the D1 rasi is the 1st). A planet 6th or 8th brings issues related to the planet and to the houses it rules in D1. Rahu and Ketu rule no house, so the house they sit in is shown.",
      houseMeanings: ["self, body, health", "wealth, family, speech", "courage, younger siblings, short travel", "mother, home, vehicles, education", "children, intelligence, poorva punya", "debts, disease, enemies", "spouse, partnerships", "longevity, obstacles, sudden events", "father, fortune, dharma", "career, status", "gains, elder siblings", "losses, expenses, foreign lands, moksha"],
      drekkanaNote: "Up to 10° the controller is the lord of the planet's own rasi. Over 10° and up to 20° it is the lord of the 5th rasi, and over 20° the lord of the 9th. If the controller sits 6th or 8th from the planet, the planet cannot perform well. Rahu and Ketu are checked too, but they never act as controllers.",
      peyarchiNote: "The Moorthi is counted from your janma rasi ({janma}) to the Moon's rasi at the moment of each peyarchi, from 2026 to 2031. Times are in the birth place's time zone. The dates follow the Thirukanitha method, so a Vakya panchangam may give slightly different dates.",
      dignityTab: "Ucham / Neecham", colState: "State", colDeep: "Deep point", colDistance: "From deep point",
      dignityUcham: "Ucham (exalted)", dignityNeecham: "Neecham (debilitated)",
      dignityParamoccham: "Paramoccham (the peak)", dignityParamaneecham: "Paramaneecham (the lowest point)",
      dignityNone: "No planet is in its exaltation or debilitation sign.",
      dignityNote: "This looks at the rasi chart only. Paramoccham and paramaneecham last a single degree that ends at the deep degree, so for the Sun it runs from just past 9\u00B0 to 10\u00B0. Rahu and Ketu peak at 3\u00B0, like the Moon. Neecha Bhanga, the cancellation of a debilitation, is not modeled.",
      pranapada: "Pranapada Lagna", houseWord: "house",
      pranapadaHint: "Moves about 5\u00B0 per minute of birth time, so it is very sensitive to the exact time and sunrise.",
      yogaPresent: "Present", yogaAbsent: "Not present", yogaSummary: "Present in this chart",
      tithiBox: "Tithi and Thithi Soonyam", tithi: "Tithi", soonyam: "Thithi Soonyam", soonyamNone: "None (no void rasis on Pournami or Amavasai)",
      soonyamHint: "Void rasis for the birth tithi. Planets in them, and their lords, are said to give weaker results.",
      soonyamLegend: "Thithi Soonyam rasi",
      upasana: "Upasana Deivam", upasanaPick: "Choose a rasi",
      upasanaCalc: "{planet} is in {from}, and the 11th rasi from there is {rasi}.",
      upasanaNoGender: "The calculation counts from Jupiter for a man or Venus for a woman. Choose a rasi below to look it up.",
      upasanaHint: "For a man, count 11 rasis from Jupiter, and for a woman count from Venus, taking its own rasi as the 1st. You can also choose any other rasi to look it up.",
      mudakku: "Mudakku Rasi", mudakkuTag: "Mudakku", starLordWord: "star lord", padaWord: "pada",
      mudakkuHint: "Count padas from the Sun's pada to the same pada of Moolam, then count the same number again from there. Planets in that rasi, the rasi lord and the star lord are said to be blocked.",
      mudakkuLagna: "The Mudakku rasi is the lagna, which is said to weaken the Mudakku effect.",
      kaalaPakai: "Kaala Pakai", colKaalaPakai: "Kaala Pakai", kaalaPakaiYes: "\u26A0 Yes",
      kaalaPakaiNone: "No planet is in Kaala Pakai.", kaalaPakaiPick: "Choose a planet", kaalaPakaiRasis: "Kaala Pakai rasi",
      kaalaPakaiHint: "A planet in its Kaala Pakai rasi in the rasi chart (D1) is said to be troubled. Ketu has none. Choose a planet to see its rasis.",
    },
    tithiNames: ["Prathamai", "Dwitiyai", "Tritiyai", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami", "Navami", "Dasami", "Ekadasi", "Dwadasi", "Trayodasi", "Chaturdasi"],
    paksha: { shukla: "Shukla", krishna: "Krishna" },
    pournami: "Pournami", amavasai: "Amavasai",
    quality: { good: "Good", bad: "Bad", neutral: "Neutral" },
    hiddenKind: { ucham: "Ucham", neecham: "Neecham", moolatrikonam: "Moolatrikonam" },
    karakathvam: {
      Sun: "father, father-in-law, first-born son, authority, government, health, soul",
      Moon: "mother, mind, emotions",
      Mars: "brothers, courage, land and property",
      Mercury: "intellect, speech, business, education",
      Jupiter: "children, wisdom, wealth, teachers",
      Venus: "spouse, comforts, vehicles, arts",
      Saturn: "longevity, work, discipline, delays",
      Rahu: "foreign things, ambition, the unconventional",
      Ketu: "spirituality, detachment, sudden losses",
    },
    moorthi: { Swarna: "Swarna (gold)", Rajatha: "Rajatha (silver)", Thamira: "Thamira (copper)", Loha: "Loha (iron)" },
    moorthiResult: { Swarna: "very favourable", Rajatha: "favourable", Thamira: "average", Loha: "unfavourable" },
  },
  ta: {
    rasi: ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"],
    nakshatra: ["அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை", "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்", "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை", "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்", "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"],
    planets: { Sun: "சூரியன்", Moon: "சந்திரன்", Mars: "செவ்வாய்", Mercury: "புதன்", Jupiter: "குரு", Venus: "சுக்ரன்", Saturn: "சனி", Rahu: "ராகு", Ketu: "கேது", Mandi: "மாந்தி", Gulika: "குளிகன்" },
    planetAbbr: { Sun: "சூ", Moon: "சந்", Mars: "செ", Mercury: "பு", Jupiter: "கு", Venus: "சு", Saturn: "ச", Rahu: "ரா", Ketu: "கே", Gulika: "குள்", Mandi: "மாந்" },
    dasaLords: { Sun: "சூரியன்", Moon: "சந்திரன்", Mars: "செவ்வாய்", Mercury: "புதன்", Jupiter: "குரு", Venus: "சுக்ரன்", Saturn: "சனி", Rahu: "ராகு", Ketu: "கேது" },
    dasaLevels: { mahadasa: "மகாதசை", antardasa: "அந்தரதசை", antaram: "அந்தரம்", sookshma: "சூட்சுமம்", prana: "பிராணம்" },
    vargas: { D1: "D1 - ராசி", D2: "D2 - ஹோரை", D3: "D3 - திரேக்காணம்", D7: "D7 - சப்தாம்சம்", D9: "D9 - நவாம்சம்", D10: "D10 - தசாம்சம்", D12: "D12 - துவாதசாம்சம்", D60: "D60 - சஷ்டியாம்சம்" },
    yogas: {
      "Mangal Dosha": "செவ்வாய் தோஷம்",
      "Gaja Kesari Yoga": "கஜகேசரி யோகம்",
      "Budhaditya Yoga": "புதாதித்ய யோகம்",
      "Chandra-Mangal Yoga": "சந்திர-செவ்வாய் யோகம்",
      "Kemadruma Yoga (simplified)": "கேமத்ரும யோகம் (எளிமைப்படுத்தியது)",
      "Ruchaka Yoga": "ருசக யோகம்", "Bhadra Yoga": "பத்ர யோகம்", "Hamsa Yoga": "ஹம்ச யோகம்",
      "Malavya Yoga": "மாளவ்ய யோகம்", "Sasa Yoga": "சச யோகம்",
      "Soorya Chandraadhi Yoga": "சூரிய சந்திராதி யோகம்", "Jeevanam Yoga": "ஜீவன யோகம்",
    },
    taraCategories: { Janma: "ஜென்மம்", Sampat: "சம்பத்", Vipat: "விபத்", Kshema: "க்ஷேமம்", Pratyak: "பிரத்யக்", Sadhaka: "சாதகம்", Vadha: "வதம்", Mitra: "மித்ரம்", "Ati-Mitra": "அதிமித்ரம்" },
    ui: {
      title: "நம்ம ஜோதிடம்", tagline: "உங்கள் ஜாதகம், ஒரு நொடியில்",
      name: "பெயர்", gender: "பாலினம்", male: "ஆண்", female: "பெண்", other: "மற்றவை",
      dob: "பிறந்த தேதி", tob: "பிறந்த நேரம்", pob: "பிறந்த இடம்", pobPlaceholder: "ஒரு நகரத்தை தட்டச்சு செய்யவும்...",
      pobNoResults: "பொருந்தும் இடங்கள் இல்லை", pobSelectPrompt: "பட்டியலில் இருந்து ஒரு இடத்தைத் தேர்ந்தெடுக்கவும்",
      calculate: "ஜாதகம் கணிக்க", savedCharts: "சேமித்த ஜாதகங்கள்", loadChart: "ஏற்று", deleteChart: "நீக்கு", deleteConfirm: "இந்த சேமித்த ஜாதகத்தை நீக்கவா? இதை மீட்க முடியாது.", newChart: "புதிய ஜாதகம்",
      lagna: "லக்னம்", chartTab: "ஜாதகம்", dasaTab: "தசை", yogaTab: "யோகங்கள்", taraTab: "தாரா பலம்", detailsTab: "கிரக விவரங்கள்",
      expand: "விரிவாக்கு", collapse: "சுருக்கு", noYogas: "இந்த ஆரம்ப விதிகளில் யோகங்கள் எதுவும் கண்டறியப்படவில்லை.",
      colPlanet: "கிரகம்", colRasi: "ராசி", colRasiLord: "ராசி அதிபதி", colAbsDeg: "முழு பாகை",
      colDegInSign: "ராசியில் பாகை", colStar: "நட்சத்திரம்", colPada: "பாதம்", colStarLord: "நட்சத்திர அதிபதி",
      colPushkara: "புஷ்கர நவாம்சம்",
      induLagna: "இந்து லக்னம்", induLagnaHint: "செல்வ லக்னம் — அடைப்புக்குறிக்குள் ராசி அதிபதி",
      reading: "வாசிப்பு", sources: "மூலங்கள்", back: "பின்செல்",
      yogaFromMoon: "லக்னத்திலிருந்து அமையவில்லை, ஆனால் சந்திரனிலிருந்து எண்ணும்போது உள்ளது.",
      sooryaChandraadhiCalc: "சூரியன் லக்னத்திலிருந்து {house}ஆம் வீட்டில் உள்ளது. மேஷத்திலிருந்து {house}ஆம் ராசி {target}. சந்திரன் {moon} ராசியில் உள்ளது.",
      jeevanamCalc: "சந்திரன் {moon} ராசியில் உள்ளது, இது மேஷத்திலிருந்து {n}ஆம் ராசி. லக்னத்திலிருந்து {n}ஆம் வீடு {target}, அங்கு உள்ள கிரகங்கள் {planets}.",
      jeevanamEarning: "சம்பாத்தியம் {planets} வழியாக வரும்.", noneWord: "இல்லை",
      peyarchiTab: "மூர்த்தி", colEnters: "நுழையும் ராசி", colWhen: "தேதி, நேரம்", colMoonThen: "அப்போது சந்திரன்",
      colCount: "எண்ணிக்கை", colMoorthi: "மூர்த்தி", peyarchiAll: "அனைத்து கிரகங்கள்", rahuKetu: "ராகு / கேது",
      peyarchiRetro: "(வக்கிரம், பின்னோக்கி)", peyarchiReentry: "(மீண்டும் நுழைவு)", peyarchiNow: "தற்போது",
      peyarchiCarried: "2026க்கு முன் தொடங்கி, அப்போதும் நடப்பில்",
      drekkanaTab: "திரேக்காண அதிபதிகள் ஆதிபத்யம்", colDrekkana: "திரேக்காணம்", colController: "அதிபதி", colControllerIn: "அதிபதி நிற்கும் ராசி",
      colFromPlanet: "கிரகத்திலிருந்து", colResult: "பலன்", drekkanaOrdinal: ["1ஆம்", "2ஆம்", "3ஆம்"],
      drekkanaWeak: "\u26A0 {n}ஆம் இடம், அதனால் சரியாகச் செயல்பட இயலாது", drekkanaOk: "சரி", drekkanaOwn: "தானே அதிபதி",
      drekkanaNone: "எந்த கிரகத்தின் அதிபதியும் அதற்கு 6 அல்லது 8ஆம் இடத்தில் இல்லை.", drekkanaSummary: "அதிபதியால் பலம் குறைந்தவை",
      drekkanaPariharam: "பரிகாரம் \u00B7 வக்கிரகாளி அம்மன்",
      sashtashtagamTab: "நவாம்ச சஷ்டாஷ்டகம்", colD1Rasi: "D1 ராசி", colD1House: "D1 வீடு", colD9Rasi: "D9 ராசி",
      colAathipathyam: "D1 ஆதிபத்யம்", sashtashtagamWeak: "⚠ D9இல் {n}ஆம் இடம்", sashtashtagamOk: "சரி",
      sashtashtagamNone: "எந்தக் கிரகமும் D9இல் 6 அல்லது 8ஆம் இடத்தில் இல்லை. இது ஜாதகத்திற்குப் பெரிய பலம்.",
      sashtashtagamSummary: "D9இல் 6 அல்லது 8ஆம் இடம், அந்தக் கிரகம், அதன் வீடுகள் தொடர்பான பிரச்சினைகள்",
      sashtashtagamNoLordship: "எந்த வீட்டிற்கும் அதிபதி இல்லை, {house}ஆம் வீட்டில் உள்ளது",
      topHome: "ஜாதகம்", topPariharam: "பரிகாரம்", topPrasannam: "பிரசன்னம்", vargottamaWord: "வர்கோத்தமம்",
      hiddenTab: "மறைந்த உச்சம் / நீசம்", hiddenWhereTitle: "ஒவ்வொரு கிரகமும் எங்கே மறைக்கிறது",
      hiddenTransitsTitle: "மறைந்த பாதங்களின் மீது ராகு, கேது, 2026 முதல் 2035 வரை",
      colSitsIn: "நிற்கும் பாதம்", colHides: "மறைக்கும் நிலை", colHiddenIn: "மறைந்திருக்கும் இடம்", colBhavam: "பாவம்",
      colNode: "ராகு / கேது", colTensionIn: "அழுத்தம்", colDates: "தேதிகள்", hiddenCellKey: "பாதம் \u00B7 ராசி \u00B7 பாவம்",
      hiddenNext: "அடுத்து", hiddenSummaryLine: "{node} {pada} மீது, இங்கே {planet} தன் {kind} நிலையை மறைக்கிறது",
      tensionKaraka: "{planet} காரகத்துவம் ({karakas})", tensionBhavam: "{house} பாவம் ({meaning})",
      hiddenNoTransits: "2026 முதல் 2035 வரை ராகுவோ கேதுவோ இந்தப் பாதங்களின் மீது கடப்பதில்லை.",
      hiddenNote: "ஒவ்வொரு கிரகமும், தன் கால புருஷ பாதத்திலிருந்து அது நிற்கும் பாதம் வரை எண்ணி, அதே எண்ணிக்கையை மீண்டும் எண்ணி வரும் பாதத்தில் தன் உச்சம், நீசம், மூலத்திரிகோணத்தை மறைத்து வைத்திருக்கிறது. கோசார ராகு அல்லது கேது அந்தப் பாதங்களில் ஒன்றின் மீது கடக்கும்போது, அந்தக் கிரகத்தின் காரகத்துவத்திலும், அந்தப் பாதம் விழும் பாவத்திலும் அழுத்தம் உண்டாகும். வாசிப்புப் பக்கம் இந்த முறையை விளக்குகிறது.",
      pushkaraQualityTitle: "கணக்கில் வரும் புஷ்கர பாதங்கள்",
      pushkaraQualityIntro: "தன் ராசியில் 6, 8, 9ஆம் இடங்களில் உள்ள புஷ்கர பாதங்கள் மட்டுமே கணக்கில் கொள்ளப்பட்டு A, B, C என்று தரம் பிரிக்கப்படுகின்றன. இப்படி ஒன்பது பாதங்கள் உள்ளன. இந்த ஜாதகத்தில் கிரகம் உள்ளவை குறிக்கப்பட்டுள்ளன.",
      colPosition: "ராசியில் இடம்", colTara: "தாரை", colQuality: "தரம்", colPlanetsHere: "இங்குள்ள கிரகங்கள்", colPushkaraPada: "புஷ்கர பாதம்",
      pushkaraDasaWorks: "தசை பலன் தரும்", pushkaraDasaFails: "தசை பலன் தராது",
      pushkaraDasaTag: "புஷ்கர {grade}, தசை பலன் தரும்", pushkaraDasaTagFails: "புஷ்கர {grade}, தசை பலன் தராது",
      colGrade: "தரம்", pushkaraLegend: "புஷ்கர நவாம்சம். A, B, C என்பவை ராசியின் 8, 9, 6ஆம் பாதங்களுக்கான தரம். உள்ளது என்றால் தரம் இல்லாத மற்ற புஷ்கர பாதம்.",
      prasNow: "இப்போது", prasUseLocation: "என் இருப்பிடம்", prasChangePlace: "இடத்தை மாற்று",
      prasTime: "நேரம்", prasPlace: "இடம்", prasMyLocation: "உங்கள் இருப்பிடம் ({lat}, {lon})",
      prasLocating: "உங்கள் இருப்பிடத்தைக் கண்டறிகிறது\u2026", prasCasting: "ஜாதகம் கணிக்கப்படுகிறது\u2026",
      prasDenied: "உங்கள் இருப்பிடம் கிடைக்கவில்லை. நீங்கள் இருக்கும் ஊரைக் கீழே தட்டச்சு செய்யவும்.",
      prasPlaceholder: "ஊரின் பெயரைத் தட்டச்சு செய்யவும்...", prasError: "ஜாதகம் கணிக்க இயலவில்லை: ",
      chandraNadi: "சந்திர நாடி", prasMoonRasi: "கடக்கும் ராசி", prasMoonStar: "நட்சத்திரம்",
      prasMoonPada: "பாதம்", prasMoonDegree: "ராசியில் பாகை", prasMoonAbs: "முழு பாகை",
      prasMoonHint: "பிரசன்னம் பார்க்கும் நேரத்தில் சந்திரனின் நிலை.",
      sashtashtagamTimingTitle: "எப்போது வெளிப்படும்",
      sashtashtagamTimingIntro: "{planet} கிரகத்திற்கு உணர்திறன் மிக்க இடம் {star} {pada}ஆம் பாதம், {rasi} {from} முதல் {to} வரை. {planet} இந்தப் பாதத்தைக் கடக்கும் காலத்தில் பிரச்சினைகள் வர வாய்ப்புள்ளது.",
      sashtashtagamUpcoming: "வரவிருப்பவை", sashtashtagamAllPeriods: "2026 முதல் 2031 வரை அனைத்து {n} காலங்கள்", sashtashtagamNowTag: "தற்போது",
      sashtashtagamNoTransit: "2026 முதல் 2031 வரை {planet} இந்தப் பாதத்திற்கு வருவதில்லை.",
      sashtashtagamNoneLeft: "2031 முடிவுக்குள் மேலும் காலங்கள் இல்லை.",
      sashtashtagamNextShort: "அடுத்து {star} {pada}ஆம் பாதத்தில், {when}",
      sashtashtagamNote: "ஒவ்வொரு கிரகத்தின் D9 ராசியும் அதன் D1 ராசியிலிருந்து (D1 ராசி = 1) எண்ணப்படுகிறது. 6 அல்லது 8ஆம் இடத்தில் இருந்தால், அந்தக் கிரகம் மற்றும் D1இல் அது அதிபதியாக உள்ள வீடுகள் தொடர்பான பிரச்சினைகள் வரும். ராகு, கேது எந்த வீட்டிற்கும் அதிபதி இல்லாததால், அவை நிற்கும் வீடு காட்டப்படுகிறது.",
      houseMeanings: ["சுயம், உடல், ஆரோக்கியம்", "செல்வம், குடும்பம், வாக்கு", "தைரியம், இளைய உடன்பிறப்புகள், குறுகிய பயணம்", "தாய், வீடு, வாகனம், கல்வி", "குழந்தைகள், புத்தி, பூர்வ புண்ணியம்", "கடன், நோய், எதிரிகள்", "வாழ்க்கைத் துணை, கூட்டாண்மை", "ஆயுள், தடைகள், திடீர் நிகழ்வுகள்", "தந்தை, பாக்கியம், தர்மம்", "தொழில், அந்தஸ்து", "லாபம், மூத்த உடன்பிறப்புகள்", "விரயம், செலவு, வெளிநாடு, மோட்சம்"],
      drekkanaNote: "10° வரை கிரகம் நின்ற ராசியின் அதிபதியே அதை இயக்குபவர். 10°க்கு மேல் 20° வரை 5ஆம் ராசியின் அதிபதி, 20°க்கு மேல் 9ஆம் ராசியின் அதிபதி. அந்த அதிபதி கிரகத்திலிருந்து 6 அல்லது 8ஆம் ராசியில் இருந்தால், அந்தக் கிரகம் சரியாகச் செயல்பட இயலாது. ராகு, கேதுவும் பார்க்கப்படுகின்றன, ஆனால் அவை ஒருபோதும் அதிபதி ஆகாது.",
      peyarchiNote: "ஒவ்வொரு பெயர்ச்சியின் போதும் சந்திரன் நின்ற ராசியை உங்கள் ஜென்ம ராசியிலிருந்து ({janma}) எண்ணி மூர்த்தி கணக்கிடப்படுகிறது, 2026 முதல் 2031 வரை. நேரங்கள் பிறந்த ஊரின் நேர மண்டலத்தில் உள்ளன. தேதிகள் திருக்கணித முறைப்படி அமைந்தவை, அதனால் வாக்கிய பஞ்சாங்கத் தேதிகள் சற்று மாறுபடலாம்.",
      dignityTab: "உச்சம் / நீசம்", colState: "நிலை", colDeep: "உச்ச பாகை", colDistance: "உச்ச பாகையிலிருந்து",
      dignityUcham: "உச்சம்", dignityNeecham: "நீசம்",
      dignityParamoccham: "பரமோச்சம் (உச்சத்தின் சிகரம்)", dignityParamaneecham: "பரம நீசம் (நீசத்தின் அடிமட்டம்)",
      dignityNone: "எந்த கிரகமும் உச்ச அல்லது நீச ராசியில் இல்லை.",
      dignityNote: "இது ராசி கட்டத்தை மட்டுமே பார்க்கிறது. பரமோச்சமும் பரம நீசமும் ஒரே ஒரு பாகை மட்டுமே நீடிக்கும், அது உச்ச பாகையில் முடிகிறது. சூரியனுக்கு இது 9\u00B0க்குச் சற்று மேலிருந்து 10\u00B0 வரை. ராகு, கேது சந்திரனைப் போல 3\u00B0இல் சிகரத்தை அடைகின்றன. நீச பங்கம் கணக்கிடப்படவில்லை.",
      pranapada: "பிராணபத லக்னம்", houseWord: "வீடு",
      pranapadaHint: "பிறந்த நேரத்தின் ஒவ்வொரு நிமிடத்திற்கும் சுமார் 5\u00B0 நகர்வதால், துல்லியமான நேரம் மற்றும் சூரிய உதயத்தைப் பொறுத்து மிகவும் மாறும்.",
      yogaPresent: "உள்ளது", yogaAbsent: "இல்லை", yogaSummary: "இந்த ஜாதகத்தில் உள்ளவை",
      tithiBox: "திதி மற்றும் திதி சூன்யம்", tithi: "திதி", soonyam: "திதி சூன்யம்", soonyamNone: "இல்லை (பௌர்ணமி, அமாவாசைக்கு சூன்ய ராசி இல்லை)",
      soonyamHint: "பிறந்த திதிக்கான சூன்ய ராசிகள். அவற்றில் உள்ள கிரகங்களும் அவற்றின் அதிபதிகளும் பலம் குறைந்த பலன்களைத் தருவதாகக் கூறப்படுகிறது.",
      soonyamLegend: "திதி சூன்ய ராசி",
      upasana: "உபாசனை தெய்வம்", upasanaPick: "ராசியைத் தேர்ந்தெடுக்கவும்",
      upasanaCalc: "{planet} {from} ராசியில் உள்ளது. அதிலிருந்து 11ஆம் ராசி {rasi}.",
      upasanaNoGender: "ஆணுக்கு குருவிலிருந்தும், பெண்ணுக்கு சுக்ரனிலிருந்தும் எண்ணப்படும். ராசியைத் தேர்ந்தெடுத்துப் பார்க்கவும்.",
      upasanaHint: "ஆணுக்கு குரு நின்ற ராசியிலிருந்தும், பெண்ணுக்கு சுக்ரன் நின்ற ராசியிலிருந்தும் (அதுவே 1) 11ஆம் ராசி. வேறு ராசியைத் தேர்ந்தெடுத்தும் பார்க்கலாம்.",
      mudakku: "முடக்கு ராசி", mudakkuTag: "முடக்கு", starLordWord: "நட்சத்திர அதிபதி", padaWord: "பாதம்",
      mudakkuHint: "சூரியன் நின்ற பாதத்திலிருந்து மூலத்தின் அதே பாதம் வரை பாதங்களை எண்ணி, அதே எண்ணிக்கையை அங்கிருந்து எண்ணவும். இங்குள்ள கிரகங்கள், ராசி அதிபதி, நட்சத்திர அதிபதி முடங்குவதாகக் கூறப்படுகிறது.",
      mudakkuLagna: "முடக்கு ராசி லக்னமாக இருப்பதால், முடக்கின் பலன் குறையும் என்று கூறப்படுகிறது.",
      kaalaPakai: "கால பகை", colKaalaPakai: "கால பகை", kaalaPakaiYes: "\u26A0 ஆம்",
      kaalaPakaiNone: "எந்த கிரகமும் கால பகையில் இல்லை.", kaalaPakaiPick: "கிரகத்தைத் தேர்ந்தெடுக்கவும்", kaalaPakaiRasis: "கால பகை ராசி",
      kaalaPakaiHint: "ராசி கட்டத்தில் (D1) தன் கால பகை ராசியில் உள்ள கிரகம் பாதிக்கப்படுவதாகக் கூறப்படுகிறது. கேதுவுக்குக் கால பகை இல்லை. ஒரு கிரகத்தைத் தேர்ந்தெடுத்து அதன் ராசிகளைப் பார்க்கலாம்.",
    },
    tithiNames: ["பிரதமை", "துவிதியை", "திருதியை", "சதுர்த்தி", "பஞ்சமி", "சஷ்டி", "சப்தமி", "அஷ்டமி", "நவமி", "தசமி", "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்த்தசி"],
    paksha: { shukla: "வளர்பிறை", krishna: "தேய்பிறை" },
    pournami: "பௌர்ணமி", amavasai: "அமாவாசை",
    quality: { good: "நல்லது", bad: "கெட்டது", neutral: "சமம்" },
    hiddenKind: { ucham: "உச்சம்", neecham: "நீசம்", moolatrikonam: "மூலத்திரிகோணம்" },
    karakathvam: {
      Sun: "தந்தை, மாமனார், மூத்த மகன், அதிகாரம், அரசு, ஆரோக்கியம், ஆன்மா",
      Moon: "தாய், மனம், உணர்ச்சிகள்",
      Mars: "சகோதரர்கள், தைரியம், நிலம், சொத்து",
      Mercury: "அறிவு, பேச்சு, வியாபாரம், கல்வி",
      Jupiter: "குழந்தைகள், ஞானம், செல்வம், குரு",
      Venus: "வாழ்க்கைத் துணை, சுகங்கள், வாகனம், கலைகள்",
      Saturn: "ஆயுள், தொழில், ஒழுக்கம், தாமதங்கள்",
      Rahu: "வெளிநாடு, லட்சியம், வழக்கத்திற்கு மாறானவை",
      Ketu: "ஆன்மீகம், பற்றின்மை, திடீர் இழப்புகள்",
    },
    moorthi: { Swarna: "சுவர்ண (தங்கம்)", Rajatha: "ரஜத (வெள்ளி)", Thamira: "தாமிர (செம்பு)", Loha: "லோஹ (இரும்பு)" },
    moorthiResult: { Swarna: "மிக நல்லது", Rajatha: "நல்லது", Thamira: "சுமார்", Loha: "சாதகமில்லை" },
  },
};

// Upasana Deivam for each rasi (0=Mesham..11=Meenam), as given by the user.
const UPASANA_DEIVAM = [
  { en: "Palani \u2013 Murugan", ta: "பழனி \u2013 முருகன்" },
  { en: "Rameshwaram \u2013 Parvathavarthini and Ramanatha Swamy", ta: "ராமேஸ்வரம் \u2013 பர்வதவர்த்தினி, ராமநாத சுவாமி" },
  { en: "Tirunelveli \u2013 Nellaiyappar and Gandhimathi Amman", ta: "திருநெல்வேலி \u2013 நெல்லையப்பர், காந்திமதி அம்மன்" },
  { en: "Nemili \u2013 Bala Thiripurasundari veedu", ta: "நெமிலி \u2013 பாலா திரிபுரசுந்தரி வீடு" },
  { en: "Thirumeeyachur \u2013 Sri Lalithambigai", ta: "திருமீயச்சூர் \u2013 ஸ்ரீ லலிதாம்பிகை" },
  { en: "Patteeswaram \u2013 Sri Durgai", ta: "பட்டீஸ்வரம் \u2013 ஸ்ரீ துர்கை" },
  { en: "Srirangam \u2013 Kattazhagiya Singar", ta: "ஸ்ரீரங்கம் \u2013 காட்டழகிய சிங்கர்" },
  { en: "Keel Tirupathi \u2013 Sri Padmavathy Thayaar", ta: "கீழ் திருப்பதி \u2013 ஸ்ரீ பத்மாவதி தாயார்" },
  { en: "Thanjavur \u2013 Sri Varahi Amman", ta: "தஞ்சாவூர் \u2013 ஸ்ரீ வாராஹி அம்மன்" },
  { en: "Thethupatti \u2013 Sri Rajakaliamman Temple", ta: "தேத்துப்பட்டி \u2013 ஸ்ரீ ராஜகாளியம்மன் கோவில்" },
  { en: "Courtallam \u2013 Sri Kutralanathar", ta: "குற்றாலம் \u2013 ஸ்ரீ குற்றாலநாதர்" },
  { en: "Sri Meenakshi Amman", ta: "ஸ்ரீ மீனாட்சி அம்மன்" },
];

// Kaala Pakai rasis (0=Mesham..11=Meenam) and their effects, as given by the user from a
// video. Must match KAALA_PAKAI_RASIS in app/constants.py. Ketu has none.
const KAALA_PAKAI = {
  Moon: {
    rasis: [0, 1],
    effect: { en: "Creates deep mental restlessness, fluctuating emotional security, and unexpected anxiety.", ta: "மனதில் ஆழ்ந்த அமைதியின்மை, உணர்ச்சிப் பாதுகாப்பில் ஏற்ற இறக்கம், எதிர்பாராத பதற்றம் உண்டாகும்." },
  },
  Rahu: {
    rasis: [2],
    effect: { en: "Amplifies dual thinking, leading to illusions, over-analysis, or potential deception by close peers.", ta: "இரட்டை எண்ணங்களை அதிகரித்து, மாயை, அளவுக்கு மீறிய ஆராய்ச்சி அல்லது நெருங்கியவர்களால் ஏமாற்றத்திற்கு வழிவகுக்கும்." },
  },
  Sun: {
    rasis: [3],
    effect: { en: "Weakens physical vitality/immunity and creates emotional friction with father figures or authority.", ta: "உடல் வலிமையையும் நோய் எதிர்ப்பு சக்தியையும் குறைத்து, தந்தை அல்லது அதிகாரத்தில் உள்ளவர்களுடன் மனக்கசப்பை உண்டாக்கும்." },
  },
  Mars: {
    rasis: [5],
    effect: { en: "Misdirects the warrior energy of Mars into hyper-criticism, internal anxiety, and digestive or nervous system friction.", ta: "செவ்வாயின் போர்க்குணத்தை அளவுக்கு மீறிய விமர்சனம், உள் பதற்றம், செரிமானம் அல்லது நரம்பு மண்டலக் கோளாறுகளாகத் திசை திருப்பும்." },
  },
  Jupiter: {
    rasis: [6, 7],
    effect: { en: "Clouds wisdom and judgment, often causing unexpected financial missteps or challenges in marital/business alliances.", ta: "ஞானத்தையும் முடிவெடுக்கும் திறனையும் மங்கச் செய்து, எதிர்பாராத பணத் தவறுகள் அல்லது திருமண / தொழில் கூட்டுகளில் சவால்களை ஏற்படுத்தும்." },
  },
  Mercury: {
    rasis: [8],
    effect: { en: "Scatters logical intelligence (Buddhi), leading to communication breakdowns or poorly timed business decisions.", ta: "தர்க்க அறிவை (புத்தி) சிதறடித்து, தொடர்பு முறிவுகள் அல்லது தவறான நேரத்தில் எடுக்கும் தொழில் முடிவுகளுக்கு வழிவகுக்கும்." },
  },
  Venus: {
    rasis: [9, 10],
    effect: { en: "Challenges relationship stability and material comforts, introducing chronic delays or emotional coldness in partnerships.", ta: "உறவுகளின் நிலைத்தன்மையையும் பொருள் சுகங்களையும் சோதித்து, தொடர்ந்த தாமதங்கள் அல்லது உறவுகளில் உணர்ச்சிக் குளிர்ச்சியை உண்டாக்கும்." },
  },
  Saturn: {
    rasis: [11],
    effect: { en: "Disrupts discipline and focus, introducing hidden spiritual dilemmas, boundary issues, or sudden isolation.", ta: "ஒழுக்கத்தையும் கவனத்தையும் குலைத்து, மறைந்த ஆன்மீகக் குழப்பங்கள், எல்லைப் பிரச்சினைகள் அல்லது திடீர் தனிமையை உண்டாக்கும்." },
  },
};

// Pariharams shown on the Pariharam page, in order; as given by the user.
const PARIHARAMS = [
  {
    title: { en: "Richness and Selvam", ta: "செல்வமும் வளமும்" },
    intro: {
      en: "To attain richness and selvam in life, recite these 7 names from the Lalitha Sahasranamam, as given by Maha Periyavar.",
      ta: "வாழ்வில் செல்வமும் வளமும் பெற, மஹா பெரியவர் அருளிய லலிதா சஹஸ்ரநாமத்தின் இந்த 7 நாமங்களை ஜபிக்கவும்.",
    },
    names: [
      { en: "Om Sri Matre Namaha", ta: "ஓம் ஸ்ரீ மாத்ரே நமஹ" },
      { en: "Om Sri Vasudhayai Namaha", ta: "ஓம் ஸ்ரீ வஸுதாயை நமஹ" },
      { en: "Om Sri Ashta Lakshmi Namaha", ta: "ஓம் ஸ்ரீ அஷ்ட லக்ஷ்மி நமஹ" },
      { en: "Om Sri Sachamara Rama Vani Savya Dakshina Sevitayai Namaha", ta: "ஓம் ஸ்ரீ ஸசாமர ரமாவாணி ஸவ்ய தக்ஷிண ஸேவிதாயை நமஹ" },
      { en: "Om Sri Kataksha Kimkari Bhuta Kamala Koti Sevitayai Namaha", ta: "ஓம் ஸ்ரீ கடாக்ஷ கிங்கரீ பூத கமலா கோடி ஸேவிதாயை நமஹ" },
      { en: "Om Sri Shiva Shaktyaikya Rupinyai Namaha", ta: "ஓம் ஸ்ரீ சிவ சக்த்யைக்ய ரூபிண்யை நமஹ" },
      { en: "Om Sri Lalithambikayai Namaha", ta: "ஓம் ஸ்ரீ லலிதாம்பிகாயை நமஹ" },
    ],
  },
];

// The 24 Pushkara Navamsa padas as [nakshatra index (Ashwini = 0), pada], two per rasi from
// Mesham. Must match is_pushkara_navamsa in app/astrology.py (tests/test_astrology.py checks it).
const PUSHKARA_PADAS = [
  [1, 3], [2, 1], [2, 4], [3, 2], [5, 4], [6, 2], [6, 4], [7, 2], [10, 3], [11, 1], [11, 4], [12, 2],
  [14, 4], [15, 2], [15, 4], [16, 2], [19, 3], [20, 1], [20, 4], [21, 2], [23, 4], [24, 2], [24, 4], [25, 2],
];
const STAR_LORD_CYCLE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
// A pada is one navamsa: pada number n (0..107) lies in rasi n / 9 and its navamsa is rasi n % 12.
const padaIndex = ([nak, pada]) => nak * 4 + pada - 1;
const isVargottamaPada = (p) => Math.floor(padaIndex(p) / 9) === padaIndex(p) % 12;
const bothLangs = (fn) => ({ en: fn("en"), ta: fn("ta") });
// A Pushkara pada's quality: its position among the 9 padas of its rasi (1..9), read as a tara.
// Must match TARA_CATEGORIES and TARA_QUALITY in app/constants.py.
const TARA_ORDER = ["Janma", "Sampat", "Vipat", "Kshema", "Pratyak", "Sadhaka", "Vadha", "Mitra", "Ati-Mitra"];
const TARA_QUALITY = {
  Janma: "neutral", Sampat: "good", Vipat: "bad", Kshema: "good", Pratyak: "bad",
  Sadhaka: "good", Vadha: "bad", Mitra: "good", "Ati-Mitra": "good",
};
const padaPositionInRasi = (p) => (padaIndex(p) % 9) + 1;
const pushkaraTara = (p) => TARA_ORDER[padaPositionInRasi(p) - 1];
// Only the Pushkara padas in the 6th, 8th and 9th place of their rasi (good taras) are counted.
const COUNTED_PUSHKARA_POSITIONS = [6, 8, 9];
const isPushkaraPada = ([nak, pada]) => PUSHKARA_PADAS.some(([n, p]) => n === nak && p === pada);
// A pada counts only if it is one of the 24 Pushkara padas AND sits 6th, 8th or 9th in its rasi.
const isCountedPushkara = (p) => isPushkaraPada(p) && COUNTED_PUSHKARA_POSITIONS.includes(padaPositionInRasi(p));
const COUNTED_PUSHKARA_PADAS = PUSHKARA_PADAS.filter(isCountedPushkara);
// The user's grades by place in the rasi. The other 15 Pushkara padas are shown as "Present".
const PUSHKARA_GRADE_BY_POSITION = { 8: "A", 9: "B", 6: "C" };
const pushkaraGrade = (p) => (isPushkaraPada(p) ? PUSHKARA_GRADE_BY_POSITION[padaPositionInRasi(p)] || "Present" : null);
const PRESENT_WORD = { en: "Present", ta: "உள்ளது" };
// A planet in an A, B or C pada gives the Pushkara benefit in its own Mahadasa when, counting in the
// Udu Maha Dasai (Vimshottari) order from the planet (as 1) to the pada's star lord, the lord comes
// 2nd, 6th, 8th or 9th. The star lord itself (1st) does not.
const PUSHKARA_DASA_COUNTS = [2, 6, 8, 9];
const pushkaraDasaCount = (planet, p) => ((p[0] % 9) - STAR_LORD_CYCLE.indexOf(planet) + 9) % 9 + 1;
const pushkaraDasaWorks = (planet, p) => PUSHKARA_DASA_COUNTS.includes(pushkaraDasaCount(planet, p));
const DASA_PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const pushkaraDasaPlanets = (lordIndex) =>
  DASA_PLANETS.filter((planet) => PUSHKARA_DASA_COUNTS.includes(((lordIndex - STAR_LORD_CYCLE.indexOf(planet) + 9) % 9) + 1));
const gradeText = (lang, grade) => (grade === "Present" ? PRESENT_WORD[lang] : grade);
const ORDINAL = { en: (n) => n + ({ 1: "st", 2: "nd", 3: "rd" }[n] || "th"), ta: (n) => `${n}ஆம்` };
const VARGOTTAMA_WORD = { en: "vargottama", ta: "வர்கோத்தமம்" };
const pushkaraPadaText = (lang, p) =>
  (isCountedPushkara(p) ? `${pushkaraGrade(p)} \u00B7 ` : "") +
  `${LABELS[lang].nakshatra[p[0]]} ${p[1]} \u00B7 ${LABELS[lang].planets[STAR_LORD_CYCLE[p[0] % 9]]}` +
  (isVargottamaPada(p) ? ` (${VARGOTTAMA_WORD[lang]})` : "");

// Exaltation rasi and deep degree per planet (BPHS 3.49-50), mirroring DIGNITY in app/constants.py.
// Neecham is the 7th rasi at the same degree. Rahu and Ketu take the Moon's 3 degrees, as given by the user.
const DIGNITY_TABLE = {
  Sun: [0, 10], Moon: [1, 3], Mars: [9, 28], Mercury: [5, 15], Jupiter: [3, 5], Venus: [11, 27], Saturn: [6, 20],
  Rahu: [1, 3], Ketu: [7, 3],
};
// The pada holding a deep point, taken just below the degree, since the one-degree span ends there.
const deepPointPada = (rasi, degree) => {
  const lon = rasi * 30 + degree - 1e-6;
  return [Math.floor(lon / (360 / 27)), Math.floor((lon % (360 / 27)) / (360 / 108)) + 1];
};
const deepPointText = (lang, rasi, degree) => {
  const [nak, pada] = deepPointPada(rasi, degree);
  return `${LABELS[lang].rasi[rasi]} ${degree}\u00B0 \u00B7 ${LABELS[lang].nakshatra[nak]} ${pada}`;
};

// First pada of each planet's moolatrikonam (BPHS ranges), mirroring app/hidden_dignity.py.
// Rahu and Ketu have none here.
const MOOLATRIKONA_FIRST_PADA = {
  Sun: [9, 1], Moon: [2, 2], Mars: [0, 1], Mercury: [12, 2], Jupiter: [18, 1], Venus: [13, 3], Saturn: [22, 3],
};
const padaName = (lang, [nak, pada]) => `${LABELS[lang].nakshatra[nak]} ${pada}`;

const READING_TOPICS = {
  pushkaraNavamsa: {
    title: { en: "Pushkara Navamsa", ta: "புஷ்கர நவாம்சம்" },
    intro: {
      en: "Pushkara means sacred or nourishing. Of the 108 navamsas, or nakshatra padas, 24 are known as Pushkara Navamsas, two in every rasi. They don't all help equally, though. What decides a pada's strength is where it sits among the nine padas of its rasi, and only the padas in the 6th, 8th and 9th places are counted here. A planet sitting in one of those in the D1 chart is said to give good results in its dasa and bhukti, even when it is otherwise weak. All 24 are listed below with their star lords, and the ones that count carry their grade, A, B or C.",
      ta: "புஷ்கரம் என்றால் புனிதமானது, ஊட்டமளிப்பது என்று பொருள். 108 நவாம்சங்களில், அதாவது நட்சத்திரப் பாதங்களில், 24 புஷ்கர நவாம்சங்கள் என்று அழைக்கப்படுகின்றன. ஒவ்வொரு ராசியிலும் இரண்டு உள்ளன. ஆனால் இவை எல்லாமே ஒரே அளவில் உதவுவதில்லை. ஒரு பாதம் தன் ராசியின் ஒன்பது பாதங்களில் எந்த இடத்தில் உள்ளது என்பதே அதன் பலத்தைத் தீர்மானிக்கிறது. இங்கு 6, 8, 9ஆம் இடங்களில் உள்ள பாதங்கள் மட்டுமே கணக்கில் கொள்ளப்படுகின்றன. D1 கட்டத்தில் அப்படிப்பட்ட பாதத்தில் உள்ள கிரகம், வேறு வகையில் பலம் குறைந்திருந்தாலும், தன் தசை, புக்தியில் நல்ல பலன்களைத் தரும் என்று கூறப்படுகிறது. 24 பாதங்களும் அவற்றின் நட்சத்திர அதிபதிகளுடன் கீழே உள்ளன. கணக்கில் கொள்ளப்படுபவை A, B, C என்ற தரத்துடன் குறிக்கப்பட்டுள்ளன.",
    },
    tableHeader: [
      { en: "Rasi", ta: "ராசி" }, { en: "First Pushkara pada", ta: "முதல் புஷ்கர பாதம்" }, { en: "Second Pushkara pada", ta: "இரண்டாம் புஷ்கர பாதம்" },
    ],
    table: LABELS.en.rasi.map((_, r) => [
      bothLangs((lang) => `${LABELS[lang].rasi[r]} (${LABELS[lang].planets[["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"][r]]})`),
      bothLangs((lang) => pushkaraPadaText(lang, PUSHKARA_PADAS[2 * r])),
      bothLangs((lang) => pushkaraPadaText(lang, PUSHKARA_PADAS[2 * r + 1])),
    ]),
    sections: [
      {
        heading: { en: "Which padas count", ta: "எந்தப் பாதங்கள் கணக்கில் வரும்" },
        text: {
          en: "To judge a Pushkara pada, count where it sits among the nine padas of its rasi and read that number the way Tara Balam does. The 6th is Sadhaka, the 8th is Mitra and the 9th is Ati-Mitra, and these three are good. The 1st is Janma, which is neutral, while the 3rd, 5th and 7th are Vipat, Pratyak and Vadha, which are bad. Bharani 3, for example, is the 7th pada of Mesham. That makes it Vadha, so it isn't counted, and the same goes for all three of Venus's padas. Only the padas in the 6th, 8th and 9th places are taken into account, which leaves nine of the 24. The 8th place is graded A, the 9th B and the 6th C. A planet in any of the other fifteen Pushkara padas is still shown as Present, just without a grade.",
          ta: "ஒரு புஷ்கர பாதத்தை மதிப்பிட, அது தன் ராசியின் ஒன்பது பாதங்களில் எத்தனையாவது என்று எண்ணி, அந்த எண்ணைத் தாரா பலம் போலப் படிக்கவும். 6ஆம் இடம் சாதகம், 8ஆம் இடம் மித்ரம், 9ஆம் இடம் அதிமித்ரம். இந்த மூன்றும் நல்லவை. 1ஆம் இடம் ஜென்மம், இது சமமானது. 3, 5, 7ஆம் இடங்கள் விபத், பிரத்யக், வதம். இவை கெட்டவை. உதாரணமாக பரணி 3 மேஷத்தின் 7ஆம் பாதம். அது வதம் என்பதால் கணக்கில் கொள்ளப்படுவதில்லை. சுக்ரனின் மூன்று பாதங்களுக்கும் இதே நிலைதான். 6, 8, 9ஆம் இடங்களில் உள்ள பாதங்கள் மட்டுமே கணக்கில் கொள்ளப்படுகின்றன. அப்படிப் பார்த்தால் 24இல் ஒன்பது மட்டுமே மிஞ்சுகின்றன. 8ஆம் இடம் A தரம், 9ஆம் இடம் B தரம், 6ஆம் இடம் C தரம். மற்ற பதினைந்து புஷ்கர பாதங்களில் உள்ள கிரகம் தரம் இல்லாமல் உள்ளது என்று மட்டும் காட்டப்படும்.",
        },
      },
      {
        heading: { en: "Placement and strength", ta: "அமைவும் பலமும்" },
        text: {
          en: "The nine padas that count are all in fire and air signs. Each fire sign gives its 9th pada and each air sign gives its 6th and 8th. All of them belong to stars of the Sun, Rahu or Jupiter, and in the navamsa chart they land in Dhanus, Meenam or Rishabam. Uttara Ashadha 1 is also vargottama, sitting in Dhanus in both the rasi and navamsa charts, which makes it the strongest of them all. The earth and water signs have no padas that count, so Rohini 2 and Punarvasu 4 miss out even though they are vargottama. Punarvasu 2, Swati 4 and Vishakha 2 land 12th, 6th and 8th from their own rasi in the navamsa. As the paper points out, that can bring some difficulties along with name and fame. In the end the planet's own nature, the house it sits in and the planets alongside it decide how things turn out.",
          ta: "கணக்கில் கொள்ளப்படும் ஒன்பது பாதங்களும் அக்னி, வாயு ராசிகளில் மட்டுமே உள்ளன. ஒவ்வொரு அக்னி ராசியும் தன் 9ஆம் பாதத்தைத் தருகிறது. ஒவ்வொரு வாயு ராசியும் 6, 8ஆம் பாதங்களைத் தருகிறது. இவை அனைத்தும் சூரியன், ராகு அல்லது குருவின் நட்சத்திரங்களைச் சேர்ந்தவை. நவாம்சக் கட்டத்தில் இவை தனுசு, மீனம் அல்லது ரிஷபத்தில் விழுகின்றன. உத்திராடம் 1 வர்கோத்தமமும் கூட. ராசி, நவாம்சம் இரண்டிலும் தனுசுவில் இருப்பதால் இதுவே எல்லாவற்றிலும் வலிமையானது. பூமி, நீர் ராசிகளில் கணக்கில் வரும் பாதம் இல்லை. அதனால் ரோகிணி 2, புனர்பூசம் 4 வர்கோத்தமமாக இருந்தாலும் கணக்கில் வருவதில்லை. புனர்பூசம் 2, சுவாதி 4, விசாகம் 2 ஆகியவை நவாம்சத்தில் தம் ராசிக்கு 12, 6, 8ஆம் இடங்களில் விழுகின்றன. கட்டுரை சொல்வது போல, அப்படி அமைந்தால் புகழுடன் சில சிரமங்களும் வரலாம். கிரகத்தின் இயல்பு, அது இருக்கும் வீடு, உடன் இருக்கும் கிரகங்கள் ஆகியவையே இறுதிப் பலனைத் தீர்மானிக்கின்றன.",
        },
        tableHeader: [
          { en: "Rasi", ta: "ராசி" }, { en: "Pushkara pada", ta: "புஷ்கர பாதம்" }, { en: "Star lord", ta: "நட்சத்திர அதிபதி" }, { en: "Place in the rasi", ta: "ராசியில் இடம்" }, { en: "Grade", ta: "தரம்" },
        ],
        table: COUNTED_PUSHKARA_PADAS.map((p) => [
          bothLangs((lang) => LABELS[lang].rasi[Math.floor(padaIndex(p) / 9)]),
          bothLangs((lang) => `${LABELS[lang].nakshatra[p[0]]} ${p[1]}` + (isVargottamaPada(p) ? ` (${VARGOTTAMA_WORD[lang]})` : "")),
          bothLangs((lang) => LABELS[lang].planets[STAR_LORD_CYCLE[p[0] % 9]]),
          bothLangs((lang) => ORDINAL[lang](padaPositionInRasi(p))),
          bothLangs(() => pushkaraGrade(p)),
        ]),
      },
      {
        heading: { en: "When the dasa gives the benefit", ta: "தசை எப்போது பலன் தரும்" },
        text: {
          en: "A planet in an A, B or C pada gives its Pushkara benefit during its own Mahadasa only when it gets along with the pada's star lord. To check, count in the Udu Maha Dasai order, Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn and Mercury, starting from the planet as 1 and going to the star lord. If the star lord comes 2nd, 6th, 8th or 9th, the dasa works. Say Saturn sits in Punarvasu 2, whose star lord is Jupiter. Counting from Saturn, Jupiter comes 9th, so Saturn's dasa works. If the planet is the star lord itself the count is 1, and the dasa doesn't work. The table shows, for each star lord, which planets' dasas work.",
          ta: "A, B அல்லது C பாதத்தில் உள்ள கிரகம், அந்தப் பாதத்தின் நட்சத்திர அதிபதியுடன் இணக்கமாக இருந்தால் மட்டுமே தன் மகா தசையில் புஷ்கர பலனைத் தரும். இதைப் பார்க்க, உடு மகா தசை வரிசையில், அதாவது கேது, சுக்ரன், சூரியன், சந்திரன், செவ்வாய், ராகு, குரு, சனி, புதன் என்ற வரிசையில், அந்தக் கிரகத்தை 1 என்று எடுத்து நட்சத்திர அதிபதி வரை எண்ணவும். நட்சத்திர அதிபதி 2, 6, 8 அல்லது 9ஆவதாக வந்தால் தசை பலன் தரும். உதாரணமாக புனர்பூசம் 2இல் சனி இருக்கிறது என்று வைத்துக்கொள்வோம். அதன் நட்சத்திர அதிபதி குரு. சனியிலிருந்து எண்ணினால் குரு 9ஆவதாக வருகிறது, எனவே சனி தசை பலன் தரும். கிரகமே நட்சத்திர அதிபதியாக இருந்தால் எண்ணிக்கை 1, அப்போது தசை பலன் தராது. ஒவ்வொரு நட்சத்திர அதிபதிக்கும் எந்தக் கிரகங்களின் தசை பலன் தரும் என்பதை அட்டவணை காட்டுகிறது.",
        },
        tableHeader: [
          { en: "Grade", ta: "தரம்" }, { en: "Padas", ta: "பாதங்கள்" }, { en: "Star lord", ta: "நட்சத்திர அதிபதி" }, { en: "Planets whose dasa works", ta: "தசை பலன் தரும் கிரகங்கள்" },
        ],
        table: ["A", "B", "C"].map((grade) => {
          const padas = COUNTED_PUSHKARA_PADAS.filter((p) => pushkaraGrade(p) === grade);
          const lordIndex = padas[0][0] % 9;
          return [
            bothLangs(() => grade),
            bothLangs((lang) => padas.map(([n, p]) => `${LABELS[lang].nakshatra[n]} ${p}`).join(", ")),
            bothLangs((lang) => LABELS[lang].planets[STAR_LORD_CYCLE[lordIndex]]),
            bothLangs((lang) =>
              pushkaraDasaPlanets(lordIndex)
                .map((planet) => `${LABELS[lang].planets[planet]} (${ORDINAL[lang](((lordIndex - STAR_LORD_CYCLE.indexOf(planet) + 9) % 9) + 1)})`)
                .join(", ")
            ),
          ];
        }),
      },
      {
        heading: { en: "Why Mars, Mercury and Ketu have none", ta: "செவ்வாய், புதன், கேதுவுக்கு ஏன் இல்லை" },
        text: {
          en: "Across all 24 padas, the stars of the Sun and Jupiter hold six each. Venus, Saturn, the Moon and Rahu hold three each, and the stars of Mars, Mercury and Ketu hold none at all. It comes down to where their stars fall. Ketu's stars, Ashwini, Magha and Mula, fill the first 13\u00B020\u2032 of the fire signs, which is navamsas 1 to 4, while a fire sign's Pushkara navamsas are the 7th and 9th. Mercury's stars, Ashlesha, Jyeshtha and Revati, fill the last 13\u00B020\u2032 of the water signs, navamsas 6 to 9, but a water sign's Pushkara navamsas are the 1st and 3rd. Mars's stars, Mrigashira, Chitra and Dhanishta, sit across the end of an earth sign and the start of the air sign after it. That puts them in the 8th and 9th navamsas of the earth sign and the 1st and 2nd of the air sign, and none of those are Pushkara places.",
          ta: "24 பாதங்களையும் பார்த்தால், சூரியன், குருவின் நட்சத்திரங்களில் தலா ஆறு உள்ளன. சுக்ரன், சனி, சந்திரன், ராகுவின் நட்சத்திரங்களில் தலா மூன்று உள்ளன. செவ்வாய், புதன், கேதுவின் நட்சத்திரங்களில் ஒன்றுகூட இல்லை. இதற்குக் காரணம் அவற்றின் நட்சத்திரங்கள் அமையும் இடம். கேதுவின் நட்சத்திரங்களான அஸ்வினி, மகம், மூலம் அக்னி ராசிகளின் முதல் 13\u00B020\u2032 பகுதியில், அதாவது 1 முதல் 4 நவாம்சங்களில் உள்ளன. ஆனால் அக்னி ராசிகளின் புஷ்கர நவாம்சங்கள் 7, 9ஆம் இடங்கள். புதனின் நட்சத்திரங்களான ஆயில்யம், கேட்டை, ரேவதி நீர் ராசிகளின் கடைசி 13\u00B020\u2032 பகுதியில், 6 முதல் 9 நவாம்சங்களில் உள்ளன. நீர் ராசிகளின் புஷ்கர நவாம்சங்களோ 1, 3ஆம் இடங்கள். செவ்வாயின் நட்சத்திரங்களான மிருகசீரிடம், சித்திரை, அவிட்டம் ஒரு பூமி ராசியின் இறுதியிலும் அடுத்த வாயு ராசியின் தொடக்கத்திலும் பரவியுள்ளன. அதனால் அவை பூமி ராசியின் 8, 9ஆம் நவாம்சங்களிலும் வாயு ராசியின் 1, 2ஆம் நவாம்சங்களிலும் விழுகின்றன. இவற்றில் எதுவும் புஷ்கர இடம் அல்ல.",
        },
        tableHeader: [
          { en: "Star lord", ta: "நட்சத்திர அதிபதி" }, { en: "Its stars", ta: "அதன் நட்சத்திரங்கள்" }, { en: "Pushkara padas", ta: "புஷ்கர பாதங்கள்" }, { en: "How many", ta: "எண்ணிக்கை" },
        ],
        table: ["Sun", "Jupiter", "Venus", "Saturn", "Moon", "Rahu", "Mars", "Mercury", "Ketu"].map((lord) => {
          const stars = [0, 1, 2].map((k) => STAR_LORD_CYCLE.indexOf(lord) + 9 * k);
          const padas = PUSHKARA_PADAS.filter(([nak]) => stars.includes(nak));
          return [
            bothLangs((lang) => LABELS[lang].planets[lord]),
            bothLangs((lang) => stars.map((n) => LABELS[lang].nakshatra[n]).join(", ")),
            bothLangs((lang) => (padas.length ? padas.map(([n, p]) => `${LABELS[lang].nakshatra[n]} ${p}`).join(", ") : LABELS[lang].ui.noneWord)),
            bothLangs(() => String(padas.length)),
          ];
        }),
      },
    ],
    note: {
      en: "The paper's table prints Uttara Phalguni 3 for Kanni and Uttara Bhadrapada 3 for Meenam, and names Venus as the lord of Uttara Ashadha 4. Going by the paper's own rule, where earth signs take the 3rd and 5th navamsa and water signs the 1st and 3rd, these should be Uttara Phalguni 4 and Uttara Bhadrapada 2. Uttara Ashadha is also the Sun's star, which the paper's own count of six Sun padas needs. The app uses the corrected padas. There is a finer single-degree Pushkara Bhaga as well, but sources disagree on its degrees, so the app doesn't use it.",
      ta: "கட்டுரையின் அட்டவணையில் கன்னிக்கு உத்திரம் 3, மீனத்திற்கு உத்திரட்டாதி 3 என்று அச்சாகியுள்ளது. உத்திராடம் 4இன் அதிபதியாகச் சுக்ரன் குறிப்பிடப்பட்டுள்ளார். கட்டுரையின் சொந்த விதிப்படி பூமி ராசிகளுக்கு 3, 5ஆம் நவாம்சங்களும் நீர் ராசிகளுக்கு 1, 3ஆம் நவாம்சங்களும் புஷ்கரம். அப்படியானால் இவை உத்திரம் 4, உத்திரட்டாதி 2 ஆக இருக்க வேண்டும். உத்திராடம் சூரியனின் நட்சத்திரம். சூரியனுக்கு ஆறு பாதங்கள் என்ற கட்டுரையின் கணக்கும் அதையே காட்டுகிறது. செயலி திருத்திய பாதங்களையே பயன்படுத்துகிறது. ஒரு பாகை அளவிலான புஷ்கர பாகமும் உண்டு. ஆனால் அதன் பாகைகளில் ஆதாரங்கள் ஒத்துப்போகாததால் செயலி அதைப் பயன்படுத்துவதில்லை.",
    },
    sources: [
      { title: "Dr. N. G. Kumaran, \u201CPushkara Navamsa\u201D, IJATET 8(1), 2023", url: "https://ijatet.dvpublication.com/uploads/66c03489ca678_182.pdf" },
      { title: "Pushkara \u2014 Navamsha and Bhaga (Part One)", url: "https://komilla.com/lib-pushkara-part-one.html" },
      { title: "Pushkara \u2014 Navamsha and Bhaga (Part Two)", url: "https://komilla.com/lib-pushkara-part-two.html" },
    ],
  },
  panchaMahapurusha: {
    title: { en: "Pancha Mahapurusha Yogas", ta: "பஞ்ச மகாபுருஷ யோகங்கள்" },
    intro: {
      en: "Five \u201Cgreat person\u201D yogas form when Mars, Mercury, Jupiter, Venus or Saturn is in its own sign or its sign of exaltation and is also in a kendra (the 1st, 4th, 7th or 10th house) from the Lagna. Both conditions must hold together \u2014 dignity alone or a kendra alone does not form the yoga.",
      ta: "செவ்வாய், புதன், குரு, சுக்ரன் அல்லது சனி தனது சொந்த ராசியிலோ உச்ச ராசியிலோ இருந்து, அதே நேரத்தில் லக்னத்திலிருந்து கேந்திரத்தில் (1, 4, 7, 10) இருந்தால் ஐந்து \u201Cமகாபுருஷ\u201D யோகங்கள் உருவாகின்றன. இரண்டு நிபந்தனைகளும் ஒன்றாக இருக்க வேண்டும்.",
    },
    table: [
      [{ en: "Ruchaka (Mars)", ta: "ருசக (செவ்வாய்)" }, { en: "Aries, Scorpio", ta: "மேஷம், விருச்சிகம்" }, { en: "Capricorn", ta: "மகரம்" }],
      [{ en: "Bhadra (Mercury)", ta: "பத்ர (புதன்)" }, { en: "Gemini, Virgo", ta: "மிதுனம், கன்னி" }, { en: "Virgo", ta: "கன்னி" }],
      [{ en: "Hamsa (Jupiter)", ta: "ஹம்ச (குரு)" }, { en: "Sagittarius, Pisces", ta: "தனுசு, மீனம்" }, { en: "Cancer", ta: "கடகம்" }],
      [{ en: "Malavya (Venus)", ta: "மாளவ்ய (சுக்ரன்)" }, { en: "Taurus, Libra", ta: "ரிஷபம், துலாம்" }, { en: "Pisces", ta: "மீனம்" }],
      [{ en: "Sasa (Saturn)", ta: "சச (சனி)" }, { en: "Capricorn, Aquarius", ta: "மகரம், கும்பம்" }, { en: "Libra", ta: "துலாம்" }],
    ],
    tableHeader: [
      { en: "Yoga", ta: "யோகம்" }, { en: "Own signs", ta: "சொந்த ராசிகள்" }, { en: "Exaltation", ta: "உச்சம்" },
    ],
    note: {
      en: "The app checks the kendra from the Lagna. If the condition fails from the Lagna but holds counting from the Moon, that is noted separately, since sources differ on whether the Moon counts. Combustion and affliction, which some sources say reduce the yoga's effect, are not modeled.",
      ta: "இந்தச் செயலி லக்னத்திலிருந்து கேந்திரத்தைச் சோதிக்கிறது. லக்னத்திலிருந்து அமையாமல் சந்திரனிலிருந்து எண்ணும்போது அமைந்தால் அது தனியாகக் குறிப்பிடப்படும். அஸ்தங்கம், பாதிப்பு ஆகியவை கணக்கிடப்படவில்லை.",
    },
    sources: [
      { title: "Pancha Mahapurusha Yoga | GrahaLab", url: "https://grahalab.com/en/learn/yogas/pancha-mahapurusha" },
      { title: "Pancha Mahapurusha Yogas - Cosmic Insights", url: "https://blog.cosmicinsights.net/pancha-mahapurusha-yogas/" },
      { title: "Pancha Mahapurusha Yoga \u2014 Vedic Astrology | Satyori", url: "https://satyori.com/jyotish/articles/pancha-mahapurusha-yoga/" },
    ],
  },
  dignity: {
    title: { en: "Ucham and Neecham", ta: "உச்சம் மற்றும் நீசம்" },
    intro: {
      en: "Parashara gives every planet a rasi where it is exalted, its ucham, and seven rasis away a rasi where it is debilitated, its neecham. Inside the ucham rasi there is one exact degree where the exaltation peaks, the paramoccham, and the same degree in the neecham rasi is the lowest point, the paramaneecham. Varaha Mihira likens the ucham to the summit of a mountain and the neecham to the bottom of a trench. The peak lasts just one degree and ends at that degree, so for the Sun, whose paramoccham is 10\u00B0 of Mesham, it runs from just past 9\u00B0 to 10\u00B0. Climbing towards the summit a planet is full of drive, and once past it the energy starts to ease. The table gives each planet's paramoccham and paramaneecham with the nakshatra pada where they fall.",
      ta: "பராசரர் ஒவ்வொரு கிரகத்திற்கும் அது உச்சம் பெறும் ஒரு ராசியையும், அதிலிருந்து ஏழாவது ராசியில் அது நீசம் பெறும் ராசியையும் தருகிறார். உச்ச ராசிக்குள் உச்சம் சிகரத்தை அடையும் ஒரு துல்லியமான பாகை உண்டு, அதுவே பரமோச்சம். நீச ராசியில் அதே பாகை அடிமட்டம், அதுவே பரம நீசம். வராஹ மிஹிரர் உச்சத்தை மலையின் உச்சிக்கும் நீசத்தைப் பள்ளத்தின் அடிக்கும் ஒப்பிடுகிறார். சிகரம் ஒரே ஒரு பாகை மட்டுமே நீடிக்கும், அந்தப் பாகையில் முடியும். சூரியனின் பரமோச்சம் மேஷம் 10\u00B0, எனவே அது 9\u00B0க்குச் சற்று மேலிருந்து 10\u00B0 வரை. சிகரத்தை நோக்கி ஏறும்போது கிரகம் முழு உத்வேகத்துடன் இருக்கும், அதைக் கடந்ததும் அந்த வேகம் தணியத் தொடங்கும். ஒவ்வொரு கிரகத்தின் பரமோச்சமும் பரம நீசமும், அவை விழும் நட்சத்திரப் பாதத்துடன், அட்டவணையில் உள்ளன.",
    },
    tableHeader: [
      { en: "Planet", ta: "கிரகம்" }, { en: "Ucham", ta: "உச்சம்" }, { en: "Paramoccham", ta: "பரமோச்சம்" },
      { en: "Neecham", ta: "நீசம்" }, { en: "Paramaneecham", ta: "பரம நீசம்" },
    ],
    table: Object.entries(DIGNITY_TABLE).map(([planet, [rasi, deg]]) => [
      bothLangs((lang) => LABELS[lang].planets[planet] + (deg === null ? " (BPHS)" : "")),
      bothLangs((lang) => LABELS[lang].rasi[rasi]),
      bothLangs((lang) => (deg === null ? "\u2013" : deepPointText(lang, rasi, deg))),
      bothLangs((lang) => LABELS[lang].rasi[(rasi + 6) % 12]),
      bothLangs((lang) => (deg === null ? "\u2013" : deepPointText(lang, (rasi + 6) % 12, deg))),
    ]),
    note: {
      en: "Five of the seven planets reach their peak and their lowest point in a 2nd or 4th pada, and only the Sun and Jupiter do so in a 1st or 3rd pada. Rahu is exalted in Taurus and Ketu in Scorpio, following BPHS, and both peak at 3\u00B0 like the Moon. That puts Rahu's paramoccham in Krittika 2 and Ketu's in Vishakha 4, with each one's paramaneecham in the other pada. BPHS itself names no degree for Rahu and Ketu, so this 3\u00B0 reading is the user's, and other traditions differ. Sanjay Rath, for example, gives Gemini and Sagittarius, and the Saptarishis treat both as exalted in Scorpio. Neecha Bhanga, the classical cancellation of a debilitation, is not modeled.",
      ta: "ஏழு கிரகங்களில் ஐந்து, தம் சிகரத்தையும் அடிமட்டத்தையும் 2 அல்லது 4ஆம் பாதத்தில் அடைகின்றன. சூரியனும் குருவும் மட்டுமே 1 அல்லது 3ஆம் பாதத்தில் அடைகின்றன. BPHS படி ராகு ரிஷபத்திலும் கேது விருச்சிகத்திலும் உச்சம் பெறுகின்றன. இரண்டும் சந்திரனைப் போல 3\u00B0இல் சிகரத்தை அடைகின்றன. அதனால் ராகுவின் பரமோச்சம் கார்த்திகை 2இலும் கேதுவின் பரமோச்சம் விசாகம் 4இலும் விழுகிறது, ஒன்றின் பரம நீசம் மற்றதன் பாதத்தில். BPHS ராகு, கேதுவுக்குப் பாகை எதையும் குறிப்பிடவில்லை, எனவே இந்த 3\u00B0 கருத்து பயனருடையது, மற்ற மரபுகள் வேறுபடுகின்றன. உதாரணமாக சஞ்சய் ரத் மிதுனம், தனுசு என்கிறார், சப்தரிஷிகள் இருவரும் விருச்சிகத்தில் உச்சம் என்கின்றனர். நீச பங்கம் கணக்கிடப்படவில்லை.",
    },
    sources: [
      { title: "Varaha Mihira, \u201CReflections on Uccha and Neecha of Grahas\u201D (Thoughts on Jyotish, 2016)", url: "https://medium.com/thoughts-on-jyotish/reflections-on-uccha-and-neecha-of-grahas-28287f3b33b6" },
      { title: "Brihat Parashara Hora Sastra, Chapter 3", url: "https://yourastroguide.wordpress.com/2012/09/01/brihat-parashara-hora-sashtra-chapter-3/" },
      { title: "Saptarishis on exaltation/debilitation of Rahu & Ketu", url: "https://madhivanan.in/rahu-ketu-exalted-scorpio/" },
    ],
  },
  hiddenDignity: {
    title: { en: "Hidden Ucham and Neecham", ta: "மறைந்திருக்கும் உச்சம், நீசம்" },
    intro: {
      en: "Every planet has a pada in the Kaala Purusha chart where it is exalted, one where it is debilitated and one where its moolatrikonam begins. In a birth chart the planet carries each of these hidden somewhere else, and this page finds where. Take the planet's Kaala Purusha pada and call it A. The pada the planet sits in, in the birth chart, is B. Count the padas from A to B, counting both, and call that number C. Then count C padas again, starting from B as the first. The pada you land on is where the planet hides its ucham, neecham or moolatrikonam. For example, a Sun in Mula 2 is 72 padas on from its ucham pada, Ashwini 3. Counting 72 again from Mula 2 lands on Magha 1, so that Sun hides its ucham in Magha 1. When transit Rahu or Ketu passes over one of these hidden padas, it brings tension in the karakathvam of the planet hiding there and in the bhavam, the house from the lagna, that the pada falls in. The Hidden Ucham / Neecham tab shows this for a chart, with every such pass up to December 2035. The A padas for each planet are below.",
      ta: "ஒவ்வொரு கிரகத்திற்கும் கால புருஷ சக்கரத்தில் அது உச்சம் பெறும் ஒரு பாதம், நீசம் பெறும் ஒரு பாதம், மூலத்திரிகோணம் தொடங்கும் ஒரு பாதம் உண்டு. ஒருவரின் ஜாதகத்தில் அந்தக் கிரகம் இவற்றை வேறு ஓர் இடத்தில் மறைத்து வைத்திருக்கிறது. அந்த இடத்தை இந்தப் பக்கம் கண்டுபிடிக்கிறது. கிரகத்தின் கால புருஷ பாதத்தை A என்று கொள்ளுங்கள். ஜாதகத்தில் அந்தக் கிரகம் நிற்கும் பாதம் B. A முதல் B வரை, இரண்டையும் சேர்த்து, பாதங்களை எண்ணுங்கள். அந்த எண்ணிக்கை C. பிறகு B யை முதலாவதாகக் கொண்டு மீண்டும் C பாதங்களை எண்ணுங்கள். வந்து சேரும் பாதமே அந்தக் கிரகம் தன் உச்சம், நீசம் அல்லது மூலத்திரிகோணத்தை மறைத்து வைத்திருக்கும் இடம். உதாரணமாக மூலம் 2இல் உள்ள சூரியன், தன் உச்ச பாதமான அஸ்வினி 3இலிருந்து 72 பாதங்கள் தள்ளி இருக்கிறது. மூலம் 2இலிருந்து மீண்டும் 72 எண்ணினால் மகம் 1 வருகிறது. எனவே அந்தச் சூரியன் தன் உச்சத்தை மகம் 1இல் மறைத்து வைத்திருக்கிறது. கோசார ராகு அல்லது கேது இந்த மறைந்த பாதங்களில் ஒன்றின் மீது கடக்கும்போது, அங்கு மறைந்திருக்கும் கிரகத்தின் காரகத்துவத்திலும், அந்தப் பாதம் விழும் பாவத்திலும், அதாவது லக்னத்திலிருந்து வரும் வீட்டிலும், அழுத்தம் உண்டாகும். ஒரு ஜாதகத்திற்கு இதையும், டிசம்பர் 2035 வரை இப்படி நிகழும் எல்லாக் காலங்களையும் மறைந்த உச்சம் / நீசம் தாவல் காட்டுகிறது. ஒவ்வொரு கிரகத்தின் A பாதங்கள் கீழே உள்ளன.",
    },
    tableHeader: [
      { en: "Planet", ta: "கிரகம்" }, { en: "Ucham pada", ta: "உச்ச பாதம்" }, { en: "Neecham pada", ta: "நீச பாதம்" }, { en: "Moolatrikonam pada", ta: "மூலத்திரிகோண பாதம்" },
    ],
    table: Object.entries(DIGNITY_TABLE).map(([planet, [rasi, deg]]) => [
      bothLangs((lang) => LABELS[lang].planets[planet]),
      bothLangs((lang) => padaName(lang, deepPointPada(rasi, deg))),
      bothLangs((lang) => padaName(lang, deepPointPada((rasi + 6) % 12, deg))),
      bothLangs((lang) => (MOOLATRIKONA_FIRST_PADA[planet] ? padaName(lang, MOOLATRIKONA_FIRST_PADA[planet]) : "\u2013")),
    ]),
    note: {
      en: "The ucham and neecham padas are the paramoccham and paramaneecham padas, and the moolatrikonam pada is the first pada of each planet's moolatrikonam as BPHS gives it. The Sun's runs from 0\u00B0 to 20\u00B0 of Simham, the Moon's from just after 3\u00B0 of Rishabam, Mars's from 0\u00B0 to 12\u00B0 of Mesham, Mercury's from 16\u00B0 to 20\u00B0 of Kanni, Jupiter's from 0\u00B0 to 10\u00B0 of Dhanus, Venus's from 0\u00B0 to 15\u00B0 of Thulam and Saturn's from 0\u00B0 to 20\u00B0 of Kumbham. For the Moon and Mercury that first pada is the same as their ucham pada. Rahu and Ketu have no moolatrikonam here. This method was given by the user and has no written source.",
      ta: "உச்ச, நீச பாதங்கள் என்பவை பரமோச்ச, பரம நீச பாதங்கள். மூலத்திரிகோண பாதம் என்பது BPHS கூறும் ஒவ்வொரு கிரகத்தின் மூலத்திரிகோணத்தின் முதல் பாதம். சூரியனுக்குச் சிம்மம் 0\u00B0 முதல் 20\u00B0 வரை, சந்திரனுக்கு ரிஷபம் 3\u00B0க்குச் சற்று பிறகிருந்து, செவ்வாய்க்கு மேஷம் 0\u00B0 முதல் 12\u00B0 வரை, புதனுக்குக் கன்னி 16\u00B0 முதல் 20\u00B0 வரை, குருவுக்குத் தனுசு 0\u00B0 முதல் 10\u00B0 வரை, சுக்ரனுக்குத் துலாம் 0\u00B0 முதல் 15\u00B0 வரை, சனிக்குக் கும்பம் 0\u00B0 முதல் 20\u00B0 வரை. சந்திரனுக்கும் புதனுக்கும் அந்த முதல் பாதம் அவற்றின் உச்ச பாதமே. ராகு, கேதுவுக்கு இங்கு மூலத்திரிகோணம் இல்லை. இது பயனர் தந்த முறை, எழுத்து மூலம் இல்லை.",
    },
  },
  pranapada: {
    title: { en: "Pranapada Lagna", ta: "பிராணபத லக்னம்" },
    intro: {
      en: "Pranapada is a special lagna worked out from the time that has passed since sunrise, and it is traditionally linked to the breath (prana). It is used to rectify the birth time. The elapsed time is turned into vighatis, 150 to an hour, and divided by 15 to give signs and degrees, so it moves about 5\u00B0 a minute. That is then added to the Sun's longitude along with a correction for the Sun's sign type, shown below.",
      ta: "பிராணபதம் என்பது சூரிய உதயத்திலிருந்து கடந்த நேரத்தைக் கொண்டு கணக்கிடப்படும் சிறப்பு லக்னம். மரபுப்படி இது சுவாசத்துடன் (பிராணன்) தொடர்புடையது. பிறந்த நேரத்தைச் சரிசெய்ய இது பயன்படுகிறது. கடந்த நேரம் விகடிகைகளாக, மணிக்கு 150 என்ற கணக்கில், மாற்றப்பட்டு, 15-ஆல் வகுக்கப்பட்டு ராசி, பாகைகளாகிறது. அதனால் இது நிமிடத்திற்குச் சுமார் 5\u00B0 நகரும். பிறகு சூரியனின் ராசி வகைக்கு ஏற்ற திருத்தத்துடன் சூரியனின் பாகையுடன் கூட்டப்படுகிறது. அந்தத் திருத்தம் கீழே உள்ளது.",
    },
    tableHeader: [
      { en: "Sun in a...", ta: "சூரியன் உள்ள ராசி" }, { en: "Add", ta: "கூட்டுக" },
    ],
    table: [
      [{ en: "Movable sign", ta: "சர ராசி" }, { en: "0\u00B0", ta: "0\u00B0" }],
      [{ en: "Dual sign", ta: "உபய ராசி" }, { en: "120\u00B0", ta: "120\u00B0" }],
      [{ en: "Fixed sign", ta: "ஸ்திர ராசி" }, { en: "240\u00B0", ta: "240\u00B0" }],
    ],
    note: {
      en: "Because it moves so fast, a one-minute change in birth time shifts it by 5\u00B0, and the sunrise convention matters as much. Here sunrise is the true (geometric-with-refraction) sunrise, the same one used for Gulika and Mandi. A birth before that day's sunrise is counted from the previous day's sunrise.",
      ta: "இது மிக வேகமாக நகர்வதால், பிறந்த நேரத்தில் ஒரு நிமிட மாற்றம் 5\u00B0 மாற்றத்தை ஏற்படுத்தும். சூரிய உதயத்தைக் கணக்கிடும் முறையும் அதே அளவு முக்கியம். இங்கு குளிகன், மாந்திக்குப் பயன்படுத்தும் அதே உண்மையான சூரிய உதயம் பயன்படுத்தப்படுகிறது. அன்றைய சூரிய உதயத்திற்கு முன் பிறந்தால் முந்தைய நாளின் சூரிய உதயத்திலிருந்து கணக்கிடப்படும்.",
    },
    sources: [
      { title: "BPHS Pranapada \u2014 BP Lama Jyotishavidya", url: "https://barbarapijan.com/bpa/Amsha/pada_pranapada_BPHS.htm" },
      { title: "Aprakash Grahas, Upagrahas & Pranapada (worked example)", url: "http://varahamihira.blogspot.com/2008/02/aprakash-grahas-upagrahas-pranapada.html" },
    ],
  },
  thithiSoonyam: {
    title: { en: "Thithi Soonyam", ta: "திதி சூன்யம்" },
    intro: {
      en: "Each tithi (lunar day) makes certain rasis \u201Cvoid\u201D, or soonyam. Planets placed in those rasis, and the lords of those rasis, are said to give weaker results, even when they are benefics. The same table is used for both Shukla and Krishna paksha.",
      ta: "ஒவ்வொரு திதியும் சில ராசிகளை \u201Cசூன்யம்\u201D ஆக்குகிறது. அந்த ராசிகளில் உள்ள கிரகங்களும், அந்த ராசிகளின் அதிபதிகளும், சுப கிரகங்களாக இருந்தாலும், பலம் குறைந்த பலன்களைத் தருவதாகக் கூறப்படுகிறது. வளர்பிறை, தேய்பிறை இரண்டிற்கும் ஒரே அட்டவணைதான்.",
    },
    tableHeader: [
      { en: "Tithi", ta: "திதி" }, { en: "Soonya rasis", ta: "சூன்ய ராசிகள்" },
    ],
    table: [
      [{ en: "Prathamai, Dwadasi", ta: "பிரதமை, துவாதசி" }, { en: "Libra, Capricorn", ta: "துலாம், மகரம்" }],
      [{ en: "Dwitiyai, Ekadasi", ta: "துவிதியை, ஏகாதசி" }, { en: "Sagittarius, Pisces", ta: "தனுசு, மீனம்" }],
      [{ en: "Tritiyai", ta: "திருதியை" }, { en: "Leo, Capricorn", ta: "சிம்மம், மகரம்" }],
      [{ en: "Chaturthi", ta: "சதுர்த்தி" }, { en: "Taurus, Aquarius", ta: "ரிஷபம், கும்பம்" }],
      [{ en: "Panchami, Ashtami", ta: "பஞ்சமி, அஷ்டமி" }, { en: "Gemini, Virgo", ta: "மிதுனம், கன்னி" }],
      [{ en: "Shashti", ta: "சஷ்டி" }, { en: "Aries, Leo", ta: "மேஷம், சிம்மம்" }],
      [{ en: "Saptami", ta: "சப்தமி" }, { en: "Cancer, Sagittarius", ta: "கடகம், தனுசு" }],
      [{ en: "Navami, Dasami", ta: "நவமி, தசமி" }, { en: "Leo, Scorpio", ta: "சிம்மம், விருச்சிகம்" }],
      [{ en: "Trayodasi", ta: "திரயோதசி" }, { en: "Taurus, Leo", ta: "ரிஷபம், சிம்மம்" }],
      [{ en: "Chaturdasi", ta: "சதுர்த்தசி" }, { en: "Gemini, Virgo, Sagittarius, Pisces", ta: "மிதுனம், கன்னி, தனுசு, மீனம்" }],
      [{ en: "Pournami, Amavasai", ta: "பௌர்ணமி, அமாவாசை" }, { en: "None", ta: "இல்லை" }],
    ],
    note: {
      en: "It is usually read as milder when a soonya rasi falls in the 6th, 8th or 12th house, and the natural malefics (Mars, Saturn, Rahu, Ketu) are less affected. The tithi is the Moon's lead over the Sun in 12\u00B0 steps. Sources give no classical text for this table, which comes from the South Indian panchanga tradition.",
      ta: "சூன்ய ராசி 6, 8, 12 ஆம் வீடுகளில் விழுந்தால் பாதிப்பு குறைவு என்றும், இயற்கை பாப கிரகங்கள் (செவ்வாய், சனி, ராகு, கேது) குறைவாகப் பாதிக்கப்படும் என்றும் கருதப்படுகிறது. திதி என்பது சூரியனை விட சந்திரன் முன்னிருக்கும் தூரம், 12\u00B0 படிகளில். இந்த அட்டவணைக்கு ஆதாரங்கள் செவ்வியல் நூலைக் குறிப்பிடவில்லை. இது தென்னிந்திய பஞ்சாங்க மரபிலிருந்து வருகிறது.",
    },
    sources: [
      { title: "Tithi Shoonya or Daghda Rasi (SMAFIR)", url: "http://tuningmymelody.blogspot.com/2019/03/concept-of-daghda-rasi-or-tithi-shoonya.html" },
      { title: "What is Thithi Sunya? (Zeroness of Thithi)", url: "https://horoscopeanswer.blogspot.com/2013/06/what-is-thithi-sunya-zeroness-of-thithi.html" },
      { title: "Tithi Shoonya or Daghda Rasi (Indian Astrology Secrets)", url: "https://indianastrologysecrets.quora.com/Tithi-Shoonya-orDaghda-Rasi" },
    ],
  },
  mudakku: {
    title: { en: "Mudakku Rasi", ta: "முடக்கு ராசி" },
    intro: {
      en: "Take the pada (quarter) of the nakshatra the Sun is in, and count padas from it to the same pada of Moolam, counting both. Count the same number of padas again starting from that Moolam pada (it = 1). The pada you land on gives the Mudakku nakshatra, and the rasi that pada is in is the Mudakku rasi. Planets in that rasi, its rasi lord and the star lord are said to be blocked (முடக்கம்) and give fewer good results. A few examples follow.",
      ta: "சூரியன் நின்ற நட்சத்திரத்தின் பாதத்திலிருந்து மூலத்தின் அதே பாதம் வரை (இரண்டையும் சேர்த்து) பாதங்களை எண்ணவும். அதே எண்ணிக்கையை அந்த மூல பாதத்திலிருந்து (அது = 1) மீண்டும் எண்ணவும். வந்து சேரும் பாதத்தின் நட்சத்திரம் முடக்கு நட்சத்திரம். அந்தப் பாதம் உள்ள ராசி முடக்கு ராசி. அந்த ராசியில் உள்ள கிரகங்கள், ராசி அதிபதி, நட்சத்திர அதிபதி முடங்கி, நல்ல பலன்களைக் குறைவாகத் தருவதாகக் கூறப்படுகிறது. சில உதாரணங்கள் கீழே.",
    },
    tableHeader: [
      { en: "Sun's pada", ta: "சூரியன் பாதம்" }, { en: "Padas to Moolam", ta: "மூலம் வரை பாதங்கள்" }, { en: "Mudakku pada", ta: "முடக்கு பாதம்" }, { en: "Mudakku rasi", ta: "முடக்கு ராசி" },
    ],
    table: [
      [{ en: "Uthirattathi 1", ta: "உத்திரட்டாதி 1" }, { en: "81", ta: "81" }, { en: "Uthiram 1", ta: "உத்திரம் 1" }, { en: "Leo", ta: "சிம்மம்" }],
      [{ en: "Uthirattathi 3", ta: "உத்திரட்டாதி 3" }, { en: "81", ta: "81" }, { en: "Uthiram 3", ta: "உத்திரம் 3" }, { en: "Virgo", ta: "கன்னி" }],
      [{ en: "Moolam 2", ta: "மூலம் 2" }, { en: "1", ta: "1" }, { en: "Moolam 2", ta: "மூலம் 2" }, { en: "Sagittarius", ta: "தனுசு" }],
    ],
    note: {
      en: "A pada is 3\u00B020\u2032 and never spans two signs, so the rasi is always clear. Some published versions count whole stars and start the second count from Pooradam instead, which lands one star later. The effect is said to weaken when the Mudakku rasi is the lagna, which the app flags. Other conditions, such as Saturn's or a strong Jupiter's aspect, and timing by the lord's transit, are not modeled.",
      ta: "ஒரு பாதம் 3\u00B020\u2032. அது இரு ராசிகளில் பரவாது, எனவே ராசி எப்போதும் தெளிவு. சில நூல்கள் முழு நட்சத்திரங்களாக எண்ணி, இரண்டாவது எண்ணிக்கையை பூராடத்திலிருந்து தொடங்குகின்றன. அப்படி எண்ணினால் ஒரு நட்சத்திரம் தள்ளி வரும். முடக்கு ராசி லக்னமாக இருந்தால் பலன் குறையும், இதைச் செயலி குறிக்கிறது. சனி அல்லது பலமுள்ள குருவின் பார்வை, அதிபதியின் கோசாரம் போன்றவை கணக்கிடப்படவில்லை.",
    },
    sources: [
      { title: "சோதிட ரீதியான முடக்கு (Virakesari)", url: "https://www.virakesari.lk/article/143534" },
      { title: "முடக்கு ராசி அட்டவணை (AstroSiva)", url: "https://astrosiva.in/mudakku-tithi-sunyam-life-remedies/" },
      { title: "முடக்கு ராசி ஒரு ஜோதிட பார்வை (Neerkondar)", url: "http://neerkondar.blogspot.com/2024/12/blog-post_70.html" },
    ],
  },
  sooryaChandraadhi: {
    title: { en: "Soorya Chandraadhi Yoga", ta: "சூரிய சந்திராதி யோகம்" },
    intro: {
      en: "In the rasi chart (D1), count the Sun's house from the lagna (the lagna is the 1st). Count the same number of rasis from Mesha (Mesha is the 1st). If the Moon is in that rasi, the chart has Soorya Chandraadhi Yoga. Here are a few examples.",
      ta: "ராசி கட்டத்தில் (D1), லக்னத்திலிருந்து (லக்னம் = 1) சூரியன் நிற்கும் வீட்டை எண்ணவும். அதே எண்ணிக்கையை மேஷத்திலிருந்து (மேஷம் = 1) எண்ணவும். அந்த ராசியில் சந்திரன் இருந்தால், சூரிய சந்திராதி யோகம் உண்டு. சில உதாரணங்கள் கீழே.",
    },
    tableHeader: [
      { en: "Sun's house", ta: "சூரியன் வீடு" }, { en: "Rasi from Mesha", ta: "மேஷத்திலிருந்து ராசி" }, { en: "Moon in", ta: "சந்திரன்" }, { en: "Yoga", ta: "யோகம்" },
    ],
    table: [
      [{ en: "1", ta: "1" }, { en: "Aries", ta: "மேஷம்" }, { en: "Aries", ta: "மேஷம்" }, { en: "Present", ta: "உள்ளது" }],
      [{ en: "2", ta: "2" }, { en: "Taurus", ta: "ரிஷபம்" }, { en: "Taurus", ta: "ரிஷபம்" }, { en: "Present", ta: "உள்ளது" }],
      [{ en: "4", ta: "4" }, { en: "Cancer", ta: "கடகம்" }, { en: "Taurus", ta: "ரிஷபம்" }, { en: "Not present", ta: "இல்லை" }],
    ],
    note: {
      en: "This rule was given by the user and has no written source. Only the rasi counts, not the degree.",
      ta: "இது பயனர் தந்த விதி, எழுத்து மூலம் இல்லை. பாகை அல்ல, ராசி மட்டுமே கணக்கில் கொள்ளப்படுகிறது.",
    },
  },
  navamsaSashtashtagam: {
    title: { en: "Navamsa Sashtashtagam", ta: "நவாம்ச சஷ்டாஷ்டகம்" },
    intro: {
      en: "For each of the nine planets, count from its rasi in the D1 chart to its rasi in the navamsa (D9), the D1 rasi being the 1st. If no planet lands 6th or 8th, it is a huge plus in the jathakam. A planet that does brings issues related to the planet itself and to the houses (bhavams) it rules in D1, its aathipathyam. The pariharam is Vakkarakali Amman. The table below shows what each house stands for.",
      ta: "ஒன்பது கிரகங்களுக்கும், D1 கட்டத்தில் அது நிற்கும் ராசியிலிருந்து (அதுவே 1) நவாம்சத்தில் (D9) அது நிற்கும் ராசி வரை எண்ணவும். எந்தக் கிரகமும் 6 அல்லது 8ஆம் இடத்தில் வராவிட்டால், ஜாதகத்திற்குப் பெரிய பலம். வந்தால், அந்தக் கிரகம் மற்றும் D1இல் அது அதிபதியாக உள்ள வீடுகள் (ஆதிபத்யம்) தொடர்பான பிரச்சினைகள் வரும். பரிகாரம் வக்கிரகாளி அம்மன். ஒவ்வொரு வீடும் எதைக் குறிக்கிறது என்பது கீழே உள்ளது.",
    },
    tableHeader: [{ en: "House", ta: "வீடு" }, { en: "Stands for", ta: "குறிப்பவை" }],
    table: LABELS.en.ui.houseMeanings.map((en, i) => [
      { en: String(i + 1), ta: String(i + 1) },
      { en, ta: LABELS.ta.ui.houseMeanings[i] },
    ]),
    note: {
      en: "This rule was given by the user and has no written source. Take a Sun in Dhanus in D1 and Rishabam in D9. That is the 6th, so with a Dhanus lagna it touches the Sun and the 9th house it rules, which covers father, fortune and dharma. The issue shows up while the planet, in transit, passes through the nakshatra pada of its navamsa position (its longitude times 9). The Sun's navamsa is Rishabam 20\u00B018', which is Rohini pada 4, and the Sun crosses it around 5 to 8 June every year. For the Moon that lasts a few hours, for the Sun a few days and for Saturn several months, and the tab lists every period from 2026 to 2031. Rahu and Ketu rule no house, so the house they sit in is shown instead.",
      ta: "இது பயனர் தந்த விதி, எழுத்து மூலம் இல்லை. உதாரணமாக D1இல் தனுசு, D9இல் ரிஷபத்தில் உள்ள சூரியனை எடுத்துக்கொள்ளுங்கள். அது 6ஆம் இடம். தனுசு லக்னத்திற்கு அது சூரியனையும், அது அதிபதியான 9ஆம் வீட்டையும் (தந்தை, பாக்கியம், தர்மம்) பாதிக்கும். கோசாரத்தில் அந்தக் கிரகம் தன் நவாம்ச நிலையின் (பாகை × 9) நட்சத்திரப் பாதத்தைக் கடக்கும்போது பிரச்சினை வெளிப்படும். சூரியனின் நவாம்சம் ரிஷபம் 20\u00B018', அதாவது ரோகிணி 4ஆம் பாதம். ஒவ்வொரு ஆண்டும் ஜூன் 5 முதல் 8 வரை சூரியன் அதைக் கடக்கிறது. சந்திரனுக்கு இது சில மணிநேரங்கள், சூரியனுக்குச் சில நாட்கள், சனிக்குப் பல மாதங்கள். 2026 முதல் 2031 வரையிலான அனைத்துக் காலங்களும் காட்டப்படுகின்றன. ராகு, கேது எந்த வீட்டிற்கும் அதிபதி இல்லாததால், அவை நிற்கும் வீடு காட்டப்படுகிறது.",
    },
  },
  drekkanaLords: {
    title: { en: "Drekkana Lords Aathipathyam", ta: "திரேக்காண அதிபதிகள் ஆதிபத்யம்" },
    intro: {
      en: "Each planet's degree in its rasi picks its drekkana, and the lord of that drekkana is the planet's controller. Up to 10° it is the lord of the planet's own rasi, over 10° and up to 20° the lord of the 5th rasi from it, and over 20° the lord of the 9th. If the controller sits in the 6th or 8th rasi from the planet, the planet cannot perform well, and the pariharam is Vakkarakali Amman. Take Saturn in Rishabam as an example. The 6th from it is Thulam and the 8th is Dhanus.",
      ta: "ஒவ்வொரு கிரகமும் ராசியில் நிற்கும் பாகை அதன் திரேக்காணத்தைத் தீர்மானிக்கும். அந்தத் திரேக்காணத்தின் அதிபதியே கிரகத்தை இயக்குபவர். 10° வரை கிரகம் நின்ற ராசியின் அதிபதி, 10°க்கு மேல் 20° வரை அதிலிருந்து 5ஆம் ராசியின் அதிபதி, 20°க்கு மேல் 9ஆம் ராசியின் அதிபதி. அந்த அதிபதி கிரகத்திலிருந்து 6 அல்லது 8ஆம் ராசியில் இருந்தால், அந்தக் கிரகம் சரியாகச் செயல்பட இயலாது. இதற்குப் பரிகாரம் வக்கிரகாளி அம்மன். உதாரணமாக ரிஷபத்தில் உள்ள சனியை எடுத்துக்கொள்ளுங்கள். அதிலிருந்து 6ஆம் ராசி துலாம், 8ஆம் ராசி தனுசு.",
    },
    tableHeader: [
      { en: "Saturn's degree", ta: "சனியின் பாகை" }, { en: "Drekkana", ta: "திரேக்காணம்" }, { en: "Controller", ta: "அதிபதி" }, { en: "Weakened if the controller is in", ta: "அதிபதி இங்கிருந்தால் பலம் குறையும்" },
    ],
    table: [
      [{ en: "0° to 10°", ta: "0° முதல் 10°" }, { en: "1st, Rishabam", ta: "1ஆம், ரிஷபம்" }, { en: "Venus", ta: "சுக்ரன்" }, { en: "Libra or Sagittarius", ta: "துலாம் அல்லது தனுசு" }],
      [{ en: "10.01° to 20°", ta: "10.01° முதல் 20°" }, { en: "2nd, Kanni", ta: "2ஆம், கன்னி" }, { en: "Mercury", ta: "புதன்" }, { en: "Libra or Sagittarius", ta: "துலாம் அல்லது தனுசு" }],
      [{ en: "20.01° to 30°", ta: "20.01° முதல் 30°" }, { en: "3rd, Makaram", ta: "3ஆம், மகரம்" }, { en: "Saturn itself", ta: "சனியே" }, { en: "Never", ta: "ஒருபோதும் இல்லை" }],
    ],
    note: {
      en: "This rule was given by the user and has no written source. Exactly 10° counts as the 1st drekkana and exactly 20° as the 2nd, with degrees taken to the hundredth. The usual convention starts the next drekkana at 10° and 20° instead. All nine planets are checked, but Rahu and Ketu rule no rasi, so they are never controllers.",
      ta: "இது பயனர் தந்த விதி, எழுத்து மூலம் இல்லை. சரியாக 10° என்பது 1ஆம் திரேக்காணம், சரியாக 20° என்பது 2ஆம் திரேக்காணம் (பாகை இரண்டு தசம இடங்கள் வரை). வழக்கமான முறையில் 10°, 20° அடுத்த திரேக்காணத்தின் தொடக்கம். ஒன்பது கிரகங்களும் பார்க்கப்படுகின்றன, ஆனால் ராகு, கேதுவுக்கு ராசி ஆதிபத்யம் இல்லாததால் அவை அதிபதி ஆகாது.",
    },
  },
  moorthiNirnayam: {
    title: { en: "Moorthi Nirnayam", ta: "மூர்த்தி நிர்ணயம்" },
    intro: {
      en: "When Saturn, Jupiter or Rahu/Ketu changes rasi (peyarchi), note the rasi the Moon is in at that moment. Count from your janma rasi (the Moon's rasi at birth) to that rasi, the janma rasi being the 1st. The count gives the Moorthi, which shows how well that transit will go for you.",
      ta: "சனி, குரு அல்லது ராகு/கேது ராசி மாறும் (பெயர்ச்சி) நேரத்தில் சந்திரன் எந்த ராசியில் உள்ளது என்று பார்க்கவும். உங்கள் ஜென்ம ராசியிலிருந்து (பிறந்தபோது சந்திரன் நின்ற ராசி, அதுவே 1) அந்த ராசி வரை எண்ணவும். அந்த எண்ணிக்கை மூர்த்தியைத் தரும். அந்தப் பெயர்ச்சி உங்களுக்கு எப்படி அமையும் என்பதை அது காட்டும்.",
    },
    tableHeader: [
      { en: "Count from janma rasi", ta: "ஜென்ம ராசியிலிருந்து எண்ணிக்கை" }, { en: "Moorthi", ta: "மூர்த்தி" }, { en: "Result", ta: "பலன்" },
    ],
    table: [
      [{ en: "1, 6, 11", ta: "1, 6, 11" }, { en: "Swarna (gold)", ta: "சுவர்ண (தங்கம்)" }, { en: "Very favourable", ta: "மிக நல்லது" }],
      [{ en: "2, 5, 9", ta: "2, 5, 9" }, { en: "Rajatha (silver)", ta: "ரஜத (வெள்ளி)" }, { en: "Favourable", ta: "நல்லது" }],
      [{ en: "3, 7, 10", ta: "3, 7, 10" }, { en: "Thamira (copper)", ta: "தாமிர (செம்பு)" }, { en: "Average", ta: "சுமார்" }],
      [{ en: "4, 8, 12", ta: "4, 8, 12" }, { en: "Loha (iron)", ta: "லோஹ (இரும்பு)" }, { en: "Unfavourable", ta: "சாதகமில்லை" }],
    ],
    note: {
      en: "Here is the example from the source. Jupiter entered Capricorn on 20 Nov 2020 with the Moon also in Capricorn, so for a Capricorn janma rasi it was Swarna, and for Aries, the 10th, it was Thamira. When Saturn or Jupiter slips back into the previous rasi while retrograde, and when it enters again, each is listed with its own Moorthi. Rahu and Ketu always change rasi together.",
      ta: "மூலத்தில் உள்ள உதாரணம் இது. 20 நவம்பர் 2020 அன்று குரு மகரத்தில் நுழைந்தபோது சந்திரனும் மகரத்தில் இருந்தது. எனவே மகர ராசிக்குச் சுவர்ண மூர்த்தி, 10ஆம் ராசியான மேஷத்திற்குத் தாமிர மூர்த்தி. சனி அல்லது குரு வக்கிரமாகி முந்தைய ராசிக்குத் திரும்பும்போதும், மீண்டும் நுழையும்போதும், ஒவ்வொன்றும் தனி மூர்த்தியுடன் காட்டப்படுகிறது. ராகுவும் கேதுவும் எப்போதும் ஒன்றாக ராசி மாறுகின்றன.",
    },
    sources: [
      { title: "Moorti Nirnaya: a traditional approach to check transit results (Astroshala)", url: "https://astroshala.com/moorti-nirnaya-a-traditional-and-authentic-approach-to-check-planetary-transit-results/" },
    ],
  },
  jeevanam: {
    title: { en: "Jeevanam Yoga", ta: "ஜீவன யோகம்" },
    intro: {
      en: "In the rasi chart (D1), number the Moon's rasi from Mesha as in the Kaala Purusha chart (Mesha = 1, Simha = 5). Count that many houses from the lagna (the lagna is the 1st). If one or more planets are in that house, the chart has Jeevanam Yoga, and those planets show how the native earns. The Moon itself counts, so a Mesha lagna chart always has it. Here are a few examples.",
      ta: "ராசி கட்டத்தில் (D1), கால புருஷ சக்கரப்படி சந்திரன் நின்ற ராசியின் எண்ணை மேஷத்திலிருந்து எடுக்கவும் (மேஷம் = 1, சிம்மம் = 5). அத்தனை வீடுகளை லக்னத்திலிருந்து (லக்னம் = 1) எண்ணவும். அந்த வீட்டில் ஒன்று அல்லது அதற்கு மேற்பட்ட கிரகங்கள் இருந்தால் ஜீவன யோகம் உண்டு. அந்தக் கிரகங்கள் ஜாதகர் சம்பாதிக்கும் வழியைக் காட்டும். சந்திரனும் கணக்கில் சேரும், எனவே மேஷ லக்னத்திற்கு இந்த யோகம் எப்போதும் உண்டு. சில உதாரணங்கள் கீழே.",
    },
    tableHeader: [
      { en: "Moon in", ta: "சந்திரன்" }, { en: "Lagna", ta: "லக்னம்" }, { en: "House to check", ta: "பார்க்க வேண்டிய வீடு" }, { en: "Yoga", ta: "யோகம்" },
    ],
    table: [
      [{ en: "Leo (5)", ta: "சிம்மம் (5)" }, { en: "Aries", ta: "மேஷம்" }, { en: "5th, Leo, with the Moon in it", ta: "5ஆம் வீடு, சிம்மம், அங்கே சந்திரன்" }, { en: "Present", ta: "உள்ளது" }],
      [{ en: "Leo (5)", ta: "சிம்மம் (5)" }, { en: "Virgo", ta: "கன்னி" }, { en: "5th, Capricorn, with Saturn in it", ta: "5ஆம் வீடு, மகரம், அங்கே சனி" }, { en: "Present, earning through Saturn", ta: "உள்ளது, சனி வழியாக சம்பாத்தியம்" }],
      [{ en: "Taurus (2)", ta: "ரிஷபம் (2)" }, { en: "Sagittarius", ta: "தனுசு" }, { en: "2nd, Capricorn, empty", ta: "2ஆம் வீடு, மகரம், காலி" }, { en: "Not present", ta: "இல்லை" }],
    ],
    note: {
      en: "This rule was given by the user and has no written source. All nine grahas count, Rahu and Ketu included, but Gulika and Mandi do not.",
      ta: "இது பயனர் தந்த விதி, எழுத்து மூலம் இல்லை. ஒன்பது கிரகங்களும், ராகு, கேது உட்பட, கணக்கில் சேரும். குளிகன், மாந்தி சேராது.",
    },
  },
  kaalaPakai: {
    title: { en: "Kaala Pakai", ta: "கால பகை" },
    intro: {
      en: "Each graha is said to be at odds (pakai) with certain rasis. When it sits in one of them in the rasi chart (D1), its significations are troubled as below. Ketu has no Kaala Pakai rasi, and no graha has Simha (Leo).",
      ta: "ஒவ்வொரு கிரகமும் சில ராசிகளுடன் பகையாக இருப்பதாகக் கூறப்படுகிறது. ராசி கட்டத்தில் (D1) அந்த ராசியில் இருந்தால், அதன் காரகத்துவங்கள் கீழே உள்ளபடி பாதிக்கப்படும். கேதுவுக்குக் கால பகை ராசி இல்லை. சிம்மம் எந்த கிரகத்திற்கும் கால பகை இல்லை.",
    },
    tableHeader: [
      { en: "Planet", ta: "கிரகம்" }, { en: "Kaala Pakai rasi", ta: "கால பகை ராசி" }, { en: "Effect", ta: "பலன்" },
    ],
    table: Object.entries(KAALA_PAKAI).map(([planet, k]) => [
      { en: LABELS.en.planets[planet], ta: LABELS.ta.planets[planet] },
      { en: k.rasis.map((r) => LABELS.en.rasi[r]).join(", "), ta: k.rasis.map((r) => LABELS.ta.rasi[r]).join(", ") },
      k.effect,
    ]),
    note: {
      en: "This comes from a video and has no written source. Only the rasi counts, not the degree.",
      ta: "இது ஒரு காணொளியிலிருந்து எடுக்கப்பட்டது, எழுத்து மூலம் இல்லை. பாகை அல்ல, ராசி மட்டுமே கணக்கில் கொள்ளப்படுகிறது.",
    },
  },
};
