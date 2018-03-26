import React from 'react'
import './styles.css'

import httpError from '../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

import ManagersFilter from '../ManagersFilter'
import Usercard from './Usercard'
import Step from './Step'
import Nodata from './Nodata'
import UserProfile from './UserProfile'


export default class FunnelWithAllCustomers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stats: [],
      customer: {},
      profile: [],
      progress: 0,
      show: 'all',
      manager: false
    }

    this.clickCard = this.clickCard.bind(this)
    this.onManager = this.onManager.bind(this)
  }

  componentDidMount() {
    const fromLocalStorage = localStorage.getItem('customersFunnel')
    if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
    this.setState({ msid: Cookies.get('msid') }, () => this.fetchInfo())
  }

  onManager({ value }) {
    this.setState({ manager: value }, () => this.fetchInfo())
  }


  fetchInfo() {
    this.setState({ progress: 7 })

    const { msid, manager } = this.state
    let url = `http://papi.mindsales-crm.com/stats/funnel?token=${msid}`
    if (manager) url += `&manager=${manager}`

    axios.get(url)
      .then(({ data: { stats } }) => {
        this.setState({ progress: 100, stats })
        localStorage.setItem('customersFunnel', JSON.stringify({ stats }))
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
    // this.setState({ show })
  }


  drawCustomers(customers) {
    return customers.length > 0 ?
      customers.map(
        ({ name, user, _id }) => <Usercard
          title={name}
          details={user}
          key={_id}
          onClick={e => this.clickCard(_id)} />
      )
      :
      (<Nodata>Нет клиентов 😕</Nodata>)
  }

  drawFunnel() {
    const { stats, show } = this.state
    const fixName = name => name === 'in-progress' ? 'Звонок' : name;
    return (<div className="bCustomersBoard">
      {
        show === 'all' ?
          stats.length > 0 ?
            stats.map(({ name, id, customers }, index) => {
              const { length } = customers
              return (
                <Step title={`${fixName(name)} — ${length}`} key={id}>
                  {this.drawCustomers(customers)}
                </Step>
              )
            })
            :
            ''
          : ''
      }
    </div>)
  }

  render() {
    const { stats, show, customer, profile } = this.state
    return (
      <div className="bContent">
        <Progress style={{ boxShadow: 'none' }} percent={this.state.progress} color="#D29FCD" height="12" />
        <h1>Текущие сделки </h1>

        <div style={{ 'paddingTop': '20px', 'paddingLeft': '5px', 'maxWidth': '45%' }}>
          <ManagersFilter onChange={this.onManager} />
        </div>

        <div className="innerContent">

          {this.drawFunnel()}
          {show !== 'all' && <UserProfile
            customer={customer}
            profile={profile}
            onClose={e => this.setState({ show: 'all' })}
          />}
        </div>
      </div>
    )
  }
}