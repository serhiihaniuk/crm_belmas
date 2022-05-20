import { IScheduleAppointment } from '../../../types/appointment-types';
import { HourCode } from '../../../types/date-types';
import { IAppointmentRaw } from '../../../../../@types/appointment-types';

export const headers = [
    {
        key: 'date',
        header: 'Время'
    },
    {
        key: 'client',
        header: 'Имя'
    },
    {
        key: 'procedureName',
        header: 'Процедура'
    }
];

export function makeScheduleTableRows(appointments: IAppointmentRaw[]): IScheduleAppointment[] {
    return appointments.map((appointment) => {
        const date = new Date(Number(appointment.date));
        const minutes = `${date.getMinutes()}`.padStart(2, '0');
        const hours = date.getHours();
        const time = (hours + ':' + minutes) as HourCode;
        return {
            id: appointment._id,
            time: time,
            client: appointment.client,
            procedure: appointment.procedure,
            procedureName: appointment.procedure.procedure,
            cash: appointment.cash || 0,
            cashless: appointment.cashless || 0,
            description: appointment.description || '',
            employee: appointment.employee._id,
            status: appointment.status,
            paymentMethod: appointment.paymentMethod || ''
        };
    });
}
