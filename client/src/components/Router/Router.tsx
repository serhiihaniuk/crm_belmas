import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Header from '../Header/PageHeader';
import { IRoute, routes } from './Routes';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { UserRoles } from './service';

export interface IRouterProps {
    isAuth: boolean;
}

const Router: React.FC<IRouterProps> = ({ isAuth }) => {
    const employee = useTypedSelector((state) => state.employee);
    const permittedRoutes: IRoute[] = routes.filter((route) => {
        if (!route.isAuth && !isAuth) {
            return true;
        }

        if (employee.role.includes(UserRoles.root) && route.isAuth) {
            console.log({ employee });
            return true;
        }

        return route.expectedRole && employee.role.includes(route.expectedRole);
    });
    return (
        <BrowserRouter>
            <Header routes={permittedRoutes} />
            <Switch>
                {permittedRoutes.map((route, index) => {
                    return <Route key={index} path={route.path} exact={route.exact} component={route.component} />;
                })}
                <Redirect to={isAuth ? permittedRoutes[0].path : '/login'} />
            </Switch>
        </BrowserRouter>
    );
};

export default Router;
