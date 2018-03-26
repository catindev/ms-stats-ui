import React from 'react'
import './styles.css'
import TextStats from '../../TextStats'
import httpError from '../../httpError'
import asyncComponent from '../../asyncComponent'
import PeriodRadio from '../../PeriodRadio'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

const Period = asyncComponent(
    () => import('../../Period').then(module => module.default),
    { name: 'Period' },
)

export default class UsersStats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: [], overMissed: 0, progress: 0,
            interval: {}, show: 'all'
        }

        this.onInterval = this.onInterval.bind(this)
        this.onPeriodChange = this.onPeriodChange.bind(this)
    }

    onInterval(interval) {
        this.setState({ interval }, () => this.fetchInfo());
    }

    onPeriodChange({ show }) {
        this.setState({ show });
        if (show === 'all') this.setState({ interval: {} }, () => this.fetchInfo());
    }

    componentDidMount() {
        const fromLocalStorage = localStorage.getItem('usersStats')
        if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
        this.setState({ msid: Cookies.get('msid') }, () => this.fetchInfo())
    }

    fetchInfo() {
        this.setState({ progress: 12 })

        const { msid, start, end } = this.state
        let url = `http://papi.mindsales-crm.com/stats/users?token=${msid}`
        if (start) url = `${url}&start=${start}`
        if (end) url = `${url}&end=${end}`

        axios.get(url)
            .then(({ data: { stats } }) => {
                this.setState({ progress: 100, stats })
                localStorage.setItem('usersStats', JSON.stringify({ stats }))
            })
            .catch(httpError);
    }

    drawManagers() {
        const { stats } = this.state
        return stats.length > 0 ?
            stats.map(({ user, customers }) => <TextStats key={Math.random()} title={user} value={customers} />)
            :
            (<div>Данных нет</div>)
    }

    render() {
        return (
            <div className="bContent">
                <Progress style={{ boxShadow: 'none' }} percent={this.state.progress} color="#D29FCD" height="12" />
                <h1>
                    Количество клиентов у менеджеров
                </h1>
                <div className="innerContent">
                    {this.drawManagers()}
                </div>
            </div>
        )
    }
}
