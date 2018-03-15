import React from 'react'
import './styles.css'
import asyncComponent from '../asyncComponent'
import PeriodRadio from '../PeriodRadio'
import TextStats from '../TextStats'
import httpError from '../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

const Period = asyncComponent(
  () => import('../Period').then(module => module.default),
  { name: 'Period' },
)

export default class Portrait extends React.Component {
  constructor(props) {
    super(props)
    this.state = { portrait: [], progress: 0, interval: {}, show: 'all' }

    this.onInterval = this.onInterval.bind(this)
    this.onPeriodChange = this.onPeriodChange.bind(this)
  }

  componentDidMount() {
    const fromLocalStorage = localStorage.getItem('portrait')
    if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
    this.setState({ msid: Cookies.get('msid') }, () => this.fetchInfo())
  }

  fetchInfo() {
    this.setState({ progress: 7 })

    const { msid } = this.state
    let url = `http://papi.mindsales-crm.com/stats/portrait?token=${msid}`

    const { start, end } = this.state.interval
    if (start) url = `${url}&start=${start}`
    if (end) url = `${url}&end=${end}`

    axios.get(url)
      .then(({ data: { portrait } }) => {
        this.setState({ progress: 100, portrait })
        localStorage.setItem('portrait', JSON.stringify({ portrait }))
      })
      .catch(httpError);
  }

  onInterval(interval) {
    this.setState({ interval }, () => this.fetchInfo());
  }

  onPeriodChange({ show }) {
    this.setState({ show });
    if (show === 'all') this.setState({ interval: {} }, () => this.fetchInfo());
  }

  drawValues(values) {
    return values.length > 0 ?
      values.map(({ name, percents }, index) => <TextStats key={index} title={name} value={percents + '%'} />)
      :
      (<div>Данных нет</div>)
  }

  drawPortrait() {
    const { portrait } = this.state
    return portrait.length > 0 ?
      portrait.map(({ name, all, values }, index) => {
        return (
          <div key={Math.random()}>
            <h3 className="bPortraitLabel"><b>{name}</b> ({all})</h3>
            <div className="percentsList">
              {this.drawValues(values)}
            </div>
          </div>
        )
      })
      :
      (<div>Данных нет</div>)
  }

  render() {
    const { show } = this.state
    return (
      <div className="bContent">
        <Progress style={{ boxShadow: 'none' }} percent={this.state.progress} color="#D29FCD" height="12" />
        <h1>
          Портрет клиента
          <PeriodRadio onChange={this.onPeriodChange} />
        </h1>
        {show === 'period' && <Period onInterval={this.onInterval} />}
        <div className="innerContent">
          {this.drawPortrait()}
        </div>
      </div>
    )
  }
}
