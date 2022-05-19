export interface IDateFormat {
    YearFormat: 'YYYY';
    MonthFormat: 'MM';
    DayFormat: 'DD';
    HoursFormat: 'HH';
    MinutesFormat: 'mm';
}

export type DateFormat = IDateFormat[keyof IDateFormat];
export type IDate = {
    [key in DateFormat]: string;
};

type Iday =
    | '01'
    | '02'
    | '03'


type Imonth = '01' | '02' | '03'
type Iyear = '2022'
type Ihour = '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21';
type Iminutes = '00' | '15' | '30' | '45';

export type MonthCode = `${Iyear}-${Imonth}`;
export type DayCode = `${Iyear}-${Imonth}-${Iday}`;
export type HourCode = `${Ihour}:${Iminutes}`;

export type Timestamp = string