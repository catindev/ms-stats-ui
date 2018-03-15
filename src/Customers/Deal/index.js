import React from 'react'
import './styles.css'

import asyncComponent from '../../asyncComponent'
import httpError from '../../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

import Usercard from '../Usercard'
import Nodata from '../Nodata'
import UserProfile from '../UserProfile'

import PeriodRadio from '../../PeriodRadio'

const Period = asyncComponent(
  () => import('../../Period').then(module => module.default),
  { name: 'Period' },
)


export default class Deals extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      customers: [],
      customer: 'all',
      profile: [],
      progress: 0,
      show: 'all',
      interval: {},
    }

    this.clickCard = this.clickCard.bind(this)

    this.onInterval = this.onInterval.bind(this)
    this.onPeriodChange = this.onPeriodChange.bind(this)
  }

  componentDidMount() {
    const fromLocalStorage = localStorage.getItem('deals')
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

  fetchCustomers() {
    this.setState({ progress: 7 })

    const { msid } = this.state
    let url = `http://papi.mindsales-crm.com/stats/deal/profiles?token=${msid}`

    const { start, end } = this.state.interval
    if (start) url = `${url}&start=${start}`
    if (end) url = `${url}&end=${end}`

    axios.get(url)
      .then(({ data: { customers } }) => {
        this.setState({ progress: 100, customers })
        localStorage.setItem('deals', JSON.stringify({ customers }))
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
        ({ name, deal: { amount }, _id }) => <Usercard
          title={name}
          details={'Сумма сделки ' + amount}
          key={_id}
          onClick={e => this.clickCard(_id)} />
      )
      :
      (<Nodata>Сделок нет 😕</Nodata>)
  }

  render() {
    const { customers, show, customer, profile } = this.state
    return (
      <div className="bContent">
        <Progress style={{ boxShadow: 'none' }} percent={this.state.progress} color="#D29FCD" height="12" />
        <h1>
          Успешные сделки
          <PeriodRadio onChange={this.onPeriodChange} />
        </h1>
        {show === 'period' && <Period onInterval={this.onInterval} />}
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