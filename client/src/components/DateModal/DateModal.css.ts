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
    position: relative;
    padding: 10px;
    border: 2px solid #7c9473;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
        position: absolute;
        left: 5px;
        margin: 0 15px;
        width: 20px;
        height: 20px;
    }
`;
export const buttonWrapper = css`
    margin: 20px auto 10px;
    max-width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 10px;
`;