import React from 'react';
import SummaryTable from "./tables/SummaryTable";



const SummaryView = () => {
    return (
        <>
            <SummaryTable name="Доход" />
            <SummaryTable name="Расход" />
            <SummaryTable name="Всего" />
            <SummaryTable name="Текущий баланс" />
        </>
    );
};

export default SummaryView;
