import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_APPOINTMENTS_TOTAL_PRICE
} from '../../../gql/query/appointment';
import {InlineLoading, Tag} from 'carbon-components-react';
import {css} from "@emotion/css";

interface ISummaryViewProps {}

interface ITotalPriceQuery {
  getAppointmentsTotalPrice: {
    cash: number;
    cashless: number;
  };
}
const loadingCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;`

const SummaryView: React.FC<ISummaryViewProps> = () => {
  const { data, loading } = useQuery<ITotalPriceQuery>(
    GET_APPOINTMENTS_TOTAL_PRICE,
    {
      variables: {
        dateFrom: '2021-12-01',
        dateTo: '2021-12-22'
      }
    }
  );
    if (loading || !data) {
        return <InlineLoading className={loadingCSS} description='Загрузка'/>
    }
  return (
    <>
      <div>
        <Tag>Общий доход:</Tag>
        <Tag>{data.getAppointmentsTotalPrice.cash} zł</Tag>
        <Tag>{data.getAppointmentsTotalPrice.cashless} zł</Tag>
      </div>
    </>
  );
};

export default SummaryView;
