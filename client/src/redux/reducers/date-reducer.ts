import { IDate } from '../../types/date-types';
import {getDateObject, getMonthFirstAndLastDayTimestamp, getMonthName} from '../../helpers/utils';

export enum DateActionTypes {
    SET_DATE = 'SET_DATE',
    SET_CURRENT_MONTH_FIRST_AND_LAST_DAY = 'SET_CURRENT_MONTH_FIRST_AND_LAST_DAY',
    SET_NEXT_MONTH_FIRST_AND_LAST_DAY = 'SET_NEXT_MONTH_FIRST_AND_LAST_DAY',
    SET_PREVIOUS_MONTH_FIRST_AND_LAST_DAY = 'SET_PREVIOUS_MONTH_FIRST_AND_LAST_DAY',
    OPEN_MODAL = 'OPEN_MODAL',
    CLOSE_MODAL = 'CLOSE_MODAL'
}

export interface IDateState {
    from: IDate;
    to: IDate;
}

export interface IDateModuleState extends IDateState {
    isModalOpen: boolean;
    monthNames?: {
        current: string;
        next: string;
        previous: string;
    };
}

export type ISetDateAction = {
    type: DateActionTypes.SET_DATE;
    payload: IDateState;
};

export type ISetCurrentMontDateAction = {
    type:
        | DateActionTypes.SET_CURRENT_MONTH_FIRST_AND_LAST_DAY
        | DateActionTypes.SET_NEXT_MONTH_FIRST_AND_LAST_DAY
        | DateActionTypes.SET_PREVIOUS_MONTH_FIRST_AND_LAST_DAY;
};

export type ISetDateModalAction = {
    type: DateActionTypes.OPEN_MODAL | DateActionTypes.CLOSE_MODAL;
};

type IDateReducerActions = ISetDateAction | ISetDateModalAction | ISetCurrentMontDateAction;
const { firstDayTimestamp, lastDayTimestamp } = getMonthFirstAndLastDayTimestamp();
const { firstDayTimestamp: prevFirstDayTimestamp, lastDayTimestamp: prevLastDayTimestamp } =
    getMonthFirstAndLastDayTimestamp(-1);
const { firstDayTimestamp: nextFirstDayTimestamp, lastDayTimestamp: nextLastDayTimestamp } =
    getMonthFirstAndLastDayTimestamp(1);
const initialState: IDateModuleState = {
    isModalOpen: false,
    from: getDateObject(firstDayTimestamp),
    to: getDateObject(lastDayTimestamp),
    monthNames: {
        current: getMonthName(getDateObject(firstDayTimestamp).MM),
        previous: getMonthName(getDateObject(prevFirstDayTimestamp).MM),
        next: getMonthName(getDateObject(nextFirstDayTimestamp).MM)
    }
};

export const dateReducer = (state = initialState, action: IDateReducerActions) => {
    switch (action.type) {
        case DateActionTypes.SET_CURRENT_MONTH_FIRST_AND_LAST_DAY:
            return {
                ...state,
                isModalOpen: false,
                from: getDateObject(firstDayTimestamp),
                to: getDateObject(lastDayTimestamp)
            };
        case DateActionTypes.SET_NEXT_MONTH_FIRST_AND_LAST_DAY:
            return {
                ...state,
                isModalOpen: false,
                from: getDateObject(nextFirstDayTimestamp),
                to: getDateObject(nextLastDayTimestamp)
            };
        case DateActionTypes.SET_PREVIOUS_MONTH_FIRST_AND_LAST_DAY:
            return {
                ...state,
                isModalOpen: false,
                from: getDateObject(prevFirstDayTimestamp),
                to: getDateObject(prevLastDayTimestamp)
            };
        case DateActionTypes.SET_DATE:
            return {
                ...state,
                ...action.payload
            };
        case DateActionTypes.OPEN_MODAL:
            return {
                ...state,
                isModalOpen: true
            };
        case DateActionTypes.CLOSE_MODAL:
            return {
                ...state,
                isModalOpen: false
            };
        default:
            return state;
    }
};