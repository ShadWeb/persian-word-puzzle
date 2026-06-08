// تمام تایپ‌های مشترک برنامه در این فایل تعریف می‌شوند.

/** یک مرحله از بازی */
export interface Level {
  /** شناسه‌ی یکتا (از ۱ شروع می‌شود) */
  id: number;
  /** حروفِ روی چرخ. هر عنصر یک کاشی است (ممکن است تکراری باشد) */
  letters: string[];
  /** واژه‌های صحیحِ این مرحله (به‌صورت نمایشی) */
  words: string[];
  /** سکه‌ی پاداشِ تکمیل مرحله */
  reward: number;
}

/** وضعیت ذخیره‌شده‌ی بازیکن روی دستگاه */
export interface GameSave {
  /** بالاترین مرحله‌ی بازشده (۱ یعنی فقط مرحله‌ی اول باز است) */
  unlockedLevel: number;
  /** آخرین مرحله‌ای که بازیکن روی آن بوده (برای دکمه‌ی «ادامه») */
  currentLevel: number;
  /** موجودی سکه */
  coins: number;
  /** فهرست شناسه‌ی مراحلِ کامل‌شده */
  completedLevels: number[];
  /** واژه‌های یافت‌شده به ازای هر مرحله: { [levelId]: string[] } */
  foundWords: Record<number, string[]>;
}

/** تنظیمات کاربر */
export interface Settings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

/** نتیجه‌ی بررسی یک حدس */
export type GuessResult =
  | { status: 'correct'; word: string; alreadyFound: boolean }
  | { status: 'wrong' }
  | { status: 'empty' };

/** نوع جلوه‌های صوتی موجود */
export type SoundName = 'tap' | 'correct' | 'wrong' | 'win' | 'coin';
