// ابزارهای عمومی آرایه و هندسه‌ی چرخِ حروف.

/** درهم‌ریختنِ آرایه (Fisher–Yates) — یک کپیِ جدید برمی‌گرداند */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i] as T;
    arr[i] = arr[j] as T;
    arr[j] = tmp;
  }
  return arr;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * محاسبه‌ی مختصاتِ `count` نقطه روی محیط دایره.
 * @param count تعداد نقاط
 * @param radius شعاع
 * @param center مرکز دایره
 * @param startAngle زاویه‌ی شروع (پیش‌فرض: بالای دایره)
 */
export function circlePositions(
  count: number,
  radius: number,
  center: Point,
  startAngle = -Math.PI / 2,
): Point[] {
  if (count <= 0) {
    return [];
  }
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const angle = startAngle + (i * 2 * Math.PI) / count;
    points.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    });
  }
  return points;
}
