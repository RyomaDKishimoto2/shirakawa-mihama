import {
  ChangeStateType,
  MemberType,
  DayOfWeekType,
  WeatherType,
  SupplierType,
  HouryType,
  OptioanlType,
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
    public members: MemberType[],
    public dayOfWeek: DayOfWeekType,
    public weather: WeatherType,
    public total: number,
    public impression: string,
    public suppliers: SupplierType,
    public staffSalaries: number,
    public optionals: OptioanlType[],
    public fakeCash: number
  ) {}
}

export class Members {
  constructor(
    public name: string,
    public salary: HouryType,
    public createdAt: Date
  ) {}
}

export class StaffInfo {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public isDeleted: boolean,
    public createdAt: Date,
    public salary: HouryType
  ) {}
}
