import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";

import Header from './Header';
import Sidebar from './Sidebar';

import './style.css'
import asyncComponent from './asyncComponent'

const Leads = asyncComponent(
  () => import('./Leads').then(module => module.default),
  { name: 'Leads' },
)

const LeadsBy = asyncComponent(
  () => import('./LeadsBy').then(module => module.default),
  { name: 'LeadsBy' },
)

const Trunks = asyncComponent(
  () => import('./Trunks').then(module => module.default),
  { name: 'Trunks' },
)

const Funnel = asyncComponent(
  () => import('./Funnel').then(module => module.default),
  { name: 'Funnel' },
)

const Portrait = asyncComponent(
  () => import('./Portrait').then(module => module.default),
  { name: 'Portrait' },
)

const Progress = asyncComponent(
  () => import('./Progress').then(module => module.default),
  { name: 'Progress' },
)

const Calls = asyncComponent(
  () => import('./Calls').then(module => module.default),
  { name: 'Calls' },
)

const Deal = asyncComponent(
  () => import('./Customers/Deal').then(module => module.default),
  { name: 'Deal' },
)

const Reject = asyncComponent(
  () => import('./Customers/Reject').then(module => module.default),
  { name: 'Reject' },
)

const UsersStats = asyncComponent(
  () => import('./Managers/UsersStats').then(module => module.default),
  { name: 'UsersStats' },
)

// UsersStats
const UsersDetails = asyncComponent(
  () => import('./Managers/UsersDetails').then(module => module.default),
  { name: 'UsersDetails' },
)


class App extends Component {
  constructor() {
    super();
    this.state = {
      // company: 'ТОО "Рога и Копыта"'
    };
  }

  render() {
    return (
      <BrowserRouter>
        <div className="wrapper">
          <Header title={this.state.company} />
          <Sidebar />
          <Route exact path="/leads" component={Leads} />
          <Route path="/leads-by-managers" component={LeadsBy} />
          <Route path="/users-stats" component={UsersStats} />
          <Route path="/users-details" component={UsersDetails} />
          <Route path="/customers-deal" component={Deal} />
          <Route path="/customers-reject" component={Reject} />
          <Route path="/trunks" component={Trunks} />
          <Route path="/calls" component={Calls} />
          <Route path="/funnel" component={Funnel} />
          <Route path="/portrait" component={Portrait} />
          <Route path="/progress" component={Progress} />
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById('root'));
