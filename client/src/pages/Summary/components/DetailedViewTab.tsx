import React, {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {GET_APPOINTMENTS} from '../../../gql/query/appointment';
import {InlineLoading} from 'carbon-components-react';
import {css} from '@emotion/css';
import {splitAppointmentsByDays} from "../../../helpers/appointments-helpers";
import {currentMonthFirstAndListDayTimestamp} from "../../../helpers/utils";
import SummaryTable from "./tables/SummaryTable";
import {makeRevenueRows} from "../service/summaryService";
import RevenueTable from "./tables/RevenueTable";

const loadingCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;`

const DetailedViewTab: React.FC<any> = ({selected, openModal, employee}) => {
    const [rowsData, setRowsData] = useState<any>([]);

    const {firstDayTimestamp, lastDayTimestamp} = currentMonthFirstAndListDayTimestamp();
    const {data, loading} = useQuery(GET_APPOINTMENTS, {
        variables: {
            employee: employee,
            dateFrom: String(firstDayTimestamp),
            dateTo: String(lastDayTimestamp + 86400000)
        }
    });
    useEffect(() => {
        if (data) {
            setRowsData(makeRevenueRows(data.getAppointments, firstDayTimestamp, lastDayTimestamp))
        }
    }, [data])
    if (loading) {
        return <InlineLoading className={loadingCSS} description='Загрузка'/>
    }
    return (<>
        <RevenueTable rowData={rowsData}/>
    </>);
};

export default DetailedViewTab;


