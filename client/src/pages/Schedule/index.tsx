import React, {useEffect, useState} from 'react';
import Day from './components/Day';
import ScheduleModal from './components/ScheduleModal';
import {pageWrapper} from '../../globalStyles';
import {useQuery} from "@apollo/client";
import {GET_APPOINTMENTS} from "../../gql/query/appointment";
import {InlineLoading} from "carbon-components-react";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {splitAppointmentsByDays} from "../../helpers/appointments-helpers";
import {currentMonthFirstAndListDayTimestamp} from "../../helpers/utils";
import {makeScheduleTableRows} from "./service/tableService";

const Schedule = () => {
    const [open, setOpen] = React.useState(false);
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
    const {firstDayTimestamp, lastDayTimestamp} = currentMonthFirstAndListDayTimestamp();
    const employee = useTypedSelector(state => state.employee._id);
    const {data, loading} = useQuery(GET_APPOINTMENTS, {
        variables: {
            employee: employee,
            dateFrom: String(firstDayTimestamp),
            dateTo: String(lastDayTimestamp)
        }
    });

    const [days, setDays] = useState<any>([]);
    useEffect(() => {
        if (data) {
            setDays(Object.entries(splitAppointmentsByDays(data.getAppointments, firstDayTimestamp, lastDayTimestamp)));
        }
    }, [data, firstDayTimestamp, lastDayTimestamp]);
    if (loading) {
        return <InlineLoading description='Загрузка'/>
    }
    return (
        <>
            <div className={pageWrapper}>
                {days.map(([dayName, appointments]: any) => {
                const rows = makeScheduleTableRows(appointments);
                return <Day key={dayName} openModal={openModal} rows={rows} day={dayName} />;
            })}
            </div>
            <ScheduleModal
                isOpen={open}
                closeModal={closeModal}
                name={'Рассчитать'}
            />
        </>
    );
};

export default Schedule;
