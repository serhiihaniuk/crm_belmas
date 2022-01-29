
export function currentMonthFirstAndListDayTimestamp(): { firstDayTimestamp: number, lastDayTimestamp: number } {
    const date = new Date();
    const firstDayTimestamp = dateToTimestamp(date.getFullYear(), date.getMonth(), 1);
    const lastDayTimestamp = dateToTimestamp(date.getFullYear(), date.getMonth() + 1, 0);
    return {firstDayTimestamp, lastDayTimestamp};
}

export const dateToTimestamp = (year: number, month: number, day: number, hours: number = 0, minutes: number = 0): number => {
    const monthIndex = month - 1;
    const date = new Date(year, monthIndex, day, hours, minutes);
    return date.getTime();
};


export function getDayName(dateString: string): string | Date {

    const dateArr = dateString.split('-');
    const date = new Date(+dateArr[0], +dateArr[1], +dateArr[2]);
    const dayName = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][date.getDay()];
    const monthName = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][+dateArr[1] - 1];
    const day = date.getDate() + ' ' + monthName + ', ' + dayName;
    return String(day);
}

// timestamp to YYYY-MM-DD-HH-MM
type YearFormat = 'YYYY';
type MonthFormat = 'MM';
type DayFormat = 'DD';
type HoursFormat = 'HH'
type MinutesFormat = 'mm'

type DateFormat = YearFormat | MonthFormat | DayFormat | HoursFormat | MinutesFormat;
export function timestampToDate(timestamp: number, format: any = 'YYYY-MM-DD-HH-mm', splitter: string = '-'): string {
    const date = new Date(timestamp);
    const dateObject = {
        'YYYY': String(date.getFullYear()),
        'MM': String(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
        'DD': String(date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
        'HH': String(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()),
        'mm': String(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
    };
    const requiredValues: DateFormat[] = format.split('-');
    return requiredValues.map(value => dateObject[value]).join(splitter);
    }
