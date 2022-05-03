import { css } from '@emotion/css';

export const timePickerCss = css`
    width: 100%;

    & > div {
        margin-top: 2px;
        background-color: #fff;
        border-bottom: 1px solid #8d8d8d;
    }
`;
export const deleteBtn = css`
    display: flex;
    justify-content: center;
    margin: 2rem 0 1rem;
    width: 100%;
`;
export const errorSpan = css`
    height: 7px;
    font-size: 12px;
`;

export const bookModalForm = css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 20px;
`;