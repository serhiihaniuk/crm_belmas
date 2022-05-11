import { DayCode, HourCode, MonthCode, Timestamp } from './date-types';


export interface IAppointmentRaw {
    _id: string;
    client: string;
    date: Timestamp;
    monthCode: MonthCode;
    dayCode: DayCode;
    time: HourCode;
    procedure: string;
    instagram?: string;
    description?: string;
    employee: {
        _id: string;
    };
    status: string;
    paymentMethod?: string;
    cash?: number;
    cashless?: number;
}

export type IAppointment = {
    id: string;
} & Pick<
    IAppointmentRaw,
    | 'client'
    | 'procedure'
    | 'description'
    | 'time'
    | 'instagram'
    | 'status'
    | 'employee'
    | 'date'
    | 'paymentMethod'
    | 'cash'
    | 'cashless'
>;

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
