import React, {useState} from 'react';
import RevenueTable from './tables/RevenueTable';
import { Tab, Tabs } from 'carbon-components-react';
import {currentMonthFirstAndListDayTimestamp} from "../../../helpers/utils";
import {useQuery} from "@apollo/client";
import {GET_EMPLOYEES} from "../../../gql/query/employees";
import DetailedViewTab from "./DetailedViewTab";


const DetailedView: React.FC = () => {
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
  return (
    <>
      <Tabs
          selected={selectedTab}
          onSelectionChange={(idx) => {
              setSelectedTab(idx);
          }}
      >
        {
          employeesData.getEmployees.map((employee: any, idx: any) => {
            return (
                <Tab
                    key={employee._id}
                    id={employee._id}
                    label={employee.name}
                    renderContent={({ selected }) => {
                      return (
                          <>
                            {selected && <DetailedViewTab
                                employee={employee._id}
                                dateFrom={firstDayTimestamp}
                                dateTo={lastDayTimestamp}/>
                            }
                          </>
                      );

                    }}
                />);
          })
        }
      </Tabs>
    </>
  );
};

export default DetailedView;
