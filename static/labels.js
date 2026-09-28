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
      sooryaChandraadhiCalc: "Sun is in house {house} from the lagna; rasi {house} from Mesha is {target}; the Moon is in {moon}.",
      jeevanamCalc: "Moon is in {moon}, rasi {n} from Mesha; house {n} from the lagna is {target}; planets there: {planets}.",
      jeevanamEarning: "Earnings come through: {planets}.", noneWord: "none",
      dignityTab: "Ucham / Neecham", colState: "State", colDeep: "Deep point", colDistance: "From deep point",
      dignityUcham: "Ucham (exalted)", dignityNeecham: "Neecham (debilitated)",
      dignityNone: "No planet is in its exaltation or debilitation sign.",
      dignityNote: "Sign-based, main chart only. Rahu and Ketu use the BPHS reading (traditions differ). Neecha Bhanga, the cancellation of a debilitation, is not modeled.",
      pranapada: "Pranapada Lagna", houseWord: "house",
      pranapadaHint: "Moves about 5\u00B0 per minute of birth time, so it is very sensitive to the exact time and sunrise.",
      yogaPresent: "Present", yogaAbsent: "Not present", yogaSummary: "Present in this chart",
      tithiBox: "Tithi and Thithi Soonyam", tithi: "Tithi", soonyam: "Thithi Soonyam", soonyamNone: "None (no void rasis on Pournami or Amavasai)",
      soonyamHint: "Void rasis for the birth tithi. Planets in them, and their lords, are said to give weaker results.",
      soonyamLegend: "Thithi Soonyam rasi",
      upasana: "Upasana Deivam", upasanaPick: "Choose a rasi",
      upasanaCalc: "{planet} is in {from}; the 11th rasi from it is {rasi}.",
      upasanaNoGender: "The calculation counts from Jupiter for a man or Venus for a woman; choose a rasi to look it up.",
      upasanaHint: "For a man, count 11 rasis from Jupiter; for a woman, from Venus (its own rasi is the 1st). Choose another rasi to look it up.",
      mudakku: "Mudakku Rasi", mudakkuTag: "Mudakku", starLordWord: "star lord", padaWord: "pada",
      mudakkuHint: "From the Sun's pada, count padas to the same pada of Moolam; count the same again from there. Planets here, the rasi lord and the star lord are said to be blocked.",
      mudakkuLagna: "The Mudakku rasi is the lagna, which is said to weaken the Mudakku effect.",
      kaalaPakai: "Kaala Pakai", colKaalaPakai: "Kaala Pakai", kaalaPakaiYes: "\u26A0 Yes",
      kaalaPakaiNone: "No planet is in Kaala Pakai.", kaalaPakaiPick: "Choose a planet", kaalaPakaiRasis: "Kaala Pakai rasi",
      kaalaPakaiHint: "A planet in its Kaala Pakai rasi in the rasi chart (D1) is said to be troubled. Ketu has none. Choose a planet to see its rasis.",
    },
    tithiNames: ["Prathamai", "Dwitiyai", "Tritiyai", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami", "Navami", "Dasami", "Ekadasi", "Dwadasi", "Trayodasi", "Chaturdasi"],
    paksha: { shukla: "Shukla", krishna: "Krishna" },
    pournami: "Pournami", amavasai: "Amavasai",
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
      sooryaChandraadhiCalc: "சூரியன் லக்னத்திலிருந்து {house}ஆம் வீட்டில் உள்ளது; மேஷத்திலிருந்து {house}ஆம் ராசி {target}; சந்திரன் {moon} ராசியில் உள்ளது.",
      jeevanamCalc: "சந்திரன் {moon} ராசியில், மேஷத்திலிருந்து {n}ஆம் ராசி; லக்னத்திலிருந்து {n}ஆம் வீடு {target}; அங்குள்ள கிரகங்கள்: {planets}.",
      jeevanamEarning: "சம்பாத்தியம் வரும் வழி: {planets}.", noneWord: "இல்லை",
      dignityTab: "உச்சம் / நீசம்", colState: "நிலை", colDeep: "உச்ச பாகை", colDistance: "உச்ச பாகையிலிருந்து",
      dignityUcham: "உச்சம்", dignityNeecham: "நீசம்",
      dignityNone: "எந்த கிரகமும் உச்ச அல்லது நீச ராசியில் இல்லை.",
      dignityNote: "ராசி அடிப்படையிலானது, ராசி சக்கரத்திற்கு மட்டும். ராகு, கேதுவுக்கு பராசர ஹோரை (BPHS) கருத்து பயன்படுத்தப்படுகிறது (மரபுகள் வேறுபடும்). நீச பங்கம் கணக்கிடப்படவில்லை.",
      pranapada: "பிராணபத லக்னம்", houseWord: "வீடு",
      pranapadaHint: "பிறந்த நேரத்தின் ஒவ்வொரு நிமிடத்திற்கும் சுமார் 5\u00B0 நகர்வதால், துல்லியமான நேரம் மற்றும் சூரிய உதயத்தைப் பொறுத்து மிகவும் மாறும்.",
      yogaPresent: "உள்ளது", yogaAbsent: "இல்லை", yogaSummary: "இந்த ஜாதகத்தில் உள்ளவை",
      tithiBox: "திதி மற்றும் திதி சூன்யம்", tithi: "திதி", soonyam: "திதி சூன்யம்", soonyamNone: "இல்லை (பௌர்ணமி, அமாவாசைக்கு சூன்ய ராசி இல்லை)",
      soonyamHint: "பிறந்த திதிக்கான சூன்ய ராசிகள். அவற்றில் உள்ள கிரகங்களும் அவற்றின் அதிபதிகளும் பலம் குறைந்த பலன்களைத் தருவதாகக் கூறப்படுகிறது.",
      soonyamLegend: "திதி சூன்ய ராசி",
      upasana: "உபாசனை தெய்வம்", upasanaPick: "ராசியைத் தேர்ந்தெடுக்கவும்",
      upasanaCalc: "{planet} {from} ராசியில் உள்ளது; அதிலிருந்து 11ஆம் ராசி {rasi}.",
      upasanaNoGender: "ஆணுக்கு குருவிலிருந்தும், பெண்ணுக்கு சுக்ரனிலிருந்தும் எண்ணப்படும்; ராசியைத் தேர்ந்தெடுத்துப் பார்க்கவும்.",
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

const READING_TOPICS = {
  pushkaraNavamsa: {
    title: { en: "Pushkara Navamsa", ta: "புஷ்கர நவாம்சம்" },
    intro: {
      en: "Each sign has 2 of its 9 navamsa divisions considered especially auspicious (“nourishing”) — a planet landing there gives strong results even if otherwise weak in its own sign. Which two divisions depends on the sign's element:",
      ta: "ஒவ்வொரு ராசிக்கும் அதன் 9 நவாம்சப் பிரிவுகளில் 2 பிரிவுகள் மிகவும் சுபமானவை (“ஊட்டமளிக்கும்”) என்று கருதப்படுகின்றன — ஒரு கிரகம் அங்கு அமைந்தால், அந்த ராசியில் பலவீனமாக இருந்தாலும் நல்ல பலன்களைத் தரும். எந்த இரு பிரிவுகள் என்பது ராசியின் தத்துவத்தைப் பொறுத்தது:",
    },
    table: [
      [{ en: "Fire", ta: "அக்னி" }, { en: "Aries, Leo, Sagittarius", ta: "மேஷம், சிம்மம், தனுசு" }, { en: "7th & 9th", ta: "7, 9" }],
      [{ en: "Earth", ta: "பூமி" }, { en: "Taurus, Virgo, Capricorn", ta: "ரிஷபம், கன்னி, மகரம்" }, { en: "3rd & 5th", ta: "3, 5" }],
      [{ en: "Air", ta: "வாயு" }, { en: "Gemini, Libra, Aquarius", ta: "மிதுனம், துலாம், கும்பம்" }, { en: "6th & 8th", ta: "6, 8" }],
      [{ en: "Water", ta: "நீர்" }, { en: "Cancer, Scorpio, Pisces", ta: "கடகம், விருச்சிகம், மீனம்" }, { en: "1st & 3rd", ta: "1, 3" }],
    ],
    note: {
      en: "There's also a finer single-degree “Pushkara Bhaga” within that range that's even more potent, but sources disagree on the exact degrees per sign, so it isn't implemented yet.",
      ta: "இதற்குள் இன்னும் துல்லியமான ஒரு குறிப்பிட்ட பாகையான “புஷ்கர பாகம்” உள்ளது, ஆனால் ஆதாரங்கள் ஒவ்வொரு ராசிக்கான சரியான பாகை மதிப்பில் உடன்படவில்லை, எனவே இது இன்னும் செயல்படுத்தப்படவில்லை.",
    },
    sources: [
      { title: "Pushkara — Navamsha and Bhaga (Part One)", url: "https://komilla.com/lib-pushkara-part-one.html" },
      { title: "Pushkara — Navamsha and Bhaga (Part Two)", url: "https://komilla.com/lib-pushkara-part-two.html" },
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
      en: "A planet in its sign of exaltation (ucham) is strengthened; in its sign of debilitation (neecham, always the opposite sign) it is weakened. The deep point is the exact degree where the effect peaks; the debilitation deep point is the same degree in the opposite sign.",
      ta: "ஒரு கிரகம் தனது உச்ச ராசியில் இருந்தால் பலம் பெறுகிறது; நீச ராசியில் (எப்போதும் எதிர் ராசி) இருந்தால் பலவீனமடைகிறது. உச்ச பாகை என்பது பலன் உச்சத்தை அடையும் துல்லியமான பாகை; நீச பாகை எதிர் ராசியில் அதே பாகையாகும்.",
    },
    tableHeader: [
      { en: "Planet", ta: "கிரகம்" }, { en: "Ucham", ta: "உச்சம்" }, { en: "Neecham", ta: "நீசம்" },
    ],
    table: [
      [{ en: "Sun", ta: "சூரியன்" }, { en: "Aries 10\u00B0", ta: "மேஷம் 10\u00B0" }, { en: "Libra", ta: "துலாம்" }],
      [{ en: "Moon", ta: "சந்திரன்" }, { en: "Taurus 3\u00B0", ta: "ரிஷபம் 3\u00B0" }, { en: "Scorpio", ta: "விருச்சிகம்" }],
      [{ en: "Mars", ta: "செவ்வாய்" }, { en: "Capricorn 28\u00B0", ta: "மகரம் 28\u00B0" }, { en: "Cancer", ta: "கடகம்" }],
      [{ en: "Mercury", ta: "புதன்" }, { en: "Virgo 15\u00B0", ta: "கன்னி 15\u00B0" }, { en: "Pisces", ta: "மீனம்" }],
      [{ en: "Jupiter", ta: "குரு" }, { en: "Cancer 5\u00B0", ta: "கடகம் 5\u00B0" }, { en: "Capricorn", ta: "மகரம்" }],
      [{ en: "Venus", ta: "சுக்ரன்" }, { en: "Pisces 27\u00B0", ta: "மீனம் 27\u00B0" }, { en: "Virgo", ta: "கன்னி" }],
      [{ en: "Saturn", ta: "சனி" }, { en: "Libra 20\u00B0", ta: "துலாம் 20\u00B0" }, { en: "Aries", ta: "மேஷம்" }],
      [{ en: "Rahu (BPHS)", ta: "ராகு (BPHS)" }, { en: "Taurus", ta: "ரிஷபம்" }, { en: "Scorpio", ta: "விருச்சிகம்" }],
      [{ en: "Ketu (BPHS)", ta: "கேது (BPHS)" }, { en: "Scorpio", ta: "விருச்சிகம்" }, { en: "Taurus", ta: "ரிஷபம்" }],
    ],
    note: {
      en: "Rahu and Ketu are disputed: BPHS gives Taurus/Scorpio as used here, Sanjay Rath gives Gemini/Sagittarius, and the Saptarishis treat both as exalted in Scorpio. Neecha Bhanga, the classical cancellation of a debilitation, is not modeled.",
      ta: "ராகு, கேது குறித்து கருத்து வேறுபாடு உள்ளது: இங்கு பயன்படுத்தப்படுவது BPHS கூறும் ரிஷபம்/விருச்சிகம்; சஞ்சய் ரத் மிதுனம்/தனுசு என்கிறார்; சப்தரிஷிகள் இருவரும் விருச்சிகத்தில் உச்சம் என்கின்றனர். நீச பங்கம் கணக்கிடப்படவில்லை.",
    },
    sources: [
      { title: "Brihat Parashara Hora Sastra, Chapter 3", url: "https://yourastroguide.wordpress.com/2012/09/01/brihat-parashara-hora-sashtra-chapter-3/" },
      { title: "Saptarishis on exaltation/debilitation of Rahu & Ketu", url: "https://madhivanan.in/rahu-ketu-exalted-scorpio/" },
    ],
  },
  pranapada: {
    title: { en: "Pranapada Lagna", ta: "பிராணபத லக்னம்" },
    intro: {
      en: "Pranapada is a special lagna derived from the time elapsed since sunrise, traditionally linked to the breath (prana). It is used in birth-time rectification. The elapsed time is converted to vighatis (1 hour = 150), divided by 15 to give signs and degrees (so it moves about 5\u00B0 per minute), and added to the Sun's longitude with a correction that depends on the Sun's sign type:",
      ta: "பிராணபதம் என்பது சூரிய உதயத்திலிருந்து கடந்த நேரத்தைக் கொண்டு கணக்கிடப்படும் சிறப்பு லக்னம்; மரபுப்படி சுவாசத்துடன் (பிராணன்) தொடர்புடையது. பிறந்த நேரத்தைச் சரிசெய்யப் பயன்படுகிறது. கடந்த நேரம் விகடிகைகளாக (1 மணி = 150) மாற்றப்பட்டு, 15-ஆல் வகுக்கப்பட்டு ராசி, பாகைகளாகிறது (நிமிடத்திற்கு சுமார் 5\u00B0 நகரும்); சூரியனின் ராசி வகைக்கு ஏற்ற திருத்தத்துடன் சூரியனின் பாகையுடன் கூட்டப்படுகிறது:",
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
      ta: "இது மிக வேகமாக நகர்வதால், பிறந்த நேரத்தில் ஒரு நிமிட மாற்றம் 5\u00B0 மாற்றத்தை ஏற்படுத்தும்; சூரிய உதய முறையும் அதே அளவு முக்கியம். இங்கு குளிகன், மாந்திக்குப் பயன்படுத்தும் அதே உண்மையான சூரிய உதயம் பயன்படுத்தப்படுகிறது. அன்றைய சூரிய உதயத்திற்கு முன் பிறந்தால் முந்தைய நாளின் சூரிய உதயத்திலிருந்து கணக்கிடப்படும்.",
    },
    sources: [
      { title: "BPHS Pranapada \u2014 BP Lama Jyotishavidya", url: "https://barbarapijan.com/bpa/Amsha/pada_pranapada_BPHS.htm" },
      { title: "Aprakash Grahas, Upagrahas & Pranapada (worked example)", url: "http://varahamihira.blogspot.com/2008/02/aprakash-grahas-upagrahas-pranapada.html" },
    ],
  },
  thithiSoonyam: {
    title: { en: "Thithi Soonyam", ta: "திதி சூன்யம்" },
    intro: {
      en: "Each tithi (lunar day) makes certain rasis \u201Cvoid\u201D (soonyam). Planets placed in those rasis, and the lords of those rasis, are said to give weaker results, even when they are benefics. The same table is used for Shukla and Krishna paksha:",
      ta: "ஒவ்வொரு திதியும் சில ராசிகளை \u201Cசூன்யம்\u201D ஆக்குகிறது. அந்த ராசிகளில் உள்ள கிரகங்களும், அந்த ராசிகளின் அதிபதிகளும், சுப கிரகங்களாக இருந்தாலும், பலம் குறைந்த பலன்களைத் தருவதாகக் கூறப்படுகிறது. வளர்பிறை, தேய்பிறை இரண்டிற்கும் ஒரே அட்டவணை:",
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
      en: "Commonly read as milder when a soonya rasi falls in the 6th, 8th or 12th house, and natural malefics (Mars, Saturn, Rahu, Ketu) are less affected. The tithi is the Moon's lead over the Sun in 12\u00B0 steps. Sources give no classical text for this table; it comes from the South Indian panchanga tradition.",
      ta: "சூன்ய ராசி 6, 8, 12 ஆம் வீடுகளில் விழுந்தால் பாதிப்பு குறைவு என்றும், இயற்கை பாப கிரகங்கள் (செவ்வாய், சனி, ராகு, கேது) குறைவாகப் பாதிக்கப்படும் என்றும் கருதப்படுகிறது. திதி என்பது சூரியனை விட சந்திரன் முன்னிருக்கும் தூரம், 12\u00B0 படிகளில். இந்த அட்டவணைக்கு ஆதாரங்கள் செவ்வியல் நூலைக் குறிப்பிடவில்லை; இது தென்னிந்திய பஞ்சாங்க மரபிலிருந்து வருகிறது.",
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
      en: "Take the pada (quarter) of the nakshatra the Sun is in, and count padas from it to the same pada of Moolam, counting both. Count the same number of padas again starting from that Moolam pada (it = 1). The pada you land on gives the Mudakku nakshatra, and the rasi that pada is in is the Mudakku rasi. Planets in that rasi, its rasi lord and the star lord are said to be blocked (முடக்கம்) and give fewer good results. Example:",
      ta: "சூரியன் நின்ற நட்சத்திரத்தின் பாதத்திலிருந்து மூலத்தின் அதே பாதம் வரை (இரண்டையும் சேர்த்து) பாதங்களை எண்ணவும். அதே எண்ணிக்கையை அந்த மூல பாதத்திலிருந்து (அது = 1) மீண்டும் எண்ணவும். வந்து சேரும் பாதத்தின் நட்சத்திரம் முடக்கு நட்சத்திரம்; அந்தப் பாதம் உள்ள ராசி முடக்கு ராசி. அந்த ராசியில் உள்ள கிரகங்கள், ராசி அதிபதி, நட்சத்திர அதிபதி முடங்கி, நல்ல பலன்களைக் குறைவாகத் தருவதாகக் கூறப்படுகிறது. உதாரணம்:",
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
      en: "A pada is 3\u00B020\u2032 and never spans two signs, so the rasi is always clear. Some published versions count whole stars and start the second count from Pooradam instead, which lands one star later. Said to weaken when the Mudakku rasi is the lagna (flagged here); other conditions such as Saturn's or a strong Jupiter's aspect, and timing by the lord's transit, are not modeled.",
      ta: "ஒரு பாதம் 3\u00B020\u2032; அது இரு ராசிகளில் பரவாது, எனவே ராசி எப்போதும் தெளிவு. சில நூல்கள் முழு நட்சத்திரங்களாக எண்ணி, இரண்டாவது எண்ணிக்கையை பூராடத்திலிருந்து தொடங்குகின்றன; அது ஒரு நட்சத்திரம் தள்ளி வரும். முடக்கு ராசி லக்னமாக இருந்தால் பலன் குறையும் (இங்கு குறிக்கப்படுகிறது); சனி அல்லது பலமுள்ள குருவின் பார்வை, அதிபதியின் கோசாரம் போன்றவை கணக்கிடப்படவில்லை.",
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
      en: "In the rasi chart (D1), count the Sun's house from the lagna (the lagna is the 1st). Count the same number of rasis from Mesha (Mesha is the 1st). If the Moon is in that rasi, the chart has Soorya Chandraadhi Yoga. Examples:",
      ta: "ராசி கட்டத்தில் (D1), லக்னத்திலிருந்து (லக்னம் = 1) சூரியன் நிற்கும் வீட்டை எண்ணவும். அதே எண்ணிக்கையை மேஷத்திலிருந்து (மேஷம் = 1) எண்ணவும். அந்த ராசியில் சந்திரன் இருந்தால், சூரிய சந்திராதி யோகம் உண்டு. உதாரணம்:",
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
      en: "As given by the user; no written source. Only the rasi counts, not the degree.",
      ta: "பயனர் தந்த விதி; எழுத்து மூலம் இல்லை. பாகை அல்ல, ராசி மட்டுமே கணக்கில் கொள்ளப்படுகிறது.",
    },
  },
  jeevanam: {
    title: { en: "Jeevanam Yoga", ta: "ஜீவன யோகம்" },
    intro: {
      en: "In the rasi chart (D1), number the Moon's rasi from Mesha as in the Kaala Purusha chart (Mesha = 1, Simha = 5). Count that many houses from the lagna (the lagna is the 1st). If one or more planets are in that house, the chart has Jeevanam Yoga, and those planets show how the native earns. The Moon itself counts, so a Mesha lagna chart always has it. Examples:",
      ta: "ராசி கட்டத்தில் (D1), கால புருஷ சக்கரப்படி சந்திரன் நின்ற ராசியின் எண்ணை மேஷத்திலிருந்து எடுக்கவும் (மேஷம் = 1, சிம்மம் = 5). அத்தனை வீடுகளை லக்னத்திலிருந்து (லக்னம் = 1) எண்ணவும். அந்த வீட்டில் ஒன்று அல்லது அதற்கு மேற்பட்ட கிரகங்கள் இருந்தால் ஜீவன யோகம் உண்டு; அந்தக் கிரகங்கள் ஜாதகர் சம்பாதிக்கும் வழியைக் காட்டும். சந்திரனும் கணக்கில் சேரும், எனவே மேஷ லக்னத்திற்கு இந்த யோகம் எப்போதும் உண்டு. உதாரணம்:",
    },
    tableHeader: [
      { en: "Moon in", ta: "சந்திரன்" }, { en: "Lagna", ta: "லக்னம்" }, { en: "House to check", ta: "பார்க்க வேண்டிய வீடு" }, { en: "Yoga", ta: "யோகம்" },
    ],
    table: [
      [{ en: "Leo (5)", ta: "சிம்மம் (5)" }, { en: "Aries", ta: "மேஷம்" }, { en: "5th, Leo: the Moon is there", ta: "5ஆம் வீடு, சிம்மம்: சந்திரன் அங்கே" }, { en: "Present", ta: "உள்ளது" }],
      [{ en: "Leo (5)", ta: "சிம்மம் (5)" }, { en: "Virgo", ta: "கன்னி" }, { en: "5th, Capricorn: Saturn there", ta: "5ஆம் வீடு, மகரம்: சனி அங்கே" }, { en: "Present, earning through Saturn", ta: "உள்ளது, சனி வழியாக சம்பாத்தியம்" }],
      [{ en: "Taurus (2)", ta: "ரிஷபம் (2)" }, { en: "Sagittarius", ta: "தனுசு" }, { en: "2nd, Capricorn: empty", ta: "2ஆம் வீடு, மகரம்: காலி" }, { en: "Not present", ta: "இல்லை" }],
    ],
    note: {
      en: "As given by the user; no written source. The nine grahas count (Rahu and Ketu included); Gulika and Mandi do not.",
      ta: "பயனர் தந்த விதி; எழுத்து மூலம் இல்லை. ஒன்பது கிரகங்களும் (ராகு, கேது உட்பட) கணக்கில் சேரும்; குளிகன், மாந்தி சேராது.",
    },
  },
  kaalaPakai: {
    title: { en: "Kaala Pakai", ta: "கால பகை" },
    intro: {
      en: "Each graha is said to be at odds (pakai) with certain rasis. When it sits in one of them in the rasi chart (D1), its significations are troubled as below. Ketu has no Kaala Pakai rasi, and no graha has Simha (Leo).",
      ta: "ஒவ்வொரு கிரகமும் சில ராசிகளுடன் பகையாக இருப்பதாகக் கூறப்படுகிறது. ராசி கட்டத்தில் (D1) அந்த ராசியில் இருந்தால், அதன் காரகத்துவங்கள் கீழே உள்ளபடி பாதிக்கப்படும். கேதுவுக்குக் கால பகை ராசி இல்லை; சிம்மம் எந்த கிரகத்திற்கும் கால பகை இல்லை.",
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
      en: "From a video; no written source. Only the rasi counts, not the degree.",
      ta: "ஒரு காணொளியிலிருந்து; எழுத்து மூலம் இல்லை. பாகை அல்ல, ராசி மட்டுமே கணக்கில் கொள்ளப்படுகிறது.",
    },
  },
};
