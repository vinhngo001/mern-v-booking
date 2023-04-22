import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import BusinessCreate from "./components/business/BusinessCreate";
import BusinessList from "./components/business/BusinessList";
import BusinessEdit from "./components/business/BusinessEdit";
import BusinessPublish from "./components/business/BusinessPublish";
import EventCreate from "./components/events/EventCreate";
import Landing from "./components/layout/Landing";
import AppNavbar from './components/layout/NavbarMenu';
import NotFound from "./components/NotFound";

function App() {
	return (
		<Router>
          <Fragment>
            <AppNavbar />
            <Switch>
              <Route exact path='/' component={Landing} />
               <Route path='/business/list' exact component={BusinessList} />
              <Route path='/business/create' exact component={BusinessCreate} />
              <Route path='/business/edit/:id' component={BusinessEdit} />
              <Route path='/business/publish' component={BusinessPublish} />
              <Route path='/events/create/:email' component={EventCreate} /> 
              <Route path='*' exact component={NotFound}/>
            </Switch>
          </Fragment>
        </Router>
	)
}

export default App
