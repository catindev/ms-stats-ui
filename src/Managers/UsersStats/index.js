import React from 'react'
import './styles.css'
import TextStats from '../../TextStats'
import httpError from '../../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

export default class UsersStats extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stats: [], overMissed: 0, progress: 0 }
    }

    componentDidMount() {
        const fromLocalStorage = localStorage.getItem('usersStats')
        if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
        this.setState({ msid: Cookies.get('msid') }, () => this.fetchInfo())
    }

    fetchInfo() {
        this.setState({ progress: 12 })

        const { msid } = this.state
        let url = `http://papi.mindsales-crm.com/stats/users?token=${msid}`

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
                <h1>Количество клиентов у менеджеров</h1>
                <div className="innerContent">
                    {this.drawManagers()}
                </div>
            </div>
        )
    }
}
