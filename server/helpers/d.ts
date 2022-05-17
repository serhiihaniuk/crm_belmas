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

export default {prepareDaysCodesInMonth}