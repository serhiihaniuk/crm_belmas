import React from 'react';
import { useQuery } from '@apollo/client';

import { InlineLoading, Tag } from 'carbon-components-react';
import { css } from '@emotion/css';
import { GET_MONTH_STATS, IMonthTotalQuery } from '../../../gql/query/month';
import { Divider } from '../../../globalStyles';

interface ISummaryViewProps {}

const loadingCSS = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
`;

const SummaryView: React.FC<ISummaryViewProps> = () => {
    const { data, loading } = useQuery<IMonthTotalQuery>(GET_MONTH_STATS, {
        variables: {
            monthCode: '2021-12'
        }
    });

    if (loading || !data) {
        return <InlineLoading className={loadingCSS} description="Загрузка" />;
    }
    const { getMonthStats } = data;
    return (
        <>
            <SummaryViewTable>
                <div className={rowStyle}>
                    <Tag className="desc">Категория</Tag>
                    <Tag className="cash">Нал</Tag>
                    <Tag className="cashless">Безнал</Tag>
                </div>
                <div className={Divider} />
                <SummaryViewTableRow desc={'Общий доход'} cash={getMonthStats.cash} cashless={getMonthStats.cashless} />
                <SummaryViewTableRow
                    desc={'Расходы'}
                    cash={getMonthStats.expensesCash}
                    cashless={getMonthStats.expensesCashless}
                />
                <SummaryViewTableRow
                    desc={'Зарплата'}
                    cash={getMonthStats.salaryCash}
                    cashless={getMonthStats.salaryCashless}
                />
                <div className={Divider} />
                <SummaryViewTableRow
                    desc={'Счет'}
                    cash={getMonthStats.currentCash}
                    cashless={getMonthStats.currentCashless}
                />
            </SummaryViewTable>
        </>
    );
};

const rowStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bx--tag.desc {
    }

    .bx--tag.cash {
        background: #a2b29f;
    }

    .bx--tag.cashless {
        background: #769fcd;
    }

    div:first-child {
        width: 150px;
    }

    div {
        width: 70px;
    }
`;
const SummaryViewTable: React.FC = ({ children }) => {
    return <div style={{ margin: '20px 0' }}>{children}</div>;
};
const SummaryViewTableRow: React.FC<{ desc: string; cash: number | string; cashless: number | string }> = ({
    desc,
    cash,
    cashless
}) => {
    return (
        <div className={rowStyle}>
            <Tag className="desc">{desc}</Tag>
            <Tag className="cash">{cash} zł</Tag>
            <Tag className="cashless">{cashless} zł</Tag>
        </div>
    );
};
export default SummaryView;
