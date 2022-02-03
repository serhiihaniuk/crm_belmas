import React from 'react';
import { css } from '@emotion/css';
import { InlineLoading } from 'carbon-components-react';

const loadingStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 136px;
`;
const ModalInlineLoading = () => {
    return <InlineLoading className={loadingStyle} description="Загрузка" />;
};

export default ModalInlineLoading;
