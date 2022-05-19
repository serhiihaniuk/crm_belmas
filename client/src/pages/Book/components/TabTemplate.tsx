import React, { useEffect } from 'react';
import { makeRows } from '../service/tableService';
import Day from './Day';
import { useQuery } from '@apollo/client';
import { InlineLoading } from 'carbon-components-react';
import { css } from '@emotion/css';
import { IBookModalState, IDayOffModalState } from '../index';
import { IEmployeeId } from '../../../types/employee-types';
import { DayCode } from '../../../types/date-types';
import { GET_DAYS_IN_RANGE } from '../../../gql/query/days';
import { IGetDaysInRange } from '../../../types/day-types';

const loadingCSS = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
`;

interface TabTemplateProps {
    openModal: (bookModalState: IBookModalState) => void;
    openDayOffModal: (dayOffModalState: IDayOffModalState) => void;
    employeeID: IEmployeeId;
    dateFrom: DayCode;
    dateTo: DayCode;
}

const TabTemplate: React.FC<TabTemplateProps> = ({ openModal, openDayOffModal, employeeID, dateFrom, dateTo }) => {
    const {
        data: daysInRange,
        loading,
        refetch
    } = useQuery<IGetDaysInRange>(GET_DAYS_IN_RANGE, {
        variables: {
            from: dateFrom,
            to: dateTo,
            employeeID: employeeID
        }
    });

    useEffect(() => {
        //@todo: setup proper cache merge
        refetch();
    }, [refetch, employeeID]);

    if (loading) {
        return <InlineLoading className={loadingCSS} description="Загрузка" />;
    }

    if (!daysInRange) {
        return <div>Error while loading appointments</div>;
    }

    return (
        <>
            {daysInRange.getDaysInRange.map(({ dayCode, appointments, isOff, dayOff }) => {
                const rows = makeRows(appointments);
                const openDOModalHandler = (dayOffID: string | undefined) => {
                    openDayOffModal({
                        dayCode: dayCode,
                        employeeID: employeeID,
                        dayOffID: dayOffID
                    });
                };
                return (
                    <Day
                        key={dayCode}
                        openModal={openModal}
                        openDayOffModal={openDOModalHandler}
                        rows={rows}
                        dayCode={dayCode}
                        isOff={isOff}
                        dayOffID={dayOff[0]?._id}
                    />
                );
            })}
        </>
    );
};

export default TabTemplate;
