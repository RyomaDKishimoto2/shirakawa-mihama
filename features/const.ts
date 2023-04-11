export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type MonthType = typeof MONTHS[number];
export const DAYS = [...Array(31)].map((_, i) => i + 1);
export type DaysType = typeof DAYS[number];
export const YEARS = [2023, 2024, 2025, 2026] as const;
export type YearType = typeof YEARS[number];
export const weekItems = ['日', '月', '火', '水', '木', '金', '土'] as const;
export type DayOfWeekType = typeof weekItems[number];
export const WEATHERS = [
  '晴れ',
  '曇り',
  '雨',
  '風',
  '雨のち晴',
  '晴れのち雨',
] as const;
export type WeatherType = typeof WEATHERS[number];

export const STATUS = ['休み', '出勤'] as const;
export type StatusType = typeof STATUS[number];

export const HOURS = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25] as const;
export type HourType = typeof HOURS[number];

export const MINUTES = [0, 15, 30, 45] as const;
export type MinuteType = typeof MINUTES[number];

export const HOURLY = [900, 950, 1000, 1100, 1200, 1300, 1400, 1500] as const;
export type HouryType = typeof HOURLY[number];
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
export const MEMBER_INIT_VALUE: MemberType = {
  name: '',
  status: '出勤',
  fromHour: [...HOURS][0],
  fromMin: [...MINUTES][0],
  toHour: [...HOURS][0],
  toMin: [...MINUTES][0],
  hourly: [...HOURLY][0],
  amount: 0,
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
export type ChangeLabelType = typeof CHANGES[number];

export const CHANGE_TITLES = {
  Ichiman: '1万円',
  Gosen: '5千円',
  Nisen: '2千円',
  Sen: '1千円',
  Gohyaku: '500円',
  Hyaku: '100円',
  Gojyu: '50円',
  Jyu: '10円',
  Go: '5円',
  Ichi: '1円',
} as const;

export const CHANGE_INIT_VALUES = {
  Ichiman: 0,
  Gosen: 0,
  Nisen: 0,
  Sen: 0,
  Gohyaku: 0,
  Hyaku: 0,
  Gojyu: 0,
  Jyu: 0,
  Go: 0,
  Ichi: 0,
};

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
  'suehiro',
] as const;
export type SupplierLabelType = typeof SUPPLIERS[number];

export const SUPPLIER_NAME = {
  sakihama: '崎浜商店',
  miyazato: '宮里洋酒店',
  ganaha: 'ガナハミート',
  BEEFshin: 'BEEFshin',
  zenoki: 'ゼンオキ食品',
  sunny: 'サニークリン',
  shopping: '買い物',
  zappi: '雑費',
  kemutou: 'けむとうなか',
  gyoumu: '業務委託費',
  furikomiFee: '振込手数料',
  cardFee: 'カード手数料',
  eigyou: '営業経費',
  koutuhi: '旅費・交通費',
  yachin: '家賃',
  kounetuhi: '水道光熱費',
  tushinhi: '通信費',
  suehiro: '末広商店',
} as const;

export const SUPPLIER_INIT_VALUES = {
  sakihama: 0,
  miyazato: 0,
  ganaha: 0,
  BEEFshin: 0,
  zenoki: 0,
  sunny: 0,
  shopping: 0,
  zappi: 0,
  kemutou: 0,
  gyoumu: 0,
  furikomiFee: 0,
  cardFee: 0,
  eigyou: 0,
  koutuhi: 0,
  yachin: 0,
  kounetuhi: 0,
  tushinhi: 0,
  suehiro: 0,
};

export type SupplierType = {
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
  suehiro: number;
};

export type SalesType = {
  year: number;
  month: number;
  day: number;
  cash: number;
  card: number;
  eMoney: number;
  guests: number;
  senbero: number;
  changes: ChangeStateType;
  members: MemberType[];
  dayOfWeek: DayOfWeekType;
  suppliers: SupplierType;
  weather: WeatherType;
  total: number;
  impression: string;
  staffSalaries: number;
};

export const SALE_INIT_VALUE: SalesType = {
  year: 0,
  month: 0,
  day: 0,
  cash: 0,
  card: 0,
  eMoney: 0,
  guests: 0,
  senbero: 0,
  changes: CHANGE_INIT_VALUES,
  members: [MEMBER_INIT_VALUE],
  suppliers: SUPPLIER_INIT_VALUES,
  dayOfWeek: '月',
  weather: '晴れ',
  total: 0,
  impression: '',
  staffSalaries: 0,
};
