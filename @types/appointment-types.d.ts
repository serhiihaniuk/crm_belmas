import { DayCode, HourCode, MonthCode, Timestamp } from './date-types';
import {IEmployee} from "./employee-types";
import {MonthRaw} from "./month-types";


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
    employee: IEmployee;
    creator: IEmployee;
    month: MonthRaw;
    status: 'booked' | 'finished'
    paymentMethod?: string;
    cash: number;
    cashless: number;
}

