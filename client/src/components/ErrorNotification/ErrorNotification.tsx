import React from 'react';
import { ToastNotification } from 'carbon-components-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/css';

const style = css`
    .bx--toast-notification--error {
        position: fixed;
        bottom: 10px;
        right: 10px;
    }
`;
const ErrorNotification = () => {
    const error = useTypedSelector((state) => state.error);
    const dispatch = useDispatch();
    const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

    if (!error.error) return null;

    setTimeout(clearError, 5000);

    return (
        <>
            <div className={style}>
                <ToastNotification
                    caption={new Date().toLocaleString()}
                    iconDescription="describes the close button"
                    subtitle={error.message}
                    timeout={5000}
                    title="Apollo Error"
                />
            </div>
        </>
    );
};

export default ErrorNotification;
