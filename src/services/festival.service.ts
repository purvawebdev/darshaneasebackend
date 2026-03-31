/**
 * Festival Service
 * Curated Hindu festival dataset with type classification
 * for color-coding and temple visiting tips.
 */

// ─── Types ──────────────────────────────────────────────────
export interface Festival {
  name: string;
  date: string;            // YYYY-MM-DD
  type: "major" | "ekadashi" | "purnima" | "amavasya" | "other";
  description: string;
  templeTip: string;
}

// ─── Temple Tips by Type ────────────────────────────────────

function getTempleTip(type: Festival["type"]): string {
  switch (type) {
    case "major":
      return "Expect large crowds. Arrive early (before 6 AM) and carry prasad offerings. Many temples offer special darshan queues on this day.";
    case "ekadashi":
      return "Observe a fast and visit a Vishnu temple. Ekadashi darshan is considered highly auspicious — ideal for a peaceful, spiritual visit.";
    case "purnima":
      return "Full moon day — temples are beautifully lit. Evening aarti is spectacular. Great time to visit riverside temples.";
    case "amavasya":
      return "New moon day — traditionally for ancestral prayers (Pitru Tarpan). Visit temples that hold special Amavasya pujas.";
    default:
      return "A wonderful day for temple darshan. Check your local temple for any special celebrations or pujas.";
  }
}

// ─── Descriptions ───────────────────────────────────────────

function getDescription(name: string, type: Festival["type"]): string {
  const descMap: Record<string, string> = {
    "Lohri": "A Punjabi winter bonfire festival celebrating the end of winter and the harvest season.",
    "Makar Sankranti": "Harvest festival marking the sun's transition into Capricorn — kite flying, til-gul sweets, and temple visits.",
    "Pongal": "A four-day Tamil harvest festival dedicated to the Sun God, celebrating abundance and prosperity.",
    "Basant Panchami": "Celebration of Goddess Saraswati and the arrival of spring — yellow attire and Saraswati puja.",
    "Maha Shivaratri": "The Great Night of Lord Shiva — devotees observe vigil, fasting, and offer bilva leaves at Shiva temples.",
    "Holi": "The Festival of Colors celebrating the triumph of good over evil and the arrival of spring.",
    "Holika Dahan": "The eve of Holi — bonfires are lit symbolising the burning of evil, with prayers around the sacred fire.",
    "Ugadi": "Telugu and Kannada New Year — celebrated with special dishes, temple visits, and reading of Panchanga.",
    "Gudi Padwa": "Marathi New Year — a decorated gudi is hoisted, symbolising victory and prosperity.",
    "Chaitra Navratri Begins": "Nine nights dedicated to Goddess Durga — fasting, garba dances, and daily puja at Shakti temples.",
    "Ram Navami": "Birthday of Lord Rama — temples recite Ramayana and hold special abhishekam ceremonies.",
    "Hanuman Jayanti": "Birthday of Lord Hanuman — recitation of Hanuman Chalisa and special worship at Hanuman temples.",
    "Baisakhi": "Punjabi harvest and New Year festival — also marks the founding of the Khalsa.",
    "Akshaya Tritiya": "One of the most auspicious days — believed to bring lasting prosperity. Gold purchases and charity are traditional.",
    "Buddha Purnima": "Celebrates the birth, enlightenment, and passing of Gautama Buddha — prayer services and meditation.",
    "Ganga Dussehra": "Celebrates the descent of the holy river Ganga to Earth — river bathing and puja along the Ganges.",
    "Rath Yatra": "Grand chariot procession of Lord Jagannath in Puri — one of the largest religious gatherings in India.",
    "Guru Purnima": "Day to honour spiritual gurus — special pujas and discourses at ashrams and temples.",
    "Raksha Bandhan": "Celebration of sibling bond — sisters tie rakhi on brothers' wrists with prayers for protection.",
    "Janmashtami": "Birthday of Lord Krishna — midnight celebrations, dahi handi, and special temple decorations.",
    "Ganesh Chaturthi": "Birthday of Lord Ganesha — elaborate idol installations, prayers, and grand visarjan processions.",
    "Anant Chaturdashi": "Final day of Ganesh festival — Ganpati visarjan processions. Also dedicated to Lord Vishnu's Anant form.",
    "Sharad Navratri Begins": "Nine nights dedicated to Goddess Durga — fasting, garba dances, and daily puja at Shakti temples.",
    "Dussehra": "Victory of Lord Rama over Ravana — Ravan dahan effigies, victory processions at temples.",
    "Karva Chauth": "Married women fast from sunrise to moonrise for the longevity of their husbands — evening moon puja.",
    "Dhanteras": "First day of Diwali festivities — dedicated to Goddess Lakshmi and Lord Dhanvantari. Buying gold and utensils is traditional.",
    "Diwali": "The Festival of Lights celebrating the victory of light over darkness. Homes and temples are illuminated with diyas and fireworks.",
    "Govardhan Puja": "Celebrates Lord Krishna's lifting of Govardhan Hill — annakut (mountain of food) is offered to the deity.",
    "Bhai Dooj": "Celebration of the bond between brothers and sisters — sisters pray for their brothers' well-being.",
    "Gita Jayanti": "Commemorates the day Lord Krishna delivered the Bhagavad Gita to Arjuna on the battlefield of Kurukshetra.",
    "Chhath Puja": "Ancient Vedic festival dedicated to the Sun God — devotees offer prayers standing in water at sunrise and sunset.",
  };

  if (descMap[name]) return descMap[name];

  switch (type) {
    case "ekadashi":
      return "Ekadashi is the 11th day of each lunar fortnight, sacred to Lord Vishnu. Devotees observe fasting and visit Vishnu temples.";
    case "purnima":
      return "Purnima (full moon day) is considered highly auspicious for temple visits, charity, and spiritual practices.";
    case "amavasya":
      return "Amavasya (new moon day) is dedicated to ancestral prayers and is considered powerful for meditation and inner reflection.";
    default:
      return `${name} — a Hindu observance. Visit your local temple for special celebrations and darshan.`;
  }
}

// ─── Curated 2026 Festival Dataset ──────────────────────────

interface RawFestival {
  name: string;
  date: string;
  type: Festival["type"];
}

const ALL_FESTIVALS: RawFestival[] = [
  // January
  { name: "Saphala Ekadashi", date: "2026-01-08", type: "ekadashi" },
  { name: "Paush Purnima", date: "2026-01-13", type: "purnima" },
  { name: "Lohri", date: "2026-01-13", type: "major" },
  { name: "Makar Sankranti", date: "2026-01-14", type: "major" },
  { name: "Pongal", date: "2026-01-14", type: "major" },
  { name: "Paush Amavasya", date: "2026-01-29", type: "amavasya" },

  // February
  { name: "Basant Panchami", date: "2026-02-01", type: "major" },
  { name: "Jaya Ekadashi", date: "2026-02-07", type: "ekadashi" },
  { name: "Magha Purnima", date: "2026-02-12", type: "purnima" },
  { name: "Maha Shivaratri", date: "2026-02-15", type: "major" },
  { name: "Vijaya Ekadashi", date: "2026-02-22", type: "ekadashi" },
  { name: "Magha Amavasya", date: "2026-02-27", type: "amavasya" },

  // March
  { name: "Amalaki Ekadashi", date: "2026-03-09", type: "ekadashi" },
  { name: "Holika Dahan", date: "2026-03-13", type: "major" },
  { name: "Holi", date: "2026-03-14", type: "major" },
  { name: "Phalguna Purnima", date: "2026-03-14", type: "purnima" },
  { name: "Papmochani Ekadashi", date: "2026-03-24", type: "ekadashi" },
  { name: "Phalguna Amavasya", date: "2026-03-29", type: "amavasya" },
  { name: "Ugadi", date: "2026-03-30", type: "major" },
  { name: "Gudi Padwa", date: "2026-03-30", type: "major" },

  // April
  { name: "Chaitra Navratri Begins", date: "2026-03-30", type: "major" },
  { name: "Ram Navami", date: "2026-04-07", type: "major" },
  { name: "Kamada Ekadashi", date: "2026-04-07", type: "ekadashi" },
  { name: "Hanuman Jayanti", date: "2026-04-12", type: "major" },
  { name: "Chaitra Purnima", date: "2026-04-12", type: "purnima" },
  { name: "Baisakhi", date: "2026-04-13", type: "major" },
  { name: "Varuthini Ekadashi", date: "2026-04-22", type: "ekadashi" },
  { name: "Chaitra Amavasya", date: "2026-04-27", type: "amavasya" },

  // May
  { name: "Akshaya Tritiya", date: "2026-05-01", type: "major" },
  { name: "Mohini Ekadashi", date: "2026-05-07", type: "ekadashi" },
  { name: "Buddha Purnima", date: "2026-05-12", type: "major" },
  { name: "Vaisakh Purnima", date: "2026-05-12", type: "purnima" },
  { name: "Apara Ekadashi", date: "2026-05-22", type: "ekadashi" },
  { name: "Vaisakh Amavasya", date: "2026-05-27", type: "amavasya" },

  // June
  { name: "Nirjala Ekadashi", date: "2026-06-05", type: "ekadashi" },
  { name: "Ganga Dussehra", date: "2026-06-06", type: "major" },
  { name: "Jyeshtha Purnima", date: "2026-06-11", type: "purnima" },
  { name: "Yogini Ekadashi", date: "2026-06-20", type: "ekadashi" },
  { name: "Jyeshtha Amavasya", date: "2026-06-25", type: "amavasya" },

  // July
  { name: "Rath Yatra", date: "2026-07-01", type: "major" },
  { name: "Devshayani Ekadashi", date: "2026-07-05", type: "ekadashi" },
  { name: "Guru Purnima", date: "2026-07-10", type: "major" },
  { name: "Ashadha Purnima", date: "2026-07-10", type: "purnima" },
  { name: "Kamika Ekadashi", date: "2026-07-20", type: "ekadashi" },
  { name: "Ashadha Amavasya", date: "2026-07-25", type: "amavasya" },

  // August
  { name: "Putrada Ekadashi", date: "2026-08-04", type: "ekadashi" },
  { name: "Raksha Bandhan", date: "2026-08-08", type: "major" },
  { name: "Shravana Purnima", date: "2026-08-08", type: "purnima" },
  { name: "Janmashtami", date: "2026-08-14", type: "major" },
  { name: "Aja Ekadashi", date: "2026-08-19", type: "ekadashi" },
  { name: "Shravana Amavasya", date: "2026-08-23", type: "amavasya" },

  // September
  { name: "Ganesh Chaturthi", date: "2026-09-02", type: "major" },
  { name: "Parsva Ekadashi", date: "2026-09-02", type: "ekadashi" },
  { name: "Bhadrapada Purnima", date: "2026-09-07", type: "purnima" },
  { name: "Anant Chaturdashi", date: "2026-09-11", type: "major" },
  { name: "Indira Ekadashi", date: "2026-09-17", type: "ekadashi" },
  { name: "Bhadrapada Amavasya", date: "2026-09-22", type: "amavasya" },

  // October
  { name: "Papankusha Ekadashi", date: "2026-10-02", type: "ekadashi" },
  { name: "Ashwin Purnima", date: "2026-10-06", type: "purnima" },
  { name: "Sharad Navratri Begins", date: "2026-10-07", type: "major" },
  { name: "Dussehra", date: "2026-10-16", type: "major" },
  { name: "Rama Ekadashi", date: "2026-10-17", type: "ekadashi" },
  { name: "Ashwin Amavasya", date: "2026-10-21", type: "amavasya" },
  { name: "Karva Chauth", date: "2026-10-25", type: "major" },

  // November
  { name: "Dhanteras", date: "2026-11-02", type: "major" },
  { name: "Diwali", date: "2026-11-04", type: "major" },
  { name: "Govardhan Puja", date: "2026-11-05", type: "major" },
  { name: "Kartik Purnima", date: "2026-11-05", type: "purnima" },
  { name: "Bhai Dooj", date: "2026-11-06", type: "major" },
  { name: "Chhath Puja", date: "2026-11-08", type: "major" },
  { name: "Devutthana Ekadashi", date: "2026-11-16", type: "ekadashi" },
  { name: "Kartik Amavasya", date: "2026-11-20", type: "amavasya" },
  { name: "Utpanna Ekadashi", date: "2026-11-30", type: "ekadashi" },

  // December
  { name: "Margashirsha Purnima", date: "2026-12-04", type: "purnima" },
  { name: "Gita Jayanti", date: "2026-12-12", type: "major" },
  { name: "Mokshada Ekadashi", date: "2026-12-15", type: "ekadashi" },
  { name: "Margashirsha Amavasya", date: "2026-12-20", type: "amavasya" },
  { name: "Saphala Ekadashi", date: "2026-12-29", type: "ekadashi" },
];

// ─── Public API ─────────────────────────────────────────────

export function getFestivals(year: number, month: number): Festival[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;

  return ALL_FESTIVALS
    .filter((f) => f.date.startsWith(prefix))
    .map((f) => ({
      name: f.name,
      date: f.date,
      type: f.type,
      description: getDescription(f.name, f.type),
      templeTip: getTempleTip(f.type),
    }));
}
