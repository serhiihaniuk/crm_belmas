import React, { useState } from 'react';
import Day from './components/Day';
import ScheduleModal from './components/ScheduleModal';
import { pageWrapper } from '../../globalStyles';
import { ApolloConsumer, useQuery } from '@apollo/client';
import { GET_APPOINTMENTS_BY_DAYS } from '../../gql/query/appointment';
import { InlineLoading } from 'carbon-components-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { makeScheduleTableRows } from './service/tableService';
import { IAppointmentGroupByDateQuery, IScheduleAppointment } from '../../types/appointment-types';
import d from '../../helpers/utils';
import { loadingCSS } from '../../globalStyles';

const Schedule = () => {
    const [open, setOpen] = React.useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<IScheduleAppointment | null>(null);
    const { from, to } = useTypedSelector((state) => state.date);
    const openModal = (appointment: IScheduleAppointment) => {
        setOpen(true);
        setSelectedAppointment(appointment);
    };
    const closeModal = () => setOpen(false);

    const employeeID = useTypedSelector((state) => state.employee._id);
    const { data: appointmentsByDays, loading, refetch } = useQuery<IAppointmentGroupByDateQuery>(GET_APPOINTMENTS_BY_DAYS, {
        variables: {
            AppointmentsByDatesInput: {
                employee: employeeID,
                dateFrom: d.DateObjectToDayCode(from),
                dateTo: d.DateObjectToDayCode(to)
            }
        }
    });
    if (loading || !appointmentsByDays) {
        return (
            <div className={pageWrapper}>
                <InlineLoading description="Загрузка" className={loadingCSS} />
            </div>
        );
    }

    if ( !appointmentsByDays) {
        return (
            <div className={pageWrapper}>
                <button onClick={refetch}>Refetch</button>
            </div>
        );
    }
    return (
        <>
            <div className={pageWrapper}>
                {appointmentsByDays.getAppointmentsByDate.map(({ date, appointments }) => {
                    const rows = makeScheduleTableRows(appointments);
                    return <Day key={date} openModal={openModal} rows={rows} day={date} />;
                })}
            </div>
            <ApolloConsumer>
                {(client) => (
                    <ScheduleModal
                        client={client as any}
                        selectedAppointment={selectedAppointment}
                        isOpen={open}
                        closeModal={closeModal}
                    />
                )}
            </ApolloConsumer>
        </>
    );
};

export default Schedule;
