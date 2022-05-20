import {IDayOffRaw, IDayRaw} from "day-types";

export interface IGetDaysInRange {
    getDaysInRange: IDayRaw[];
}

export interface ICreateDayOff {
    createDayOff: IDayOffRaw;
}

export interface IDeleteDayOff {
    deleteDayOff: IDayOffRaw;
}