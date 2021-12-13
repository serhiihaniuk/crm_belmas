import {IAppointment} from "../../../types/appointment-types";


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

export const rows = [
    {
        id: 'a',

        time: '12:00',
        name: 'Юлия',
        procedure: 'Маникюр',
    },
    {
        id: 'b',

        time: '12:00',
        name: 'Юлия',
        procedure: 'Маникюр',
    },
    {
        id: 'c',

        time: '12:00',
        name: 'Юлия',
        procedure: 'Маникюр',
    },
    {
        id: 'sadf',

        time: '12:00',
        name: 'Юлия',
        procedure: 'Маникюр',
    },
    {
        id: 'sdfasf',
        time: '12:00',
        name: 'Юлия',
        procedure: 'Маникюр',
    },
];

export interface IScheduleTableRow {
    id: string;
    date: string;
    client: string;
    procedure: string;
    price: number | null;
    description: string | null;
    timestamp: Date;
    employee: {
    _id: string
};}


export function makeScheduleTableRows(appointments: IAppointment[]): IScheduleTableRow[] {
    return appointments.map(appointment => {
            const date = new Date(Number(appointment.date));
            const minutes = `${date.getMinutes()}`.padStart(2, '0');
            const hours = date.getHours();
            const time = hours + ':' + minutes;
            return {
                id: appointment._id,
                date: time,
                client: appointment.client,
                procedure: appointment.procedure,
                price: appointment.price,
                description: appointment.description,
                timestamp: appointment.date,
                employee: appointment.employee
            };
        }
    );
}
