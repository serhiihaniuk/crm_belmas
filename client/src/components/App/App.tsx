import React, { useEffect } from 'react';
import Router from '../Router/Router';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useQuery } from '@apollo/client';
import { CHECK_AUTH } from '../../gql/query/auth';
import { setEmployeeAction } from '../../redux/actionCreators';
import { useDispatch } from 'react-redux';
import { Loading } from 'carbon-components-react';
import DateModal from '../DateModal/DateModal';

function App() {
    const dispatch = useDispatch();

    const isAuth = useTypedSelector((state) => state.employee.isAuth);
    const { data, loading } = useQuery(CHECK_AUTH);

    useEffect(() => {
        if (data) {
            localStorage.setItem('token', data?.checkAuth?.accessToken);
            dispatch(setEmployeeAction(data?.checkAuth?.employee));
        }
    }, [data, dispatch]);
    if (loading) return <Loading withOverlay={true} />;
    return (
        <>
            <Router isAuth={isAuth} />
            <DateModal />
        </>
    );
}

export default App;
