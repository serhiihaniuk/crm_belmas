import {IDayOffRaw, IDayRaw} from '../../../@types/day-types';
export interface IGetDaysInRange {
    getDaysInRange: IDayRaw[];
}

export interface ICreateDayOff {
    createDayOff: IDayOffRaw;
}

export interface IDeleteDayOff {
    deleteDayOff: IDayOffRaw;
}