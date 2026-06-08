// نقطه‌ی ورود برنامه. مؤلفه‌ی ریشه را برای Expo ثبت می‌کند.

import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent معادلِ AppRegistry.registerComponent است و
// تضمین می‌کند محیط چه در Expo Go و چه در بیلد بومی به‌درستی تنظیم شود.
registerRootComponent(App);
