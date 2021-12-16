import {IAppointment, IAppointmentGroupByDate} from "../../../types/appointment-types";
import {splitAppointmentsByDays} from "../../../helpers/appointments-helpers";

export const headers = [
    {
        key: 'name',
        header: '__',
    },
    {
        key: 'cash',
        header: 'Наличные',
    },
    {
        key: 'cashless',
        header: 'Терминал',
    },
];


export const revenueTableHeaders = [
    {
        key: 'date',
        header: 'Дата',
    },
    {
        key: 'cash',
        header: 'Наличные',
    },
    {
        key: 'cashless',
        header: 'Терминал',
    },
];

export interface IRevenueTableRow {
    id: string;
    date: string;
    cash: number;
    cashless: number;
}

export const makeRevenueRows = (appointmentsByDays: IAppointmentGroupByDate[]): IRevenueTableRow[] => {

    const earningsByDays = appointmentsByDays.map(({date, appointments}) => {
        const splitDateString = date.split('-')
        const formattedDate = `${splitDateString[2]}.${splitDateString[1]}`;
        const res = appointments.reduce((acc, appo) => {
            if (!appo.price) {
                return acc
            }
            const cash = appo.paymentMethod === 'cash' ? appo.price : 0;
            const cashless = appo.paymentMethod === 'cashless' ? appo.price : 0;
            return {
                cash: acc.cash + cash,
                cashless: acc.cashless + cashless,
            }

        }, {cash: 0, cashless: 0});
        return {
            id: date,
            date: formattedDate,
            cash: res.cash,
            cashless: res.cashless,
        }

    });
    return earningsByDays.map(earning => ({
        id: earning.date,
        date: earning.date,
        cash: earning.cash,
        cashless: earning.cashless,
    }));

}
