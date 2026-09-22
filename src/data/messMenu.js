export const MESS_MENU = {
  monday: {
    day: 'Monday',
    breakfast: 'Tea, Chole Rice / Rajma Rice, Pickle',
    lunch: 'Roti, Sabji, Chole, Rice, Pickle',
    dinner: 'Roti, Seasonal Sabji, Dal, Rice, Salad',
  },
  tuesday: {
    day: 'Tuesday',
    breakfast: 'Paratha',
    lunch: 'Biryani Rice',
    dinner: 'Chole, Poori, Kheer / Sawai, Salad',
  },
  wednesday: {
    day: 'Wednesday',
    breakfast: 'Fried Rice / Veg Pulao, Raita / Chutney',
    lunch: 'Aloo Soyabean, Roti, Rice, Pickle',
    dinner: 'Roti, Seasonal Sabji, Dal, Rice, Salad',
  },
  thursday: {
    day: 'Thursday',
    breakfast: 'Aloo Paratha, Chutney, Pickle',
    lunch: 'Roti, Seasonal Sabji, Dal, Rice, Pickle',
    dinner: 'Dal Makhni, Sabji, Roti, Rice, Salad',
  },
  friday: {
    day: 'Friday',
    breakfast: 'Poori, Sabji',
    lunch: 'Roti, Sabji, Dal, Rice, Pickle',
    dinner: 'Kadhi Pakoda, Aloo Jeera, Roti, Rice, Salad',
  },
  saturday: {
    day: 'Saturday',
    breakfast: 'Macaroni / Pasta',
    lunch: 'Chole Bhature, Salad, Pickle',
    dinner: 'Masala Baingan Bharta, Roti, Rice, Dal, Salad',
  },
  sunday: {
    day: 'Sunday',
    breakfast: 'Indori Poha',
    lunch: 'Veg Masala Biryani, Raita, Chutney',
    dinner: 'Matar Paneer / Kadhai Paneer / Matar Mushroom, Roti, Rice, Suji Halwa, Salad',
  },
};

const DAYS_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function getTodayMenu() {
  const dayIndex = new Date().getDay();
  const dayKey = DAYS_ORDER[dayIndex];
  return MESS_MENU[dayKey];
}

export function getMenuByDay(dayKey) {
  return MESS_MENU[dayKey] || null;
}

export function getProteinHighlights(dayKey) {
  const menu = MESS_MENU[dayKey];
  if (!menu) return [];
  const hints = [];
  const full = `${menu.breakfast} ${menu.lunch} ${menu.dinner}`.toLowerCase();
  if (full.includes('chole') || full.includes('rajma')) hints.push('🫘 Prioritize chole/rajma for protein');
  if (full.includes('dal')) hints.push('🥣 Have extra dal for protein');
  if (full.includes('soy')) hints.push('🫘 Soyabean is a great protein source');
  if (full.includes('paneer')) hints.push('🧀 Paneer day! Great for protein');
  if (full.includes('biryani')) hints.push('🍚 Biryani day — pair with extra dal or curd');
  if (hints.length === 0) hints.push('🥛 Don\'t forget your milk today');
  return hints;
}
