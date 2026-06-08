// تمِ بصری برنامه. تمام رنگ‌ها و اندازه‌ها از اینجا خوانده می‌شوند
// تا ظاهر یکپارچه و قابل‌تغییر باشد.

export const colors = {
  // پس‌زمینه‌ی گرادیانی بنفش/نیلی
  bgTop: '#3B0A6B',
  bgMid: '#4C1D95',
  bgBottom: '#2D115C',

  surface: 'rgba(255,255,255,0.08)',
  surfaceStrong: 'rgba(255,255,255,0.14)',

  primary: '#FFD166', // طلایی
  primaryDark: '#F4A52F',

  accent: '#7C5CFC',
  success: '#3DDC97',
  danger: '#FF5D73',

  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.65)',
  textDark: '#2D115C',

  tile: '#FFFFFF',
  tileText: '#3B0A6B',
  tileSelected: '#FFD166',

  coin: '#FFD166',
  shadow: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const fontSize = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
  xxl: 44,
} as const;

// در صورت افزودن فونت سفارشی فارسی (مثلاً Vazirmatn) نام آن را اینجا قرار دهید.
// با fontFamily: undefined از فونت پیش‌فرض سیستم استفاده می‌شود.
export const fonts = {
  regular: undefined as string | undefined,
  bold: undefined as string | undefined,
} as const;

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
} as const;
