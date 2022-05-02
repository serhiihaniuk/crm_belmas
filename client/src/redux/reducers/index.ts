import { combineReducers } from 'redux';
import { employeeReducer } from './employee-reducer';
import { dateReducer } from './date-reducer';

export const rootReducer = combineReducers({
    employee: employeeReducer,
    date: dateReducer
});

export type AppState = ReturnType<typeof rootReducer>;

