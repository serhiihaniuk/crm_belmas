import React, { useState } from 'react';
import { Tab, Tabs } from 'carbon-components-react';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEES } from '../../../gql/query/employees';
import DetailedViewTab from './DetailedViewTab';
import { IGetEmployeesQuery } from '../../../types/employee-types';
import SummaryView from './SummaryView';

const DetailedView: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const { data: employeesData, loading } = useQuery<IGetEmployeesQuery>(GET_EMPLOYEES, {
        variables: {
            query: {
                position: 'admin'
            }
        }
    });
    if (loading || !employeesData) return null;
    return (
        <>
            <Tabs
                selected={selectedTab}
                onSelectionChange={(idx) => {
                    setSelectedTab(idx);
                }}
            >
                <Tab
                    id={'general-tab'}
                    label={'Сводная'}
                    renderContent={({ selected }) => {
                        return <>{selected && <SummaryView />}</>;
                    }}
                />
                <Tab
                    id={'general-tab'}
                    label={'Всего'}
                    renderContent={({ selected }) => {
                        return <>{selected && <DetailedViewTab employee={null} />}</>;
                    }}
                />
                {employeesData.getEmployees.map((employee) => {
                    return (
                        <Tab
                            key={employee._id}
                            id={employee._id}
                            label={employee.name}
                            renderContent={({ selected }) => {
                                return <>{selected && <DetailedViewTab employee={employee._id} />}</>;
                            }}
                        />
                    );
                })}
            </Tabs>
        </>
    );
};

export default DetailedView;
