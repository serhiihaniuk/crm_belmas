import React, {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {GET_APPOINTMENTS, GET_APPOINTMENTS_BY_DAYS} from '../../../gql/query/appointment';
import {InlineLoading} from 'carbon-components-react';
import {css} from '@emotion/css';
import {splitAppointmentsByDays} from "../../../helpers/appointments-helpers";
import {currentMonthFirstAndListDayTimestamp} from "../../../helpers/utils";
import SummaryTable from "./tables/SummaryTable";
import {makeRevenueRows} from "../service/summaryService";
import RevenueTable from "./tables/RevenueTable";
import {IAppointmentGroupByDateQuery} from "../../../types/appointment-types";

const loadingCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;`

const DetailedViewTab: React.FC<any> = ({selected, openModal, employee}) => {
    const [rowsData, setRowsData] = useState<any>([]);

    const {firstDayTimestamp, lastDayTimestamp} = currentMonthFirstAndListDayTimestamp();
    const {data: appointmentsByDays, loading} = useQuery<IAppointmentGroupByDateQuery>(GET_APPOINTMENTS_BY_DAYS, {
        variables: {
            AppointmentsByDatesInput: {
                employee: employee,
                dateFrom: "2021-12-01",
                dateTo: "2021-12-22"
            }
        }
    });

    useEffect(() => {
        if (appointmentsByDays) {
            setRowsData(makeRevenueRows(appointmentsByDays.getAppointmentsByDate))
        }
    }, [appointmentsByDays]);
    if (loading) {
        return <InlineLoading className={loadingCSS} description='Загрузка'/>
    }
    return (<>
        <RevenueTable rowData={rowsData}/>
    </>);
};

export default DetailedViewTab;


