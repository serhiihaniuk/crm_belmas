import { DayCode, HourCode, MonthCode } from './date-types';
import {IEmployee} from "./employee-types";
import {MonthRaw} from "./month-types";
import {IProcedureRaw, OccupationType} from "./procedure-types";


export interface IAppointmentRaw {
    _id: string;
    client: string;
    typeOf: OccupationType;
    date: Date;
    monthCode: MonthCode;
    dayCode: DayCode;
    time: HourCode;
    procedure: IProcedureRaw;
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