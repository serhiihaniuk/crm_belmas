import {
    DateActionTypes,
    ISetCurrentMontDateAction,
    ISetDateAction,
    ISetDateModalAction
} from '../reducers/date-reducer';
import { IDate } from '../../types/date-types';

export const setDate = (from: IDate, to: IDate): ISetDateAction => ({
    type: DateActionTypes.SET_DATE,
    payload: {
        from,
        to
    }
});

export const setDateCurrentMonth = (): ISetCurrentMontDateAction => {
    return { type: DateActionTypes.SET_CURRENT_MONTH_FIRST_AND_LAST_DAY };
};
export const setDateNextMonth = (): ISetCurrentMontDateAction => {
    return { type: DateActionTypes.SET_NEXT_MONTH_FIRST_AND_LAST_DAY };
};
export const setDatePrevMonth = (): ISetCurrentMontDateAction => {
    return { type: DateActionTypes.SET_PREVIOUS_MONTH_FIRST_AND_LAST_DAY };
};
export const toggleDateModal = (action: boolean): ISetDateModalAction => {
    const actionType = action ? DateActionTypes.OPEN_MODAL : DateActionTypes.CLOSE_MODAL;
    return {
        type: actionType
    };
};
