import { IAppointmentResponse } from '../../../types/appointment-types';

export interface IAppointment {
    id: string;
    client: string;
    date: string;
    procedure: string;
    description: string | null;
    instagram: string | null;
    timestamp: Date;
    status: string;
    employee: {
        _id: string;
    };
}

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
        key: 'procedure',
        header: 'Процедура'
    }
];

export function makeRows(appointments: IAppointmentResponse[]): IAppointment[] {
    return appointments.map((appointment) => {
        const date = new Date(Number(appointment.date));
        const hours = date.getHours();
        const minutes = `${date.getMinutes()}`.padStart(2, '0');
        const time = hours + ':' + minutes;
        return {
            id: appointment._id,
            date: time,
            client: appointment.client,
            procedure: appointment.procedure,
            description: appointment.description,
            instagram: appointment.instagram,
            timestamp: appointment.date,
            employee: appointment.employee,
            status: appointment.status
        };
    });
}

export function mapTimeToTimepicker() {
    const times = [];
    for (let i = 8; i <= 20; i++) {
        times.push(`${i}:00`);
        times.push(`${i}:15`);
        times.push(`${i}:30`);
        times.push(`${i}:45`);
    }
    return times;
}
