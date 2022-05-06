import React from 'react';
import { makeRows } from '../service/tableService';
import Day from './Day';
import { useQuery } from '@apollo/client';
import { GET_APPOINTMENTS_BY_DAYS } from '../../../gql/query/appointment';
import { InlineLoading } from 'carbon-components-react';
import { css } from '@emotion/css';
import { IAppointmentGroupByDateQuery } from '../../../types/appointment-types';
import { IBookModalState } from '../index';
import { IEmployeeId } from '../../../types/employee-types';
import { DayCode } from '../../../types/date-types';

const loadingCSS = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
`;

interface TabTemplateProps {
    selected: boolean;
    openModal: (bookModalState: IBookModalState) => void;
    employeeID: IEmployeeId;
    dateFrom: DayCode;
    dateTo: DayCode;
}

const TabTemplate: React.FC<TabTemplateProps> = ({ selected, openModal, employeeID, dateFrom, dateTo }) => {
    const { data: appointmentsByDays, loading } = useQuery<IAppointmentGroupByDateQuery>(GET_APPOINTMENTS_BY_DAYS, {
        variables: {
            AppointmentsByDatesInput: {
                employee: employeeID,
                dateFrom: dateFrom,
                dateTo: dateTo
            }
        }
    });

    if (loading || !appointmentsByDays) {
        return <InlineLoading className={loadingCSS} description="Загрузка" />;
    }

    return (
        <>
            {!selected &&
                appointmentsByDays.getAppointmentsByDate.map(({ date, appointments }) => {
                    const rows = makeRows(appointments);
                    return <Day key={date} openModal={openModal} rows={rows} dayCode={date} />;
                })}
        </>
    );
};

export default TabTemplate;
