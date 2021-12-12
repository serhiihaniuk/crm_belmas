import React, { useEffect, useState } from 'react';
import { makeRows, splitAppointmentsByDays } from '../service/tableService';
import Day from './Day';
import { useQuery } from '@apollo/client';
import { GET_APPOINTMENTS } from '../../../gql/query/appointment';
import { InlineLoading } from 'carbon-components-react';
import { css } from '@emotion/css';

const loadingCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;`

const TabTemplate: React.FC<any> = ({ selected, openModal, employee, dateFrom, dateTo }) => {
  const [days, setDays] = useState<any>([]);
  const { data, loading } = useQuery(GET_APPOINTMENTS, {
    variables: {
      employee: employee,
      dateFrom: String(dateFrom),
      dateTo: String(dateTo)
    }
  });
  useEffect(() => {
    if (data) {
      setDays(Object.entries(splitAppointmentsByDays(data.getAppointments, dateFrom, dateTo)));
    }
  }, [data, dateFrom, dateTo]);
  if (loading) {
    return <InlineLoading className={loadingCSS} description='Загрузка' />
  }
  return (<>
    {!selected && days.map(([dayName, appointments]: any) => {
      const rows = makeRows(appointments);
      return <Day key={dayName} openModal={openModal} rows={rows} day={dayName} />;
    })
    }
  </>);
};

export default TabTemplate;
