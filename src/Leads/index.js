import React from 'react'
import './styles.css'
import TextStats from '../TextStats'
import httpError from '../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

export default class Leads extends React.Component {
  constructor(props) {
    super(props);
    this.state = { missed: 0, halfMissed: 0, overMissed: 0, progress: 0 }
  }

  componentDidMount() {
    const fromLocalStorage = localStorage.getItem('leads')
    if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
    this.setState({ msid: Cookies.get('msid') }, () => this.fetchInfo())
  }

  fetchInfo() {
    this.setState({ progress: 7 })

    const { msid } = this.state
    let url = `http://papi.mindsales-crm.com/stats/leads/fucked?token=${msid}`

    axios.get(url)
      .then(({ data }) => {
        const { missed, halfMissed, overMissed } = data
        this.setState({ progress: 100, missed, halfMissed, overMissed })
        localStorage.setItem('leads', JSON.stringify({ missed, halfMissed, overMissed }))
      })
      .catch(httpError);
  }

  render() {
    const { progress, missed, overMissed, halfMissed } = this.state
    return (
      <div className="bContent">
        <Progress style={{ boxShadow: 'none' }} percent={progress} color="#D29FCD" height="12" />
        <h1>Пропущенные лиды</h1>
        <div className="innerContent">
          <div className="leadsOfPain">
            <div className="leadsOfPain__all">{missed}</div>
            <div className="leadsOfPain__details">
              <TextStats title="Никто не ответил и не перезвонил" value={overMissed} size="40" />
              <TextStats title="Менеджеры не дозвонились" value={halfMissed} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
