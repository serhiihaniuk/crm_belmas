import React, { useState } from 'react';
import {InlineLoading, Tab, Tabs} from 'carbon-components-react';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEES } from '../../../gql/query/employees';
import DetailedViewTab from './DetailedViewTab';
import { IGetEmployeesQuery } from '../../../types/employee-types';
import SummaryView from './SummaryView';
import {loadingCSS} from "../../../globalStyles";

const DetailedView: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const { data: employeesData, loading, refetch } = useQuery<IGetEmployeesQuery>(GET_EMPLOYEES, {
        variables: {
            query: {
                role: 'master'
            }
        }
    });
    if (loading) return <InlineLoading description="Загрузка" className={loadingCSS} />;
    if (!employeesData) return <button onClick={refetch}>Refetch</button>

    return (
        <>
            <Tabs
                selected={selectedTab}
                onSelectionChange={(idx) => {
                    setSelectedTab(idx);
                }}
            >
                <Tab
                    id={'general-tab1'}
                    label={'Сводная'}
                    renderContent={({ selected }) => {
                        return <>{selected && <SummaryView />}</>;
                    }}
                />
                <Tab
                    id={'general-tab2'}
                    label={'Всего'}
                    renderContent={({ selected }) => {
                        return <>{selected && <DetailedViewTab />}</>;
                    }}
                />
                {employeesData.getEmployees.map((employee) => {
                    return (
                        <Tab
                            key={employee._id}
                            id={employee._id}
                            label={employee.name}
                            renderContent={({ selected }) => {
                                return <>{selected && <DetailedViewTab employeeID={employee._id} />}</>;
                            }}
                        />
                    );
                })}
            </Tabs>
        </>
    );
};

export default DetailedView;
