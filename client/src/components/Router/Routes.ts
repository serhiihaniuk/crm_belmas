import Book from '../../pages/Book';
import Schedule from '../../pages/Schedule';
import Summary from '../../pages/Summary';
import Expenses from '../../pages/Expenses';
import Login from '../../pages/Login';
import React from 'react';

export interface IRoute {
    name: string;
    path: string;
    component: React.ComponentType;
    exact: boolean;
    isAuth: boolean;
}

export const routes: IRoute[] = [
    {
        name: 'Записи',
        path: '/book',
        exact: true,
        component: Book,
        isAuth: true
    },
    {
        name: 'Рассписание',
        path: '/schedule',
        exact: true,
        component: Schedule,
        isAuth: true
    },
    {
        name: 'BNS',
        path: '/summary',
        exact: false,
        component: Summary,
        isAuth: true
    },
    {
        name: 'Рассходы',
        path: '/expenses',
        exact: true,
        component: Expenses,
        isAuth: true
    },
    {
        name: 'Логин',
        path: '/login',
        exact: true,
        component: Login,
        isAuth: false
    }
];
