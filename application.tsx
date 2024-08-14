import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '......srccorepublic';
import { AppPluginStartDependencies } from './types';
import { TodoappApp } from './components/app';

export const renderApp = (
  { notifications, http }: CoreStart,
  { navigation }: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  ReactDOM.render(
    <TodoappApp
      basename={appBasePath}
      notifications={notifications}
      http={http}
      navigation={navigation}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
