import React from 'react'
import './styles.css'

import asyncComponent from '../../asyncComponent'
import httpError from '../../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

import Rejectcard from './Rejectcard'

import Usercard from '../Usercard'
import Nodata from '../Nodata'
import UserProfile from '../UserProfile'

import PeriodRadio from '../../PeriodRadio'
import ManagersFilter from '../../ManagersFilter'
import TrunksFilter from '../../TrunksFilter'

const Period = asyncComponent(
  () => import('../../Period').then(module => module.default),
  { name: 'Period' },
)

export default class Rejects extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      customers: [],
      customer: 'all',
      profile: [],
      progress: 0,
      show: 'all',
      interval: {},
      manager: false,
      trunk: false
    }

    this.clickCard = this.clickCard.bind(this)

    this.onInterval = this.onInterval.bind(this)
    this.onPeriodChange = this.onPeriodChange.bind(this)
    this.onManager = this.onManager.bind(this)
    this.onTrunk = this.onTrunk.bind(this)
  }

  componentDidMount() {
    const fromLocalStorage = localStorage.getItem('rejects')
    if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
    this.setState({ msid: Cookies.get('msid') }, () => this.fetchCustomers())
  }

  onPeriodChange({ show }) {
    this.setState({ show });
    if (show === 'all') this.setState({ interval: {} }, () => this.fetchCustomers());
  }

  onInterval(interval) {
    this.setState({ interval }, () => this.fetchCustomers())
  }

  onManager({ value }) {
    this.setState({ manager: value }, () => this.fetchCustomers())
  }

  onTrunk({ value }) {
    this.setState({ trunk: value }, () => this.fetchCustomers())
  }

  fetchCustomers() {
    this.setState({ progress: 7 })

    const { msid, manager, trunk, start, end } = this.state
    let url = `http://papi.mindsales-crm.com/stats/reject/profiles?token=${msid}`
    if (manager) url += `&manager=${manager}`
    if (trunk) url += `&trunk=${trunk}`
    if (start) url += `&start=${start}`
    if (end) url += `&end=${end}`

    axios.get(url)
      .then(({ data: { customers } }) => {
        this.setState({ progress: 100, customers })
        localStorage.setItem('rejects', JSON.stringify({ customers }))
      })
      .catch(httpError);
  }

  clickCard(show) {
    const { msid } = this.state
    let url = `http://papi.mindsales-crm.com/customers/${show}?token=${msid}&params=1`

    axios.get(url)
      .then(({ data: { customer } }) => {
        const profile = customer.params.map(param => {
          const parameter = { title: param.name }
          let value = ''

          if (customer[param.id]) {
            if (typeof customer[param.id] === 'object') {
              if (customer[param.id].length > 0) value = customer[param.id]
            } else value = customer[param.id]
          }

          parameter.value = value
          return parameter
        })

        this.setState({ progress: 100, show, customer, profile })
      })
      .catch(httpError);
  }


  drawCustomers(customers) {
    return customers.length > 0 ?
      customers.map(
        ({ name, reason, date, user, _id }) => <Rejectcard
          title={name}
          reason={reason}
          details={date + ', ' + user}
          key={_id}
          onClick={e => this.clickCard(_id)} />
      )
      :
      (<Nodata>Отказов нет 🤔</Nodata>)
  }

  render() {
    const { customers, show, customer, profile } = this.state
    return (
      <div className="bContent">
        <Progress style={{ boxShadow: 'none' }} percent={this.state.progress} color="#D29FCD" height="12" />
        <h1>
          Отказы
          <PeriodRadio onChange={this.onPeriodChange} />
        </h1>
        {show === 'period' && <Period onInterval={this.onInterval} />}

        <div style={{ 'paddingTop': '20px', 'maxWidth': '45%' }}>
          <ManagersFilter onChange={this.onManager} />
        </div>

        <div style={{ 'paddingTop': '20px', 'maxWidth': '45%' }}>
          <TrunksFilter onChange={this.onTrunk} />
        </div>

        <div className="innerContent">
          {customer === 'all' && this.drawCustomers(customers)}
          {customer !== 'all' && <UserProfile
            customer={customer}
            profile={profile}
            onClose={e => this.setState({ customer: 'all' })}
          />}
        </div>
      </div>
    )
  }
}