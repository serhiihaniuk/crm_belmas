import { combineReducers } from 'redux';
import { employeeReducer } from './employee-reducer';
import { dateReducer } from './date-reducer';
import { ErrorReducer } from './error-reducer';

export const rootReducer = combineReducers({
    employee: employeeReducer,
    date: dateReducer,
    error: ErrorReducer
});

export type AppState = ReturnType<typeof rootReducer>;

