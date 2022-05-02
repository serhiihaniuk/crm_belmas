import { css } from '@emotion/css';

export const openModalBTN = css`
    position: fixed;
    bottom: 20px;
    right: 20px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #fff;
    background-color: #444444;
    color: #fff;
    font-size: 8px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    svg {
        width: 22px;
        height: 22px;
    }

    :hover {
        background-color: #7c9473;
        color: #fff;
    }
`;

export const setCurrentMonthBTN = css`
    margin: 25px 0 5px;
    padding: 10px;
    border: 2px solid #7c9473;
    width: 100%;
`;