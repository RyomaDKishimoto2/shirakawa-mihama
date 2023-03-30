import {
  ChangeStateType,
  AttendanceType,
  DayOfWeekType,
  WeatherType,
  SupplierType,
} from '../const';

export class Sales {
  constructor(
    public cash: number,
    public card: number,
    public year: number,
    public month: number,
    public day: number,
    public eMoney: number,
    public guests: number,
    public senbero: number,
    public changes: ChangeStateType,
    public members: AttendanceType[],
    public dayOfWeek: DayOfWeekType,
    public weather: WeatherType,
    public total: number,
    public impression: string,
    public suppliers: SupplierType,
    public staffSalaries: number
  ) {}
}
