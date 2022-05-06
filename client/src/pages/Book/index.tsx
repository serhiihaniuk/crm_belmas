import React, { useEffect, useState } from 'react';
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

const Book: React.FC = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [bookModalState, setBookModalState] = useState<IBookModalState>({
        day: '' as DayCode,
        isEditingExisting: false
    });
    const [employee, setEmployee] = useState<string>('');
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
            setEmployee(employeesData?.getEmployees[selectedTab]._id);
        }
    }, [employeesData, selectedTab]);

    const openModal = (BookModalState: IBookModalState) => {
        setIsOpenModal(true);
        setBookModalState(BookModalState);
    };
    const closeModal = () => {
        setIsOpenModal(false);
    };
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
                        {employeesData.getEmployees.map((employee) => {
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
                                                        selected={selected}
                                                        employeeID={employee._id}
                                                        dateFrom={d.DateObjectToDayCode(from)}
                                                        dateTo={d.DateObjectToDayCode(to)}
                                                        openModal={openModal}
                                                    />
                                                )}
                                            </>
                                        );
                                    }}
                                />
                            );
                        })}
                    </Tabs>
                )}
            </div>
            <ApolloConsumer>
                {(client) => (
                    <BookModal
                        apolloClient={client as IApolloClient}
                        closeModal={closeModal}
                        isOpen={isOpenModal}
                        bookModalState={bookModalState}
                        employee={employee}
                    />
                )}
            </ApolloConsumer>
        </>
    );
};

export default Book;
