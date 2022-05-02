export interface IDateFormat {
    YearFormat: 'YYYY';
    MonthFormat: 'MM';
    DayFormat: 'DD';
    HoursFormat: 'HH';
    MinutesFormat: 'mm';
}


export type DateFormat = IDateFormat[keyof IDateFormat];
export type IDate = {
    [ key in DateFormat]: string;
}