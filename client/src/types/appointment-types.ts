import { DayCode, HourCode, MonthCode, Timestamp } from './date-types';
import {IAppointmentRaw} from '../../../@types/appointment-types'

export type IAppointment = {
    id: string;
    date: number;
    employee: string;
} & Pick<
    IAppointmentRaw,
    | 'client'
    | 'procedure'
    | 'description'
    | 'time'
    | 'instagram'
    | 'status'
    | 'paymentMethod'
    | 'cash'
    | 'cashless'
>

export type IScheduleAppointment = Required<Omit<IAppointment, 'instagram' | 'date'>>;

export interface IAppointmentGroup {
    _id: {
        count: number;
        appointments: IAppointmentRaw[];
    };
}

export interface IAppointmentGroupByDate {
    date: DayCode;
    appointments: IAppointmentRaw[];
}

export interface IAppointmentGroupByDateQuery {
    getAppointmentsByDate: IAppointmentGroupByDate[];
}
