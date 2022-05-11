import { IAppointment, IAppointmentRaw } from '../../../types/appointment-types';
import { HourCode } from '../../../types/date-types';

export const headers = [
    {
        key: 'time',
        header: 'Время'
    },
    {
        key: 'client',
        header: 'Имя'
    },
    {
        key: 'procedure',
        header: 'Процедура'
    }
];

export function makeRows(appointments: IAppointmentRaw[]): IAppointment[] {
    return appointments.map((appointment) => {
        return {
            id: appointment._id,
            time: appointment.time,
            client: appointment.client,
            procedure: appointment.procedure,
            description: appointment.description,
            instagram: appointment.instagram,
            date: appointment.date,
            employee: appointment.employee,
            status: appointment.status
        };
    });
}

export function mapTimeToTimepicker(): HourCode[] {
    const times: HourCode[] = [];
    for (let i = 8; i <= 20; i++) {
        times.push(`${i}:00` as HourCode);
        times.push(`${i}:15` as HourCode);
        times.push(`${i}:30` as HourCode);
        times.push(`${i}:45` as HourCode);
    }
    return times;
}
