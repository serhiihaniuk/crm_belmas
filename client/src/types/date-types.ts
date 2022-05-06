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
    | '04'
    | '05'
    | '06'
    | '07'
    | '08'
    | '09'
    | '10'
    | '11'
    | '12'
    | '13'
    | '14'
    | '15'
    | '16'
    | '17'
    | '18'
    | '19'
    | '20'
    | '21'
    | '22'
    | '23'
    | '24'
    | '25'
    | '26'
    | '27'
    | '28'
    | '29'
    | '30'
    | '31';

type Imonth = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type Iyear = '2021' | '2022' | '2023' | '2024' | '2025' | '2026' | '2027' | '2028' | '2029' | '2030';
type Ihour = '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21';
type Iminutes = '00' | '15' | '30' | '45';

export type MonthCode = `${Iyear}-${Imonth}`;
export type DayCode = `${Iyear}-${Imonth}-${Iday}`;
export type HourCode = `${Ihour}:${Iminutes}`;
