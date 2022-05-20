import React, {useCallback, useEffect, useMemo, useState} from 'react';
import BookModal from './components/BookModal/BookModal';
import { pageWrapper } from '../../globalStyles';
import { Tab, Tabs } from 'carbon-components-react';
import { ApolloConsumer, useQuery } from '@apollo/client';
import { GET_EMPLOYEES } from '../../gql/query/employees';
import TabTemplate from './components/TabTemplate';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IApolloClient } from '../../index';
import d from '../../helpers/utils';
import { IGetEmployeesQuery } from '../../types/employee-types';
import { IAppointment } from '../../types/appointment-types';
import { DayCode } from '../../types/date-types';
import DayOffModal from './components/DayOffModal';
import {OccupationType} from "procedure-types";

export type IEditingAppointment = {
    selectedAppointment: IAppointment;
    isEditingExisting: true;
    day: DayCode;
};

export type IAddingNewAppointment = {
    day: DayCode;
    isEditingExisting: false;
};

export type IBookModalState = IEditingAppointment | IAddingNewAppointment;

export interface IDayOffModalState {
    dayCode: DayCode;
    employeeID: string;
    dayOffID: string | undefined
}

const Book: React.FC = () => {
    const [isOpenDayOffModal, setIsOpenDayOffModal] = useState(false);
    const [isOpenBookModal, setIsOpenBookModal] = useState(false);
    const [bookModalState, setBookModalState] = useState<IBookModalState>({
        day: '' as DayCode,
        isEditingExisting: false
    });

    const [dayOffModalState, setDayOffModalState] = useState<IDayOffModalState>({
        dayCode: '2022-01-01',
        employeeID: '',
        dayOffID: undefined
    })

    const [employeeID, setEmployeeID] = useState<string>('');
    const [employeeOccupation, setEmployeeOccupation] = useState<OccupationType>('none')
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const { from, to } = useTypedSelector((state) => state.date);

    const { data: employeesData } = useQuery<IGetEmployeesQuery>(GET_EMPLOYEES, {
        variables: {
            query: {
                role: 'master'
            }
        }
    });

    useEffect(() => {
        if (employeesData) {
            setEmployeeID(employeesData?.getEmployees[selectedTab]._id);
            setEmployeeOccupation(employeesData?.getEmployees[selectedTab].occupation)
        }
    }, [employeesData, selectedTab]);

    const openModal = useCallback((BookModalState: IBookModalState) => {
        setIsOpenBookModal(true);
        setBookModalState(BookModalState);
    },[])

    const openDayOffModal = useCallback((dayOffModalState: IDayOffModalState) => {
        setIsOpenDayOffModal(true)
        setDayOffModalState(dayOffModalState)
    },[])
    const closeModal = useCallback(() => {
        setIsOpenBookModal(false);
    },[])

    const closeDayOffModal = useCallback(() => {
        setIsOpenDayOffModal(false)
    },[])

    const tabsContent = useMemo( () => {
        if(employeesData?.getEmployees) {
            return employeesData.getEmployees.map((employee) => {
                return (
                    <Tab
                        key={employee._id}
                        id={employee._id}
                        label={employee.name}
                        renderContent={({ selected }) => {
                            return (
                                <>
                                    {selected && (
                                        <TabTemplate
                                            key={employee._id}
                                            employeeID={employee._id}
                                            dateFrom={d.DateObjectToDayCode(from)}
                                            dateTo={d.DateObjectToDayCode(to)}
                                            openModal={openModal}
                                            openDayOffModal={openDayOffModal}
                                        />
                                    )}
                                </>
                            );
                        }}
                    />
                );
            })
        }
    },[employeesData])
    return (
        <>
            <div className={pageWrapper}>
                {employeesData && (
                    <Tabs
                        selected={selectedTab}
                        onSelectionChange={(idx) => {
                            setSelectedTab(idx);
                        }}
                    >
                        {tabsContent}
                    </Tabs>
                )}
            </div>
            <ApolloConsumer>
                {(client) => (
                    <>
                        <BookModal
                            apolloClient={client as IApolloClient}
                            closeModal={closeModal}
                            isOpen={isOpenBookModal}
                            bookModalState={bookModalState}
                            employeeID={employeeID}
                            employeeOccupation={employeeOccupation}

                        />
                        <DayOffModal
                            apolloClient={client as IApolloClient}
                            closeModal={closeDayOffModal}
                            isOpen={isOpenDayOffModal}
                            dayOffModalState={dayOffModalState}
                        />
                    </>
                )}
            </ApolloConsumer>
        </>
    );
};

export default Book;
