import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Header from '../Header/PageHeader';
import { IRoute, routes } from './Routes';

export interface IRouterProps {
    isAuth: boolean;
}

const Router: React.FC<IRouterProps> = ({ isAuth }) => {
    const permittedRoutes: IRoute[] = routes.filter((route) => route.isAuth === isAuth);
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
