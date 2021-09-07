import {
  Fragment,
  useEffect,
  useState,
} from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { useQuery } from '@apollo/client';
import "bootstrap/dist/css/bootstrap.css";

import store from "./store";
import NotFound from './components/pages/NotFound';
import Home from './components/pages/Home';

import { MeQuery } from './graphql/queries/user.query';

const App=()=>{
  return (
    <Fragment>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </Fragment>
  );
}

export default App;