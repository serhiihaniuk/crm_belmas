import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { header } from './header.css';
import { Tag } from 'carbon-components-react';
import { IRoute } from '../Router/Routes';

interface IPageHeaderProps {
  routes: IRoute[];
}

const PageHeader: React.FC<IPageHeaderProps> = ({ routes }) => {
  const { pathname } = useLocation();

  return (
    <header className={header}>
      {
        routes.map(route => {
          const { path, name } = route;
          const isActive = pathname.includes(path);
          return (
            <Link key={path} to={path}>
              <Tag type={isActive ? 'teal' : 'high-contrast'} className='tag'>{name}</Tag>
            </Link>
          );
        })
      }
    </header>
  );
};

export default PageHeader;
