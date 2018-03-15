import React from 'react'
import './styles.css'
import asyncComponent from '../asyncComponent'
import PeriodRadio from '../PeriodRadio'
import TextStats from '../TextStats'
import httpError from '../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

import Trunk from './Trunk'

const Period = asyncComponent(
  () => import('../Period').then(module => module.default),
  { name: 'Period' },
)


class Trunks extends React.Component {
  constructor(props) {
    super(props)
    this.state = { stats: [], progress: 0, interval: {}, show: 'all' }

    this.onInterval = this.onInterval.bind(this)
    this.onPeriodChange = this.onPeriodChange.bind(this)
  }

  componentDidMount() {
    const fromLocalStorage = localStorage.getItem('trunks')
    if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
    this.setState({ msid: Cookies.get('msid') }, () => this.fetchInfo())
  }

  fetchInfo() {
    this.setState({ progress: 12 })
    const delay = Math.floor(Math.random() * (100 - 10 + 1)) + 10
    const progress = Math.floor(Math.random() * (25 - 10 + 1)) + 10
    setTimeout(() => this.setState({ progress }), delay)

    const { msid } = this.state
    let url = `http://papi.mindsales-crm.com/v2/stats/trunks?token=${msid}`

    const { start, end } = this.state.interval
    if (start) url = `${url}&start=${start}`
    if (end) url = `${url}&end=${end}`

    axios.get(url)
      .then(({ data: { stats } }) => {
        this.setState({ progress: 100, stats })
        localStorage.setItem('trunks', JSON.stringify({ stats }))
      })
      .catch(httpError);
  }

  onPeriodChange({ show }) {
    this.setState({ show });
    if (show === 'all') this.setState({ interval: {} }, () => this.fetchInfo());
  }

  onInterval(interval) {
    this.setState({ interval }, () => this.fetchInfo())
  }

  drawStats() {
    const { stats } = this.state
    return stats.length > 0 ?
      stats.map(
        ({ name, customers, deals, rejects, inProgress }) =>
          <Trunk key={Math.random()}
            name={name}
            customers={customers}
            deals={deals}
            rejects={rejects}
            inProgress={inProgress} />
      )
      :
      (<div>Данных нет</div>)
  }

  render() {
    const { show } = this.state
    return (
      <div className="bContent">
        <Progress style={{ boxShadow: 'none' }} percent={this.state.progress} color="#D29FCD" height="12" />
        <h1>
          Эффективность рекламных источников
          <PeriodRadio onChange={this.onPeriodChange} />
        </h1>
        {show === 'period' && <Period onInterval={this.onInterval} />}
        <div className="innerContent">
          {this.drawStats()}
        </div>
      </div>
    )
  }
}

export default Trunks
