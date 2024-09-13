import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '......srccorepublic';
import { AppPluginStartDependencies } from './types';
import { TodoappApp } from './components/app';
import { Provider } from 'react-redux';
import { store } from './redux/store';

export const renderApp = (
  { notifications, http }: CoreStart,
  { navigation }: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  ReactDOM.render(
    <Provider store={store}>
      <TodoappApp basename={appBasePath} />
    </Provider>,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
