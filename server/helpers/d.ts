import {DayCode, Iday, Imonth, Iyear, MonthCode} from 'date-types';

function prepareDaysCodesInMonth(monthCode: MonthCode): DayCode[] {
    const [year, month] = monthCode.split('-') as [Iyear, Imonth];
    const firstDay = new Date(+year, +month - 1, 1).getDate();
    const lastDay = new Date(+year, +month, 0).getDate();

    const dayCodes: DayCode[] = [];

    for (let i = firstDay; i <= lastDay; i++) {
        const day = String(i).padStart(2, '0') as Iday;
        dayCodes.push(`${year}-${month}-${day}`);
    }

    return dayCodes;
}


function dateCodeToTimestamp(dateCode: MonthCode | DayCode): number {

    const [year, month, day] = dateCode.split('-');
    const date = new Date(+year, +month - 1, +day || 1, 0, 0);
    return date.getTime();
};

function prepareCustomTimestamp(dayCode: DayCode): number {
    return Number(dayCode.split('-').join(''))

};


function mapMonthCodesBetweenDates<T extends DayCode | MonthCode>(from: T, to: T): MonthCode[] {
    const [fromYear, fromMonth] = from.split("-")
    const [toYear, toMonth] = to.split("-")
    const monthCodes: MonthCode[] = []
    for (let i = +fromYear; i <= +toYear; i++) {
        for (let j = 1; j <= 12; j++) {
            if (i === +fromYear && j < +fromMonth) continue
            if (i === +toYear && j > +toMonth) break

            const month = String(j).padStart(2, "0")
            monthCodes.push(`${i}-${month}` as MonthCode)
        }
    }

    return monthCodes
}


export default {prepareDaysCodesInMonth, dateCodeToTimestamp, prepareCustomTimestamp, mapMonthCodesBetweenDates}