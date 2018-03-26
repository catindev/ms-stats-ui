import React from 'react'
import './styles.css'
import asyncComponent from '../asyncComponent'
import PeriodRadio from '../PeriodRadio'
import httpError from '../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

import { BarChart, Bar, XAxis, LabelList } from 'recharts';

const Period = asyncComponent(
  () => import('../Period').then(module => module.default),
  { name: 'Period' },
)

const rnd = (start, end) => Math.floor(Math.random() * end) + start

const fakeData = () => [
  { name: '01 дек.', 'Входящие': rnd(10, 24), 'Пропущенные': 9 },
  { name: '02 дек.', 'Входящие': rnd(10, 43), 'Пропущенные': 9 },
  { name: '03 дек.', 'Входящие': rnd(10, 26), 'Пропущенные': 8 },
  { name: '04 дек.', 'Входящие': rnd(10, 46), 'Пропущенные': 5 },
  { name: '05 дек.', 'Входящие': rnd(10, 66), 'Пропущенные': 11 },
  { name: '06 дек.', 'Входящие': rnd(10, 59), 'Пропущенные': 11 },
  { name: '07 дек.', 'Входящие': rnd(10, 45), 'Пропущенные': 8 },
  { name: '08 дек.', 'Входящие': rnd(10, 37), 'Пропущенные': 10 },
  { name: '09 дек.', 'Входящие': rnd(10, 53), 'Пропущенные': 19 },
  { name: '10 дек.', 'Входящие': rnd(10, 33), 'Пропущенные': 8 },
  { name: '11 дек.', 'Входящие': rnd(10, 58), 'Пропущенные': 11 },
  { name: '12 дек.', 'Входящие': rnd(10, 55), 'Пропущенные': 9 }
]

const settings = { top: 20, right: 0, left: 0, bottom: 0 };


class SimpleBarChart extends React.Component {
  render() {
    return (
      <BarChart width={800} height={350} data={this.props.data} margin={settings}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <Bar dataKey="Входящие" fill="#00D05D">
          <LabelList dataKey="Входящие" position="top" />
        </Bar>
        <Bar dataKey="Пропущенные" fill="#FF0000" >
          <LabelList dataKey="Пропущенные" position="top"></LabelList>
        </Bar>
      </BarChart>
    );
  }
}

class CallsStats extends React.Component {
  constructor(props) {
    super(props)
    this.state = { stats: [], progress: 0, interval: {}, show: 'all' }

    this.onInterval = this.onInterval.bind(this)
    this.onPeriodChange = this.onPeriodChange.bind(this)
  }

  componentDidMount() {
    const fromLocalStorage = localStorage.getItem('incomingCalls')
    if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
    this.setState({ msid: Cookies.get('msid') })
  }

  fetchInfo() {
    this.setState({ progress: 12 })
    const delay = Math.floor(Math.random() * (100 - 10 + 1)) + 10
    const progress = Math.floor(Math.random() * (25 - 10 + 1)) + 10
    setTimeout(() => this.setState({ progress }), delay)

    const { msid } = this.state
    let url = `http://papi.mindsales-crm.com/stats/calls?token=${msid}`

    const { start, end } = this.state.interval
    if (start) url = `${url}&start=${start}`
    if (end) url = `${url}&end=${end}`

    // fake data
    const stats = fakeData()
    setTimeout(() => {
      this.setState({ progress: 100, stats })
      localStorage.setItem('incomingCalls', JSON.stringify({ stats }))
    }, 1200)

    // axios.get(url)
    //   .then(({ data: { stats } }) => {
    //     this.setState({ progress: 100, stats })
    //     localStorage.setItem('incomingCalls', JSON.stringify({ stats }))
    //   })
    //   .catch(httpError);
  }

  onPeriodChange({ show }) {
    this.setState({ show });
    if (show === 'all') this.setState({ interval: {} }, () => this.fetchInfo());
  }

  onInterval(interval) {
    this.setState({ interval }, () => this.fetchInfo())
  }

  render() {
    const { interval, stats } = this.state
    return (
      <div className="bContent">
        <Progress style={{ boxShadow: 'none' }} percent={this.state.progress} color="#D29FCD" height="12" />
        <h1>Звонки</h1>
        <Period onInterval={this.onInterval} />
        <div className="innerContent">
          {stats && <SimpleBarChart data={stats} />}
        </div>
      </div>
    )
  }
}

export default CallsStats
