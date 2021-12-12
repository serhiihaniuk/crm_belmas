import React from 'react';
import { css } from '@emotion/css';
import { Tag } from 'carbon-components-react';
import SummaryView from './components/SummaryView';
import { Route, Switch } from 'react-router-dom';
import DetailedView from './components/DetailedView';
import { Link } from 'react-router-dom';
import { pageWrapper } from '../../globalStyles';

const tag = css`
  width: 45%;
  margin: 10px 3%;

  a {
    color: black;
  }
`;

const Summary = ({ location, match }: any) => {
  const isDetailed = location.pathname.includes('/detailed');
  return (
    <div className={pageWrapper}>
      <Tag className={tag} type={!isDetailed ? 'teal' : 'gray'}>
        <Link to={`${match.url}`}>Общее</Link>
      </Tag>
      <Tag className={tag} type={isDetailed ? 'teal' : 'gray'}>
        <Link to={`${match.url}/detailed`}>Детали</Link>
      </Tag>
      <Switch>
        <Route exact path={`${match.path}/detailed`}>
          <DetailedView />
        </Route>
        <Route path={`${match.path}`}>
          <SummaryView />
        </Route>
      </Switch>
    </div>
  );
};

export default Summary;
