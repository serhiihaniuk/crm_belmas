import { IDate } from '../../types/date-types';
import { currentMonthFirstAndListDayTimestamp, getDateObject } from '../../helpers/utils';

export enum DateActionTypes {
    SET_DATE = 'SET_DATE',
    OPEN_MODAL = 'OPEN_MODAL',
    CLOSE_MODAL = 'CLOSE_MODAL'
}

interface IDateState {
    from: IDate;
    to: IDate;
}
export interface IDateModuleState extends IDateState {
    isModalOpen: boolean;
}

export type ISetDateAction = {
    type: DateActionTypes.SET_DATE;
    payload: IDateState;
};

export type ISetDateModalAction = {
    type: DateActionTypes.OPEN_MODAL | DateActionTypes.CLOSE_MODAL;
};

type IDateReducerActions = ISetDateAction | ISetDateModalAction;
const { firstDayTimestamp, lastDayTimestamp } = currentMonthFirstAndListDayTimestamp();
const initialState: IDateModuleState = {
    isModalOpen: false,
    from: getDateObject(firstDayTimestamp),
    to: getDateObject(lastDayTimestamp)
};

export const dateReducer = (state = initialState, action: IDateReducerActions) => {
    switch (action.type) {
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