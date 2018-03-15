import React from 'react'
import './styles.css'
import TextStats from '../TextStats'
import httpError from '../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

export default class LeadsBy extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stats: [], overMissed: 0, progress: 0 }
  }

  componentDidMount() {
    const fromLocalStorage = localStorage.getItem('leadsBy')
    if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
    this.setState({ msid: Cookies.get('msid') }, () => this.fetchInfo())
  }

  fetchInfo() {
    this.setState({ progress: 12 })

    const { msid } = this.state
    let url = `http://papi.mindsales-crm.com/stats/leads?token=${msid}`

    axios.get(url)
      .then(({ data: { stats } }) => {
        this.setState({ progress: 100, stats })
        localStorage.setItem('leadsBy', JSON.stringify({ stats }))
      })
      .catch(httpError);
  }

  drawManagers() {
    const { stats } = this.state
    return stats.length > 0 ?
      stats.map(({ manager, count }) => <TextStats key={Math.random()} title={manager} value={count} />)
      :
      (<div>Данных нет</div>)
  }

  render() {
    return (
      <div className="bContent">
        <Progress style={{ boxShadow: 'none' }} percent={this.state.progress} color="#D29FCD" height="12" />
        <h1>Необработанные лиды</h1>
        <div className="innerContent">
          {this.drawManagers()}
        </div>
      </div>
    )
  }
}
