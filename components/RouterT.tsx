import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Test from './Test';

const RouterT = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/test" component={Test} />
      </Switch>
    </HashRouter>
  );
};

export default RouterT;
