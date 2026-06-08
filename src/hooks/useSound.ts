// هوک پخش جلوه‌های صوتی و لرزش (هپتیک).
// از expo-audio (جایگزین expo-av) استفاده می‌کند و به تنظیمات کاربر احترام می‌گذارد.

import { useCallback, useEffect, useRef } from 'react';
import {
  AudioPlayer,
  createAudioPlayer,
  setAudioModeAsync,
} from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { SoundName } from '../types';

// منابع صوتی به‌صورت استاتیک require می‌شوند تا Metro آن‌ها را باندل کند.
const SOUND_SOURCES: Record<SoundName, number> = {
  tap: require('../../assets/sounds/tap.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  wrong: require('../../assets/sounds/wrong.wav'),
  win: require('../../assets/sounds/win.wav'),
  coin: require('../../assets/sounds/coin.wav'),
};

interface UseSoundOptions {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

interface UseSoundApi {
  play: (name: SoundName) => void;
  haptic: (type?: 'light' | 'success' | 'error') => void;
}

/**
 * پخش‌کننده‌ها یک‌بار ساخته و در طول عمر کامپوننت نگه‌داری می‌شوند.
 * برای پخش مجدد، موقعیت پخش به صفر بازنشانی می‌شود.
 */
export function useSound(options: UseSoundOptions): UseSoundApi {
  const { soundEnabled, hapticsEnabled } = options;
  const playersRef = useRef<Partial<Record<SoundName, AudioPlayer>>>({});

  useEffect(() => {
    // اجازه‌ی پخش صدا حتی در حالت سکوتِ گوشی (iOS) را می‌دهیم.
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

    const players = playersRef.current;
    (Object.keys(SOUND_SOURCES) as SoundName[]).forEach((name) => {
      try {
        players[name] = createAudioPlayer(SOUND_SOURCES[name]);
      } catch {
        // اگر فایل صوتی موجود نبود، بازی بدون صدا ادامه می‌یابد.
      }
    });

    return () => {
      Object.values(players).forEach((p) => {
        try {
          p?.remove();
        } catch {
          // بی‌خطر
        }
      });
      playersRef.current = {};
    };
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!soundEnabled) {
        return;
      }
      const player = playersRef.current[name];
      if (!player) {
        return;
      }
      try {
        player.seekTo(0);
        player.play();
      } catch {
        // بی‌خطر
      }
    },
    [soundEnabled],
  );

  const haptic = useCallback(
    (type: 'light' | 'success' | 'error' = 'light') => {
      if (!hapticsEnabled) {
        return;
      }
      try {
        if (type === 'success') {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
        } else if (type === 'error') {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error,
          );
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {
        // در شبیه‌سازها/وب ممکن است در دسترس نباشد.
      }
    },
    [hapticsEnabled],
  );

  return { play, haptic };
}
