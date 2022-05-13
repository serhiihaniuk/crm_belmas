import React from 'react';
import { useQuery } from '@apollo/client';
import { InlineLoading, Tag } from 'carbon-components-react';
import { css } from '@emotion/css';
import { GET_MONTH_STATS, IMonthTotalQuery } from '../../../gql/query/month';
import { Divider, loadingCSS } from '../../../globalStyles';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import d from '../../../helpers/utils';

interface ISummaryViewProps {}

const SummaryView: React.FC<ISummaryViewProps> = () => {
    const { from } = useTypedSelector((state) => state.date);
    const { data, loading, refetch } = useQuery<IMonthTotalQuery>(GET_MONTH_STATS, {
        variables: {
            monthCode: d.DateObjectToMonthCode(from)
        },
        pollInterval: 5000
    });

    if (loading || !data) return <InlineLoading className={loadingCSS} description="Загрузка" />;
    if (!data) return <button onClick={refetch}>refetch</button>;

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
        background: #7c9473;
    }

    .bx--tag.cashless {
        background: #a0937d;
    }

    div:first-child {
        width: 150px;
        background: #444444b3;
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
