import { combineReducers } from 'redux';
import { employeeReducer } from './employee-reducer';

export const rootReducer = combineReducers(
  {
    employee: employeeReducer
  }
)


export type AppState = ReturnType<typeof rootReducer>;
