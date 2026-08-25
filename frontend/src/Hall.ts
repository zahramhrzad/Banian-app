export type Hall = {
  id: string
  label: string
  x: number
  y: number
}

export type BoothPin = {
  id: string
  hallId: string
  x: number
  y: number
  companyName: string
}

// مختصات x/y تقریبی روی عکس نقشه‌ی کلی سایت هستند — چون فعلاً ابزار مدیریتی
// برای جابه‌جایی پین سالن‌ها نساختیم، اینا رو با چشم از روی عکس نقشه تخمین زدم.
// اگه دقیق نبودن، بگو تا ابزار مدیریت پین سالن‌ها رو هم اضافه کنیم.
export const halls: Hall[] = [
  { id: 'hall-5', label: 'سالن ۵', x: 58, y: 43 },
  { id: 'hall-6-7', label: 'سالن ۶ و ۷', x: 64, y: 58 },
  { id: 'hall-8-9', label: 'سالن ۸-۹', x: 73, y: 62 },
  { id: 'hall-10-11', label: 'سالن ۱۰-۱۱', x: 84, y: 50 },
  { id: 'hall-27', label: 'سالن ۲۷', x: 62, y: 55 },
]

// پین‌های داخل هر سالن خالی شروع می‌شن — چون اسم شرکت واقعی هر غرفه رو نداریم،
// این‌ها باید از پنل مدیریت (روی عکس واقعی هر سالن) ثبت بشن.
export const initialBoothPinsByHall: Record<string, BoothPin[]> = {
  'hall-5': [],
  'hall-6-7': [],
  'hall-8-9': [],
  'hall-10-11': [],
  'hall-27': [],
}
