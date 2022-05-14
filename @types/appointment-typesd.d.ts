import { DayCode, HourCode, MonthCode, Timestamp } from './date-types';


export interface IAppointmentRaw {
    _id: string;
    client: string;
    date: Date;
    monthCode: MonthCode;
    dayCode: DayCode;
    time: HourCode;
    procedure: string;
    instagram?: string;
    description?: string;
    employee: {
        _id: string;
    };
    creator: {
        _id: string;
    };
    month: {
        _id: string;
    }
    status: string;
    paymentMethod?: string;
    cash: number;
    cashless: number;
}

