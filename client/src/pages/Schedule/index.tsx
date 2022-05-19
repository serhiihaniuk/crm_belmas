import React, {useEffect, useState} from 'react';
import Day from './components/Day';
import ScheduleModal from './components/ScheduleModal';
import {loadingCSS, pageWrapper} from '../../globalStyles';
import {ApolloConsumer, useQuery} from '@apollo/client';
import {InlineLoading} from 'carbon-components-react';
import {useTypedSelector} from '../../hooks/useTypedSelector';
import {makeScheduleTableRows} from './service/tableService';
import {IScheduleAppointment} from '../../types/appointment-types';
import d from '../../helpers/utils';
import {IGetDaysInRange} from '../../types/day-types';
import {GET_DAYS_IN_RANGE} from '../../gql/query/days';

const Schedule = () => {
    const [open, setOpen] = React.useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<IScheduleAppointment | null>(null);
    const {from, to} = useTypedSelector((state) => state.date);
    const openModal = (appointment: IScheduleAppointment) => {
        setOpen(true);
        setSelectedAppointment(appointment);
    };
    const closeModal = () => setOpen(false);

    const employeeID = useTypedSelector((state) => state.employee._id);
    const {
        data: appointmentsByDays,
        loading,
        refetch
    } = useQuery<IGetDaysInRange>(GET_DAYS_IN_RANGE, {
        variables: {
            employeeID: employeeID,
            from: d.DateObjectToDayCode(from),
            to: d.DateObjectToDayCode(to)
        }
    });

    useEffect(() => {
        refetch();
    });

    if (loading || !appointmentsByDays) {
        return (
            <div className={pageWrapper}>
                <InlineLoading description="Загрузка" className={loadingCSS}/>
            </div>
        );
    }

    if (!appointmentsByDays) {
        return (
            <div className={pageWrapper}>
                <button onClick={refetch}>Refetch</button>
            </div>
        );
    }
    return (
        <>
            <div className={pageWrapper}>
                {appointmentsByDays.getDaysInRange.map(({dayCode, appointments, isOff}) => {
                    const rows = makeScheduleTableRows(appointments);
                    return <Day key={dayCode} openModal={openModal} rows={rows} day={dayCode} isOff={isOff}/>;
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
