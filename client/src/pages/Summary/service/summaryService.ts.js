
export const headers = [
    {
        key: 'name',
        header: '__',
    },
    {
        key: 'cash',
        header: 'Наличные',
    },
    {
        key: 'cashless',
        header: 'Терминал',
    },
];

export const rows = [
    {id: 'a',

        name: 'Процедуры',
        cash: '2222',
        cashless: '3333',
    },
    {id: 'b',

        name: 'Продажи',
        cash: '0',
        cashless: '0',
    }
];

export const revenueTableHeaders = [
    {
        key: 'date',
        header: 'Дата',
    },
    {
        key: 'cash',
        header: 'Наличные',
    },
    {
        key: 'cashless',
        header: 'Терминал',
    },
];

const datesTableData = [...Array(31).keys()].map((number) => {
    const cash = Math.floor(Math.random() * 190);
    return {
        id: number,
        date: `${number + 1}.01`,
        cash: `${cash}`,
        cashless: `${cash*2}`,
    };
})
export const revenueTableRows = [...datesTableData];
