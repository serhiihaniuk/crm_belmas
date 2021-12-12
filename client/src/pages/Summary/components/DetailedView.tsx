import React from 'react';
import RevenueTable from './tables/RevenueTable';
import { Tab, Tabs } from 'carbon-components-react';

const DetailedView: React.FC = () => {
  return (
    <>
      <Tabs>
        <Tab id="tab-1" label="Общее">
          <RevenueTable />
        </Tab>
        <Tab id="tab-2" label="Галя">
          <RevenueTable />
        </Tab>
        <Tab id="tab-3" label="Юля">
          <RevenueTable />
        </Tab>
      </Tabs>
    </>
  );
};

export default DetailedView;
