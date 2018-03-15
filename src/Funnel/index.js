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

// import fakeFunnelData from './fakeFunnel'
// import Pipeline from './Pipeline'

class Funnel extends React.Component {
  constructor(props) {
    super(props)
    this.state = { all: 0, funnel: [], interval: {}, show: 'all' }

    this.onInterval = this.onInterval.bind(this)
    this.onPeriodChange = this.onPeriodChange.bind(this)
  }

  componentDidMount() {
    const fromLocalStorage = localStorage.getItem('funnel')
    if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
    this.setState({ msid: Cookies.get('msid') }, () => this.fetchInfo())
  }

  fetchInfo() {
    this.setState({ progress: 9 })
    const delay = Math.floor(Math.random() * (100 - 10 + 1)) + 10
    const progress = Math.floor(Math.random() * (25 - 10 + 1)) + 10
    setTimeout(() => this.setState({ progress }), delay)

    const { msid } = this.state
    let url = `http://papi.mindsales-crm.com/stats/closed?token=${msid}`

    const { start, end } = this.state.interval
    if (start) url = `${url}&start=${start}`
    if (end) url = `${url}&end=${end}`

    axios.get(url)
      .then(({ data: { all, funnel } }) => {
        this.setState({ progress: 100, all, funnel })
        localStorage.setItem('funnel', JSON.stringify({ all, funnel }))
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

  drawFunnel() {
    const { funnel } = this.state
    let size = 60
    return funnel.length > 0 ?
      funnel.map(({ step, count }, index) => {
        size = size - 7
        return <TextStats key={index} title={step} value={count} size={size} />
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
          Закрытые сделки
          <PeriodRadio onChange={this.onPeriodChange} />
        </h1>
        {show === 'period' && <Period onInterval={this.onInterval} />}
        <div className="innerContent funnelWraper">
          {this.drawFunnel()}
          {/* <Pipeline data={fakeFunnelData}
            outerValueIdentifier='revenue'
            outerSecondaryValueIdentifier='revLabel'
            innerValueIdentifier='actual'
            compareValueIdentifier='goal'
            outerLabelIdentifier='goalLabel'>
          </Pipeline> */}
        </div>
      </div>
    )
  }
}

export default Funnel
