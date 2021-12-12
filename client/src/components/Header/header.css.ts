import {css} from "@emotion/css";

export const header = css`
  position: fixed;
  height: 40px;
  width: 100%;
  background-color: #444444;
  top:0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  z-index: 5000;
  .bx--tag{
    cursor: pointer;
  }
  .navWrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    width: 100%;
    max-width: 350px;
  }
`
