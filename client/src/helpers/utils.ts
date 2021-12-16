
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

