export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type MonthType = (typeof MONTHS)[number];
export const DAYS = [...Array(31)].map((_, i) => i + 1);
export type DaysType = (typeof DAYS)[number];
export const YEARS = [2023, 2024, 2025, 2026] as const;
export type YearType = (typeof YEARS)[number];
export const weekItems = ['日', '月', '火', '水', '木', '金', '土'] as const;
export type DayOfWeekType = (typeof weekItems)[number];
export const WEATHERS = [
  '晴れ',
  '曇り',
  '雨',
  '風',
  '雨のち晴',
  '晴れのち雨',
] as const;
export type WeatherType = (typeof WEATHERS)[number];

export const STATUS = { offWork: '休み', working: '出勤' } as const;
export type StatusType = (typeof STATUS)[keyof typeof STATUS];

export const HOURS = [
  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
] as const;
export type HourType = (typeof HOURS)[number];

export const MINUTES = [0, 15, 30, 45] as const;
export type MinuteType = (typeof MINUTES)[number];

export const HOURLY = [900, 950, 1000, 1100, 1200, 1300, 1400, 1500] as const;
export type HouryType = (typeof HOURLY)[number];

export type MemberType = {
  name: string;
  status: StatusType;
  fromHour: HourType;
  fromMin: MinuteType;
  toHour: HourType;
  toMin: MinuteType;
  hourly: number;
  amount: number;
};

export type OptionalType = {
  name: string;
  value: number;
};
export const CHANGES = [
  'Ichiman',
  'Gosen',
  'Nisen',
  'Sen',
  'Gohyaku',
  'Hyaku',
  'Gojyu',
  'Jyu',
  'Go',
  'Ichi',
] as const;
export type ChangeLabelType = (typeof CHANGES)[number];
export type ChangeStateType = {
  Ichiman: number;
  Gosen: number;
  Nisen: number;
  Sen: number;
  Gohyaku: number;
  Hyaku: number;
  Gojyu: number;
  Jyu: number;
  Go: number;
  Ichi: number;
};

export const SUPPLIERS = [
  'suehiro',
  'sakihama',
  'miyazato',
  'ganaha',
  'BEEFshin',
  'zenoki',
  'sunny',
  'shopping',
  'zappi',
  'kemutou',
  'gyoumu',
  'furikomiFee',
  'cardFee',
  'eigyou',
  'koutuhi',
  'yachin',
  'kounetuhi',
  'tushinhi',
  'miyagi',
] as const;

export type SupplierType = {
  suehiro: number;
  sakihama: number;
  miyazato: number;
  ganaha: number;
  BEEFshin: number;
  zenoki: number;
  sunny: number;
  shopping: number;
  zappi: number;
  kemutou: number;
  gyoumu: number;
  furikomiFee: number;
  cardFee: number;
  eigyou: number;
  koutuhi: number;
  yachin: number;
  kounetuhi: number;
  tushinhi: number;
  miyagi: number;
};

export type SalesType = {
  year: number;
  month: number;
  day: number;
  cash: number;
  card: number;
  eMoney: number;
  guests: number;
  changes: ChangeStateType;
  members: MemberType[];
  dayOfWeek: DayOfWeekType;
  suppliers: SupplierType;
  weather: WeatherType;
  total: number;
  impression: string;
  staffSalaries: number;
  optionals: OptionalType[] | [];
  fakeCash: number;
};

export const tachikaraUid = 'ZCjq6Q1QmENqDYIJJRvB8x4HoR33';
