import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { useQuery } from '@apollo/client';
import "bootstrap/dist/css/bootstrap.css";

import store from "./store";
import NotFound from './Components/NotFound';
import Home from './Components/Home';

import { MeQuery } from './graphql/queries/user.query';

const App=()=>{
  
  const { loading, error, data, refetch } = useQuery(MeQuery);

  return (
    <React.Fragment>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </React.Fragment>
  );
}

export default App;