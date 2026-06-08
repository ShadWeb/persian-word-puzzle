// ابزارهای مربوط به زبان فارسی: نرمال‌سازی نویسه‌ها، راه‌اندازی RTL
// و بررسی این‌که یک واژه از مجموعه‌ای از حروف ساخته‌شدنی هست یا نه.

import { I18nManager } from 'react-native';

/**
 * نگاشتِ نرمال‌سازی نویسه‌های عربی/متغیر به فرم فارسیِ متعارف.
 * هدف: «آب» و «اب» یا «كتاب» و «کتاب» یکسان در نظر گرفته شوند.
 */
const NORMALIZE_MAP: Record<string, string> = {
  آ: 'ا',
  أ: 'ا',
  إ: 'ا',
  ٱ: 'ا',
  ي: 'ی',
  ئ: 'ی',
  ك: 'ک',
  ة: 'ه',
  ؤ: 'و',
  ء: '',
  '\u200c': '', // نیم‌فاصله (ZWNJ)
  ' ': '',
};

/** نرمال‌سازیِ یک رشته‌ی فارسی برای مقایسه */
export function normalizePersian(input: string): string {
  let result = '';
  for (const ch of input) {
    result += ch in NORMALIZE_MAP ? NORMALIZE_MAP[ch] : ch;
  }
  return result;
}

/** شمارش تکرارِ هر نویسه در یک رشته */
function charCount(input: string): Map<string, number> {
  const map = new Map<string, number>();
  for (const ch of input) {
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }
  return map;
}

/**
 * آیا واژه‌ی `word` فقط با حروفِ `letters` ساخته‌شدنی است؟
 * (هر کاشی حداکثر به‌تعدادِ موجود استفاده می‌شود)
 */
export function isWordFormable(word: string, letters: string[]): boolean {
  const need = charCount(normalizePersian(word));
  const have = charCount(letters.map(normalizePersian).join(''));
  for (const [ch, count] of need) {
    if ((have.get(ch) ?? 0) < count) {
      return false;
    }
  }
  return true;
}

/** آیا دو واژه پس از نرمال‌سازی برابرند؟ */
export function persianEquals(a: string, b: string): boolean {
  return normalizePersian(a) === normalizePersian(b);
}

/**
 * راه‌اندازی راست‌به‌چپ. این تابع باید یک‌بار در ابتدای اجرای برنامه
 * صدا زده شود. در صورت تغییر جهت، در بیلدِ بومی نیاز به ری‌استارت است.
 */
export function setupRTL(): void {
  try {
    I18nManager.allowRTL(true);
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
    }
  } catch {
    // در برخی محیط‌ها (مثل وب) ممکن است در دسترس نباشد؛ بی‌خطر است.
  }
}
