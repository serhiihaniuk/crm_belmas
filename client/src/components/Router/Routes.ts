import Book from '../../pages/Book';
import Schedule from '../../pages/Schedule';
import Summary from '../../pages/Summary';
import Expenses from '../../pages/Expenses';
import Login from '../../pages/Login';
import React from 'react';
import { UserRoles } from './service';

export interface IRoute {
    name: string;
    path: string;
    component: React.ComponentType;
    exact: boolean;
    isAuth: boolean;
    expectedRole?: UserRoles;
}

export const routes: IRoute[] = [
    {
        name: 'Записи',
        path: '/book',
        exact: true,
        component: Book,
        isAuth: true,
        expectedRole: UserRoles.admin
    },
    {
        name: 'Рассписание',
        path: '/schedule',
        exact: true,
        component: Schedule,
        isAuth: true,
        expectedRole: UserRoles.master
    },
    {
        name: 'BNS',
        path: '/summary',
        exact: false,
        component: Summary,
        isAuth: true,
        expectedRole: UserRoles.root
    },
    {
        name: 'Рассходы',
        path: '/expenses',
        exact: true,
        component: Expenses,
        isAuth: true,
        expectedRole: UserRoles.root
    },
    {
        name: 'Логин',
        path: '/login',
        exact: true,
        component: Login,
        isAuth: false
    }
];
