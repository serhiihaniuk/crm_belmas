import React, { useState } from 'react';
import Day from './components/Day';
import ScheduleModal from './components/ScheduleModal';
import { pageWrapper } from '../../globalStyles';
import { ApolloConsumer, useQuery } from '@apollo/client';
import { GET_APPOINTMENTS_BY_DAYS } from '../../gql/query/appointment';
import { InlineLoading } from 'carbon-components-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IScheduleTableRow, makeScheduleTableRows } from './service/tableService';
import { IAppointmentGroupByDateQuery } from '../../types/appointment-types';

const Schedule = () => {
    const [open, setOpen] = React.useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<IScheduleTableRow | null>(null);
    const { from, to } = useTypedSelector((state) => state.date);
    const openModal = (appointment: IScheduleTableRow) => {
        setOpen(true);
        setSelectedAppointment(appointment);
    };
    const closeModal = () => setOpen(false);

    const employee = useTypedSelector((state) => state.employee._id);
    const { data: appointmentsByDays, loading } = useQuery<IAppointmentGroupByDateQuery>(GET_APPOINTMENTS_BY_DAYS, {
        variables: {
            AppointmentsByDatesInput: {
                employee: employee,
                dateFrom: `${from.YYYY}-${from.MM}-${from.DD}`,
                dateTo: `${to.YYYY}-${to.MM}-${to.DD}`
            }
        }
    });
    if (loading || !appointmentsByDays) {
        return <div className={pageWrapper}><InlineLoading description="Загрузка" /></div>
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
