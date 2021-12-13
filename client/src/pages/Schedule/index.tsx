import React, {useEffect, useState} from 'react';
import Day from './components/Day';
import ScheduleModal from './components/ScheduleModal';
import {pageWrapper} from '../../globalStyles';
import {ApolloConsumer, useQuery} from "@apollo/client";
import {GET_APPOINTMENTS} from "../../gql/query/appointment";
import {InlineLoading} from "carbon-components-react";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {splitAppointmentsByDays} from "../../helpers/appointments-helpers";
import {currentMonthFirstAndListDayTimestamp} from "../../helpers/utils";
import {IScheduleTableRow, makeScheduleTableRows} from "./service/tableService";

const Schedule = () => {
    const [open, setOpen] = React.useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<IScheduleTableRow | null>(null);
    const openModal = (appointment: IScheduleTableRow) => {
        setOpen(true);
        setSelectedAppointment(appointment)
    }
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
                    return <Day key={dayName} openModal={openModal} rows={rows} day={dayName}/>;
                })}
            </div>
            <ApolloConsumer>
                {client => <ScheduleModal
                    client={client as any}
                    selectedAppointment={selectedAppointment}
                    isOpen={open}
                    closeModal={closeModal}
                />}
            </ApolloConsumer>

        </>
    );
};

export default Schedule;
