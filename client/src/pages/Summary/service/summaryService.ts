import {IAppointment} from "../../../types/appointment-types";
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

export const makeRevenueRows = (appointments: IAppointment[], startDayTimestamp: number | string, endDayTimestamp: number | string): IRevenueTableRow[] => {
    const appointmentsByDays = splitAppointmentsByDays(appointments, startDayTimestamp, endDayTimestamp);
    const earningsByDays = [];
    for (let day in appointmentsByDays) {
        const dayAppointments = appointmentsByDays[day];
        const dayEarnings = dayAppointments.reduce((acc, appointment) => {
            const price = appointment.price || 0
            acc.cash = appointment.paymentMethod === 'cash' ? acc.cash + price : acc.cash;
            acc.cashless = appointment.paymentMethod === 'cashless' ? acc.cashless + price : acc.cashless;
            return acc;
        }, {
            cash: 0,
            cashless: 0,
        });
        const formattedDay = `${day.split("_")[2]}.${day.split("_")[1]}`
        earningsByDays.push({
            date: formattedDay,
            cash: dayEarnings.cash,
            cashless: dayEarnings.cashless,
        });
    }
    return earningsByDays.map(earning => ({
        id: earning.date,
        date: earning.date,
        cash: earning.cash,
        cashless: earning.cashless,
    }));

}
