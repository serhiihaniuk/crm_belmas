enum ErrorTypes {
    SET_ERROR = 'SET_ERROR',
    CLEAR_ERROR = 'CLEAR_ERROR'
}

const initialState = {
    error: null,
    message: null
}

interface ErrorState {
    error: any | null,
    message: string | null
}

interface SetErrorAction {
    type: ErrorTypes.SET_ERROR,
    payload: {
        error: any,
        message: string
    }
}

export const createErrorAction = (error: any, message: string): SetErrorAction => ({
    type: ErrorTypes.SET_ERROR,
    payload: {
        error,
        message
    }
});

export const ErrorReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case ErrorTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload.error,
                message: action.payload.message
            }
        case ErrorTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null,
                message: null
            }
        default:
            return state
    }
}