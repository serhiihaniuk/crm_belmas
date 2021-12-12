import React, { useEffect, useState } from 'react';

import { FormLabel, Modal, Select, SelectItem, TextArea, TextInput } from 'carbon-components-react';
import { TimePicker } from '@atlaskit/datetime-picker';
import { dateToTimestamp, mapTimeToTimepicker } from '../service/tableService';
import { css } from '@emotion/css';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useMutation } from '@apollo/client';
import { CREATE_APPOINTMENT } from '../../../gql/mutations/appointment';
import { IApolloClient } from '../../../index';

const timePickerCss = css`
  width: 100%;

  & > div {
    margin-top: 2px;
    background-color: #fff;
    border-bottom: 1px solid #8d8d8d;
  }
`;

interface IBookModal {
  isOpen: boolean;
  closeModal: () => void;
  selectedDay: {
    day: string,
    selectedAppointment: any
    isEditingExisting: boolean
  };
  employee: string;
  apolloClient: IApolloClient;

}

interface IAppointmentTemplate {
  client: string;
  description: string | null;
  date: string;
  instagram: string | null;
  procedure: string;
  employee: string;
  creator: string;
}

const BookModal: React.FC<IBookModal> = ({ isOpen, closeModal, selectedDay, employee, apolloClient }) => {
  const { selectedAppointment, isEditingExisting } = selectedDay;
  const [client, setClient] = useState('');
  const [procedure, setProcedure] = useState('manicure');
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [time, setTime] = useState('');
  const createdBy = useTypedSelector(state => state.employee._id);
  const [addAppointment] = useMutation(CREATE_APPOINTMENT);


  useEffect(() => {
    if (selectedAppointment && isEditingExisting) {
      setClient(selectedAppointment.client);
      setProcedure(selectedAppointment.procedure);
      setDescription(selectedAppointment.description);
      setInstagram(selectedAppointment.instagram);
      setTime(selectedAppointment.date);
    }
    if (!isEditingExisting) {
      resetForm();
    }
  }, [selectedAppointment, isEditingExisting]);

  const resetForm = () => {
    setClient('');
    setDescription('');
    setInstagram('');
    setTime('');
  };

  const handleSubmit = async () => {
    const [year, month, day] = selectedDay.day.split('_');
    const [hour, minute] = time.split(':');
    const appointmentTimestamp = dateToTimestamp(+year, +month, +day, +hour, +minute);

    const appointmentTemplate: IAppointmentTemplate = {
      client,
      description,
      date: String(appointmentTimestamp),
      instagram,
      procedure,
      employee,
      creator: createdBy
    };

    try {
      await addAppointment({
          variables: {
            AppointmentInput: appointmentTemplate
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
    resetForm();
    await apolloClient.refetchQueries({
      include: ['GET_APPOINTMENTS']
    });
    closeModal();
  };
  return (
    <Modal
      open={isOpen}
      modalHeading='Добавить запись'
      modalLabel=''
      primaryButtonText='Добавить'
      secondaryButtonText='Назад'
      onRequestClose={closeModal}
      onRequestSubmit={() => {
        handleSubmit();
      }}
    >
      {(<form>
        <TextInput
          labelText='Введите имя'
          id='name'
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />

        <Select id='select-1' labelText='Выберите процедуру' value={procedure}
                onChange={(e) => {
                  setProcedure(e.target.value);
                }}>
          <SelectItem value='manicure' text='Маникюр' />
          <SelectItem value='pedicure' text='Педикюр' />
        </Select>

        <FormLabel className={timePickerCss}>
          Выберите время
          <TimePicker
            timeFormat='HH:mm'
            placeholder={' '}
            times={mapTimeToTimepicker()}
            name='Выберите время'
            appearance={'subtle'}
            onChange={(time) => {
              setTime(time);
            }}
            value={time}
          />
        </FormLabel>
        <TextInput
          labelText='профиль инстаграм'
          id='name'
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
        <TextArea
          labelText='Комментарий'
          placeholder='...'
          helperText='необязательное поле'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

      </form>)}
    </Modal>
  );
};

export default BookModal;
