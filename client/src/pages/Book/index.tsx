import React, { useEffect, useState } from 'react';
import BookModal from './components/BookModal';
import { pageWrapper } from '../../globalStyles';
import { Tab, Tabs } from 'carbon-components-react';
import { ApolloConsumer, useQuery } from '@apollo/client';
import { BookTableRow } from './service/tableService';
import { GET_EMPLOYEES } from '../../gql/query/employees';
import TabTemplate from './components/TabTemplate';
import { currentMonthFirstAndListDayTimestamp } from '../../helpers/utils';

const Book: React.FC = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>({
        day: '',
        appointmentID: ''
    });
    const [employee, setEmployee] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const { firstDayTimestamp, lastDayTimestamp } = currentMonthFirstAndListDayTimestamp();

    const { data: employeesData } = useQuery(GET_EMPLOYEES, {
        variables: {
            query: {
                position: 'admin'
            }
        }
    });

    useEffect(() => {
        if (employeesData) {
            setEmployee(employeesData?.getEmployees[selectedTab]._id);
        }
    }, [employeesData, selectedTab]);

    const openModal = (day: string, selectedAppointment: BookTableRow | undefined, isEditingExisting = false) => {
        setIsOpenModal(true);
        setSelectedAppointment({
            day,
            selectedAppointment,
            isEditingExisting
        });
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
                        {employeesData.getEmployees.map((employee: any, idx: any) => {
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
                                                        employee={employee._id}
                                                        dateFrom={firstDayTimestamp}
                                                        dateTo={lastDayTimestamp}
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
                        apolloClient={client as any}
                        closeModal={closeModal}
                        isOpen={isOpenModal}
                        selectedDay={selectedAppointment}
                        employee={employee}
                    />
                )}
            </ApolloConsumer>
        </>
    );
};

export default Book;
