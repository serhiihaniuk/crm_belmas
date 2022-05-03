import { DateFormat, IDate } from '../types/date-types';

export function currentMonthFirstAndListDayTimestamp(): { firstDayTimestamp: number; lastDayTimestamp: number } {
    const date = new Date();
    const firstDayTimestamp = dateToTimestamp(date.getFullYear(), date.getMonth(), 1);
    const lastDayTimestamp = dateToTimestamp(date.getFullYear(), date.getMonth() + 1, 0);
    return { firstDayTimestamp, lastDayTimestamp };
}

export const dateToTimestamp = (
    year: number,
    month: number,
    day: number,
    hours: number = 0,
    minutes: number = 0
): number => {
    //month is 0-based
    const date = new Date(year, month, day, hours, minutes);
    return date.getTime();
};

export function getDayName(dateString: string, onlyMonth?: boolean): string | Date {
    const dateArr = dateString.split('-');
    const date = new Date(+dateArr[0], +dateArr[1] - 1, +dateArr[2]);
    const dayName = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][date.getDay()];
    const monthName = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря'
    ][+dateArr[1] - 1];

    if (onlyMonth) return monthName;

    const day = date.getDate() + ' ' + monthName + ', ' + dayName;
    return String(day);
}

export function getMonthName(month: number | string): string {
    return [
        'monthIndexCantBe = 0',
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ][+month];
}

export function getDateObject(timestamp: number): IDate {
    const date = new Date(timestamp);
    return {
        YYYY: String(date.getFullYear()),
        MM: String(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
        DD: String(date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
        HH: String(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()),
        mm: String(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
}

export function getDateFromDateObject(dateObject: IDate): Date {
    return new Date(+dateObject.YYYY, +dateObject.MM - 1, +dateObject.DD, +dateObject.HH, +dateObject.mm);
}

export function timestampToDate(
    timestamp: number,
    format: string = 'YYYY-MM-DD-HH-mm',
    splitter: string = '-'
): string {
    const dateObject = getDateObject(timestamp);
    const requiredValues: DateFormat[] = format.split('-') as DateFormat[];
    return requiredValues.map((value) => dateObject[value]).join(splitter);
}
