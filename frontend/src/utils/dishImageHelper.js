// Dish Image Fallback & Accurate Preset Helper for Svad Malai Chaap Junction
// Maps every dish name to its authentic, high-resolution food photography

export const CATEGORY_DEFAULT_IMAGES = {
  'veg-tandoori': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80', // Authentic Malai Chaap
  'veg-roll': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=700&q=80', // Chaap Kathi Roll
  'chaap-gravy': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80', // Rich Chaap Curry
  'veg-daal': 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=700&q=80', // Creamy Dal Makhni
  'paneer-gravy': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80', // Paneer Butter Masala
  'breads': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80', // Garlic Naan & Tandoori Roti
  'rice': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80', // Veg Dum Biryani
  'raita': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80', // Boondi Raita
  'noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80', // Hakka Noodles
  'potato-masti': 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80', // Honey Chilli Potato
  'special-tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=80', // Paneer Tikka
  'momos-magic': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=700&q=80', // Steamed Momos
  'king-rolls': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=700&q=80' // Jumbo Roll
};

// Accurate Keyword-based image matching matching specific dish names to real photos
export const DISH_KEYWORD_IMAGES = [
  // 1. Pudina & Mint Specials (Vibrant Green herb roasted chaap/tikka)
  { 
    keywords: ['PUDINA CHAAP', 'PUDINA TIKKA', 'PUDINA ROLL', 'PUDINA PANEER', 'HARYALI', 'HARIYALI', 'MINT CHAAP', 'PUDINA'], 
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80' 
  },

  // 2. Malai & Afghani Specials (Rich creamy cashew white roasted chaap)
  { 
    keywords: ['MALAI CHAAP', 'AFGANI CHAAP', 'AFGHANI CHAAP', 'MALAI PANEER', 'MALAI TIKKA', 'CREAM CHAAP', 'STUFF CHAAP', 'STUFFED CHAAP'], 
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80' 
  },

  // 3. Achari Specials (Pickling spice mustard marinated tandoori chaap)
  { 
    keywords: ['ACHARI CHAAP', 'ACHARI TIKKA', 'ACHARI ROLL', 'ACHARI PANEER', 'ACHARI'], 
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80' 
  },

  // 4. Lemon Specials (Zesty lemon pepper tandoor roasted starter)
  { 
    keywords: ['LEMON CHAAP', 'LEMON PANEER', 'LEMON ROLL', 'LEMON'], 
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80' 
  },

  // 5. Masala, Tikka & Spicy Specials (Fiery red Delhi tandoori chaap & tikka)
  { 
    keywords: ['MASALA CHAAP', 'CHAAP TIKKA', 'SUNNY LEONI', 'MIA KHALIFA', 'KHATTI MEETHI', 'GARLIC CHAAP', 'TANDOORI CHAAP', 'VEG. TANDOORI TIKKA'], 
    url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=80' 
  },

  // 6. Seekh Kababs
  { 
    keywords: ['SEEKH KABAB', 'VEG. SEEKH', 'KABAB ROLL', 'VEG. KABAB', 'KABAB'], 
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80' 
  },

  // 7. Mushroom Specials
  { 
    keywords: ['MUSHROOM TIKKA', 'MUSHROOM GRAVY', 'KADHAI MUSHROOM', 'MUSHROOM DO PYAZA', 'MUSHROOM'], 
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80' 
  },

  // 8. Lollipop & Leg Piece
  { 
    keywords: ['LOLLIPOP', 'LEG PIECE', 'MUTTON TIKKA', 'CHICKEN LOLLIPOP'], 
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80' 
  },

  // 9. Spring Roll (Crispy golden fried rolls)
  { 
    keywords: ['SPRING ROLL'], 
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80' 
  },

  // 10. Rolls & Wraps (Roomali wrapped stuffed rolls)
  { 
    keywords: ['ROLL', 'WRAPPED', 'KATHI'], 
    url: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=700&q=80' 
  },

  // 11. Dal Makhni & Amritsari Daal
  { 
    keywords: ['DAL MAKHNI', 'MAKHANI', 'AMRITSARI DAAL'], 
    url: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=700&q=80' 
  },

  // 12. Yellow Dal Tadka & Dal Fry
  { 
    keywords: ['YELLOW DAAL', 'DAL TADKA', 'DAL FRY', 'TADKA'], 
    url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80' 
  },

  // 13. Shahi Paneer, Paneer Butter Masala & Lababdar
  { 
    keywords: ['SHAHI PANEER', 'PANEER BUTTER', 'LABABDAR', 'MALAI KOFTA', 'PANEER PASANDA', 'BUTTER PANEER'], 
    url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80' 
  },

  // 14. Kadhai Paneer, Handi Paneer & Do Pyaza
  { 
    keywords: ['KADHAI PANEER', 'HANDI PANEER', 'DO PYAZA', 'PALAK PANEER', 'MATAR PANEER', 'PANEER TIKKA MASALA'], 
    url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=700&q=80' 
  },

  // 15. Paneer Bhurji & Tawa Paneer
  { 
    keywords: ['PANEER BHURJI', 'BHURJI', 'TAWA PANEER'], 
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80' 
  },

  // 16. Paneer Tikka (Special Tandoori)
  { 
    keywords: ['PANEER TIKKA', 'TIKKA'], 
    url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=80' 
  },

  // 17. Chaap Gravy (Tawa Chaap, Handi, Rogan Josh, Rara)
  { 
    keywords: ['TAWA CHAAP', 'HANDI CHAAP', 'GRAVY CHAAP', 'ROGAN JOSH', 'RARA CHAAP', 'KEEMA KALEJI', 'MUGHLAI CHAAP', 'BUTTER CHAAP', 'CHAAP CURRY', 'GRAVY'], 
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80' 
  },

  // 18. Roomali Roti
  { 
    keywords: ['ROOMALI ROTI', 'ROOMALI'], 
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80' 
  },

  // 19. Naan & Tandoori Rotis
  { 
    keywords: ['NAAN', 'GARLIC NAAN', 'BUTTER NAAN', 'ROTI', 'TANDOORI ROTI', 'PARANTHA', 'LACHHA', 'KULCHA', 'MISSI'], 
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80' 
  },

  // 20. Biryani & Pulao
  { 
    keywords: ['BIRYANI', 'DUM BIRYANI', 'PULAO', 'JEERA RICE', 'MATAR PULAO', 'RICE'], 
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80' 
  },

  // 21. Fried Rice
  { 
    keywords: ['FRIED RICE'], 
    url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80' 
  },

  // 22. Raita & Dahi
  { 
    keywords: ['BOONDI RAITA', 'RAITA', 'DAHI', 'CURD'], 
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80' 
  },

  // 23. Noodles & Chowmein
  { 
    keywords: ['NOODLES', 'HAKKA NOODLES', 'CHOWMEIN', 'CHILLI GARLIC NOODLES', 'SINGAPURI'], 
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80' 
  },

  // 24. Honey Chilli Potato & Crispy Potato
  { 
    keywords: ['CHILLI POTATO', 'HONEY CHILLI', 'POTATO MASTI'], 
    url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80' 
  },

  // 25. French Fries
  { 
    keywords: ['FRENCH FRIES', 'FRIES', 'PERI PERI FRIES'], 
    url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80' 
  },

  // 26. Kurkure Momos & Fried Momos
  { 
    keywords: ['KURKURE MOMOS', 'FRY MOMOS', 'FRIED MOMOS', 'CRISPY MOMOS'], 
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=700&q=80' 
  },

  // 27. Steamed Momos & Veg Momos
  { 
    keywords: ['MOMOS', 'STEAMED MOMOS', 'TANDOORI MOMOS', 'AFGHANI MOMOS', 'GRAVY MOMOS', 'DUMPLING'], 
    url: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=700&q=80' 
  }
];

// Presets for Admin to quickly pick when adding or editing a dish
export const ADMIN_IMAGE_PRESETS = [
  { name: '🔥 Tandoori Malai Chaap', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80' },
  { name: '🌿 Pudina / Mint Chaap', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80' },
  { name: '🌶️ Spicy Tandoori Masala Chaap', url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=80' },
  { name: '🍋 Lemon Pepper Chaap', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80' },
  { name: '🥒 Achari Spiced Chaap', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80' },
  { name: '🌯 Sizzling Roomali Roll', url: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=700&q=80' },
  { name: '🥢 Crispy Spring Roll', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80' },
  { name: '🍲 Rich Chaap Gravy', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80' },
  { name: '🧀 Shahi Paneer Butter Masala', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80' },
  { name: '🫑 Kadhai Paneer Special', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=700&q=80' },
  { name: '🥣 Slow Cooked Dal Makhni', url: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=700&q=80' },
  { name: '🥣 Yellow Dal Tadka', url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80' },
  { name: '🫓 Butter Garlic Naan', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80' },
  { name: '🥟 Crispy Kurkure Momos', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=700&q=80' },
  { name: '🥟 Steamed Veg Momos', url: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=700&q=80' },
  { name: '🍜 Wok Tossed Hakka Noodles', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80' },
  { name: '🍟 Honey Chilli Potato', url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=80' },
  { name: '🍟 Crispy French Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80' },
  { name: '🍚 Dum Biryani with Saffron', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80' },
  { name: '🥛 Chilled Boondi Raita', url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80' }
];

/**
 * Returns the best image URL for a dish:
 * 1. item.imageUrl if provided and not empty
 * 2. Keyword-based matching from dish title
 * 3. Category default fallback image
 */
export function getDishImageUrl(item) {
  if (!item) return CATEGORY_DEFAULT_IMAGES['veg-tandoori'];

  // 1. Explicit Image URL
  if (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.trim().length > 5) {
    return item.imageUrl.trim();
  }

  // 2. Keyword Match on Name
  const name = (item.name || '').toUpperCase();
  for (const entry of DISH_KEYWORD_IMAGES) {
    for (const kw of entry.keywords) {
      if (name.includes(kw)) {
        return entry.url;
      }
    }
  }

  // 3. Category Slug Match
  const catSlug = (item.categorySlug || item.category?.slug || '').toLowerCase();
  if (CATEGORY_DEFAULT_IMAGES[catSlug]) {
    return CATEGORY_DEFAULT_IMAGES[catSlug];
  }

  // 4. Default Tandoor Dish Image
  return CATEGORY_DEFAULT_IMAGES['veg-tandoori'];
}
