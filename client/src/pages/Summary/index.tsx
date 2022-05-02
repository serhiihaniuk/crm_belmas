import React from 'react';
import DetailedView from './components/DetailedView';
import { pageWrapper } from '../../globalStyles';

const Summary = () => {
    return (
        <div className={pageWrapper}>
            <DetailedView />
        </div>
    );
};

export default Summary;
