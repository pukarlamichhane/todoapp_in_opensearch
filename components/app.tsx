import React, { useState } from 'react';
import './app.scss';
import {
  EuiPage,
  EuiPageBody,
  EuiTitle,
  EuiHorizontalRule,
  EuiTabs,
  EuiTab,
  EuiIcon,
} from '@elastic/eui';
import Overview from '../pages/Overview/Overview';
import Table from '../pages/Table/Table';
import OverviewGraphql from '../pages/OverviewGraphql/OverviewGraphql';
import TableGraphql from '../pages/TableGrapghql/TableGraphql';

interface TodoappAppDeps {
  basename: string;
}

export const TodoappApp = ({ basename }: TodoappAppDeps) => {
  const [selectedTabId, setSelectedTabId] = useState('Overview');

  const todoTabs = [
    {
      id: 'Overview',
      name: 'Overview',
      iconType: 'apps',
      content: <Overview />,
    },
    {
      id: 'Table',
      name: 'Table',
      iconType: 'heatmap',
      content: <Table></Table>,
    },
    {
      id: 'Overviewgraphql',
      name: 'Overview Graphql',
      iconType: 'apps',
      content: <OverviewGraphql></OverviewGraphql>,
    },
    {
      id: 'Tablegraphql',
      name: 'Table Graphql',
      iconType: 'heatmap',
      content: <TableGraphql></TableGraphql>,
    },
  ];

  const selectedTabContent = todoTabs.find((tab) => tab.id === selectedTabId)?.content;

  const onSelectedTabChanged = (id: string) => {
    setSelectedTabId(id);
  };

  const renderTabs = () => {
    return todoTabs.map((tab) => (
      <EuiTab
        key={tab.id}
        onClick={() => onSelectedTabChanged(tab.id)}
        isSelected={tab.id === selectedTabId}
      >
        <EuiIcon type={tab.iconType} />
        {tab.name}
      </EuiTab>
    ));
  };

  return (
    <EuiPage restrictWidth="1000px">
      <EuiPageBody component="main">
        <div className="mainpage">
          <EuiTitle size="s">
            <h2 className="mainpage-title">Todo App</h2>
          </EuiTitle>
          <EuiHorizontalRule className="mainpage-rule" />
          <EuiTabs className="mainpage-tabs">{renderTabs()}</EuiTabs>
          {selectedTabContent}
        </div>
      </EuiPageBody>
    </EuiPage>
  );
};
