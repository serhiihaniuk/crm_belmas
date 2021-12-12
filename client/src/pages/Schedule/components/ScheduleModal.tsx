import React from 'react';

import {Modal, NumberInput, Select, SelectItem, SelectItemGroup} from "carbon-components-react";
import {css} from "@emotion/css";


const modal = css`
  .bx--modal-container {
    width: 320px;
  }
`

interface IBookModal {
    isOpen: boolean
    closeModal: () => void
    name: string
}

const ScheduleModal: React.FC<IBookModal> = ({isOpen, closeModal, name}) => {

    return (
        <Modal
            open={isOpen}
            modalHeading="Добавить запись"
            modalLabel=""
            primaryButtonText="Добавить"
            secondaryButtonText="Назад"
            onRequestClose={closeModal}
            className={modal}
        >
        <form>
            <NumberInput
                label="Стоимость"
                id="cost"
                value={0}
                min={0}
                max={100}
                light={true}
                hideSteppers={true}
            />
            <Select id="select-1" defaultValue="placeholder-item" labelText="Способ оплаты">
                <SelectItem
                    disabled
                    hidden
                    value="placeholder-item"
                    text=""
                />
                <SelectItemGroup label="Category 1">
                    <SelectItem value="option-1" text="Наличные"/>
                    <SelectItem value="option-2" text="Терминал"/>
                </SelectItemGroup>
            </Select>

        </form>
        </Modal>
    );
}

export default ScheduleModal
