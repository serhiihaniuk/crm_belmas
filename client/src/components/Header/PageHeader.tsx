import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { header } from './header.css';
import { Tag } from 'carbon-components-react';
import { IRoute } from '../Router/Routes';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { toggleDateModal } from '../../redux/actionCreators/date-actions';

interface IPageHeaderProps {
    routes: IRoute[];
}

const PageHeader: React.FC<IPageHeaderProps> = ({ routes }) => {
    const { pathname } = useLocation();
    const state = useTypedSelector((state) => state);
    const dispatch = useDispatch();

    return (
        <header className={header}>
            <button
                onClick={() => {
                    dispatch(toggleDateModal(!state.date.isModalOpen));
                }}
            >
                Date
            </button>
            {routes.map((route) => {
                const { path, name } = route;
                const isActive = pathname.includes(path);
                return (
                    <Link key={path} to={path}>
                        <Tag type={isActive ? 'teal' : 'high-contrast'} className="tag">
                            {name}
                        </Tag>
                    </Link>
                );
            })}
        </header>
    );
};

export default PageHeader;
