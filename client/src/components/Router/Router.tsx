import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Header from '../Header/PageHeader';
import { IRoute, routes } from './Routes';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { UserRoles } from './service';
import { useDispatch } from 'react-redux';
import { useQuery } from '@apollo/client';
import { CHECK_AUTH } from '../../gql/query/auth';
import { setEmployeeAction } from '../../redux/actionCreators';
import { Loading } from 'carbon-components-react';

const Router: React.FC = () => {
    const employee = useTypedSelector((state) => state.employee);
    const isAuth = useTypedSelector((state) => state.employee.isAuth);
    const [authChecked, setAuthChecked] = useState(false);

    const dispatch = useDispatch();

    const { data, loading } = useQuery(CHECK_AUTH);

    useEffect(() => {
        if (data) {
            console.log(data)
            localStorage.setItem('token', data?.checkAuth?.accessToken);
            dispatch(setEmployeeAction(data?.checkAuth?.employee));
            setAuthChecked(true);
        }
    }, [data, dispatch]);

    const permittedRoutes: IRoute[] = useMemo(
        () =>
            routes.filter((route) => {
                if (!route.isAuth && !isAuth) {
                    return true;
                }

                if (employee.role.includes(UserRoles.root) && route.isAuth) {
                    return true;
                }

                return route.expectedRole && employee.role.includes(route.expectedRole);
            }),
        [isAuth]
    );

    if (loading) return <Loading withOverlay={true} />;
    return (
        <BrowserRouter>
            <Header routes={permittedRoutes} />
            <Switch>
                {permittedRoutes.map((route, index) => {
                    return <Route key={index} path={route.path} exact={route.exact} component={route.component} />;
                })}

            </Switch>
            {authChecked && <Redirect to={isAuth ? permittedRoutes[0].path : '/login'} />}
        </BrowserRouter>
    );
};

export default Router;
