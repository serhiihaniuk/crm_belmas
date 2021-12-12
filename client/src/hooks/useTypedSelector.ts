import { AppState } from '../redux/reducers';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector

