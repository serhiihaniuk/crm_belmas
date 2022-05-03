import React, { useEffect } from 'react';
import { Button, Form, InlineLoading, TextInput } from 'carbon-components-react';
import { css } from '@emotion/css';
import { Login32 } from '@carbon/icons-react';
import { useLazyQuery } from '@apollo/client';
import { LOGIN } from '../../gql/query/auth';
import { useDispatch } from 'react-redux';
import { setEmployeeAction } from '../../redux/actionCreators';

const loginForm = css`
    width: 320px;
    margin: 50px auto;

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    input {
        width: 300px;
        margin: 0 0 15px;
    }

    button {
        margin: 0 10px;
        align-self: flex-end;
    }
`;

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [tryLogIn, { data, loading, error }] = useLazyQuery(LOGIN);
    const [login, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    useEffect(() => {
        if (data) {
            localStorage.setItem('token', data.login.accessToken);
            dispatch(setEmployeeAction(data.login.employee));
        }
    }, [data, dispatch]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await tryLogIn({ variables: { login, password } });
    };

    return (
        <div className={loginForm}>
            <Form onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    required
                    labelText={'Имя пользователя'}
                    id={'login-input-login'}
                    value={login}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextInput
                    type="password"
                    required
                    labelText={'Пароль'}
                    id={'login-input-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button renderIcon={Login32} type="submit">
                    {loading ? <InlineLoading description="Загрузка" /> : 'Войти'}
                </Button>
            </Form>

            {error && <div>Ошибка авторизации</div>}
        </div>
    );
};
export default Login;
