import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_APPOINTMENTS_BY_DAYS } from '../../../gql/query/appointment';
import { InlineLoading } from 'carbon-components-react';
import { css } from '@emotion/css';
import { IRevenueTableRow, makeRevenueRows } from '../service/summaryService';
import RevenueTable from './tables/RevenueTable';
import { IAppointmentGroupByDateQuery } from '../../../types/appointment-types';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import d from '../../../helpers/utils';

const loadingCSS = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
`;

interface DetailedViewTabProps {
    employeeID: string;
}

const DetailedViewTab: React.FC<DetailedViewTabProps> = ({ employeeID }) => {
    const [rowsData, setRowsData] = useState<IRevenueTableRow[]>([]);
    const { from, to } = useTypedSelector((state) => state.date);

    const { data: appointmentsByDays, loading } = useQuery<IAppointmentGroupByDateQuery>(GET_APPOINTMENTS_BY_DAYS, {
        variables: {
            AppointmentsByDatesInput: {
                employee: employeeID,
                dateFrom: d.DateObjectToDayCode(from),
                dateTo: d.DateObjectToDayCode(to)
            }
        }
    });

    useEffect(() => {
        if (appointmentsByDays) {
            setRowsData(makeRevenueRows(appointmentsByDays.getAppointmentsByDate));
        }
    }, [appointmentsByDays]);
    if (loading) {
        return <InlineLoading className={loadingCSS} description="Загрузка" />;
    }
    return (
        <>
            <RevenueTable rowData={rowsData} />
        </>
    );
};

export default DetailedViewTab;
