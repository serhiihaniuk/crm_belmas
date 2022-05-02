import { DateActionTypes, ISetDateAction, ISetDateModalAction } from '../reducers/date-reducer';
import { IDate } from '../../types/date-types';

const setDate = (from: IDate, to: IDate): ISetDateAction => ({
    type: DateActionTypes.SET_DATE,
    payload: {
        from,
        to
    }
});

export const toggleDateModal = (action: boolean): ISetDateModalAction => {
    const actionType = action ? DateActionTypes.OPEN_MODAL : DateActionTypes.CLOSE_MODAL;
    return {
        type: actionType
    };
};
