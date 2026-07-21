// Central catalog taxonomy for Paya Yadak.
// Categories and brands are derived from the Isuzu heavy/light-truck spare-parts
// market in Iran (engine, drivetrain, chassis, body, electrical, pneumatic).

export interface Category {
  id: string;
  name_fa: string;
  name_ar: string;
  name_en: string;
  icon: string; // emoji glyph fallback
  // Optional local product photo (e.g. /images/categories/brake.webp).
  // When present it takes precedence over the vector icon in <CategoryVisual/>.
  image?: string;
}

export interface Brand {
  id: string;
  name_fa: string;
  name_en: string;
}

export const categories: Category[] = [
  { id: 'engine', name_fa: 'قطعات موتوری', name_ar: 'قطع المحرك', name_en: 'Engine Parts', icon: '🔧' },
  { id: 'transmission', name_fa: 'گیربکس و کلاچ', name_ar: 'ناقل الحركة والقابض', name_en: 'Gearbox & Clutch', icon: '⚙️' },
  { id: 'undercarriage', name_fa: 'زیربندی و تعلیق', name_ar: 'الهيكل والتعليق', name_en: 'Undercarriage & Suspension', icon: '🛞' },
  { id: 'brake', name_fa: 'سیستم ترمز', name_ar: 'نظام الفرامل', name_en: 'Brake System', icon: '🛑' },
  { id: 'pneumatic', name_fa: 'قطعات پنوماتیک', name_ar: 'القطع الهوائية', name_en: 'Pneumatic Parts', icon: '💨' },
  { id: 'electrical', name_fa: 'سیستم برقی', name_ar: 'النظام الكهربائي', name_en: 'Electrical System', icon: '⚡' },
  { id: 'body', name_fa: 'قطعات بدنه', name_ar: 'قطع الهيكل', name_en: 'Body Parts', icon: '🚚' },
  { id: 'cooling', name_fa: 'خنک‌کاری و رادیاتور', name_ar: 'التبريد والمشعاع', name_en: 'Cooling & Radiator', icon: '🌡️' },
  { id: 'differential', name_fa: 'دیفرانسیل و اکسل', name_ar: 'التفاضل والمحور', name_en: 'Differential & Axle', icon: '🔩' },
  { id: 'filters', name_fa: 'فیلترها', name_ar: 'الفلاتر', name_en: 'Filters', icon: '🧴' },
  { id: 'fuel', name_fa: 'سیستم سوخت‌رسانی', name_ar: 'نظام الوقود', name_en: 'Fuel System', icon: '⛽' },
  { id: 'accessories', name_fa: 'لوازم جانبی', name_ar: 'الملحقات', name_en: 'Accessories', icon: '🧰' },
];

export const brands: Brand[] = [
  { id: 'isuzu', name_fa: 'ایسوزو', name_en: 'Isuzu' },
  { id: 'bahman-diesel', name_fa: 'بهمن دیزل', name_en: 'Bahman Diesel' },
  { id: 'amico', name_fa: 'آمیکو', name_en: 'Amico' },
  { id: 'hino', name_fa: 'هینو', name_en: 'Hino' },
  { id: 'iveco', name_fa: 'ایویکو', name_en: 'Iveco' },
  { id: 'volvo', name_fa: 'ولوو', name_en: 'Volvo' },
  { id: 'scania', name_fa: 'اسکانیا', name_en: 'Scania' },
  { id: 'benz', name_fa: 'بنز', name_en: 'Mercedes-Benz' },
];

// Isuzu truck families commonly serviced in Iran (used for the model filter).
export const models = [
  { id: 'npr', name_fa: 'کامیونت ایسوزو ۶ تن (NPR)', name_en: 'Isuzu 6-ton (NPR)' },
  { id: 'nqr', name_fa: 'کامیونت ایسوزو ۸ تن (NQR)', name_en: 'Isuzu 8-ton (NQR)' },
  { id: 'npr52', name_fa: 'کامیونت ایسوزو ۵.۲ تن', name_en: 'Isuzu 5.2-ton' },
  { id: 'ftr', name_fa: 'کامیون ایسوزو (FTR/FVR)', name_en: 'Isuzu Truck (FTR/FVR)' },
];
