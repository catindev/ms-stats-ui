import React from 'react'
import './styles.css'
import asyncComponent from '../../asyncComponent'
import httpError from '../../httpError'

import Progress from 'react-progress'
import axios from 'axios'
import Cookies from 'js-cookie'

import UserDetailCard from './UserDetailCard'

class usersStatsDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = { stats: [], progress: 0 }
    }

    componentDidMount() {
        const fromLocalStorage = localStorage.getItem('usersStatsDetails')
        if (fromLocalStorage) this.setState(JSON.parse(fromLocalStorage))
        this.setState({ msid: Cookies.get('msid') }, () => this.fetchInfo())
    }

    fetchInfo() {
        this.setState({ progress: 12 })
        const delay = Math.floor(Math.random() * (100 - 10 + 1)) + 10
        const progress = Math.floor(Math.random() * (25 - 10 + 1)) + 10
        setTimeout(() => this.setState({ progress }), delay)

        const { msid } = this.state
        let url = `http://papi.mindsales-crm.com/stats/users/details?token=${msid}`

        axios.get(url)
            .then(({ data: { stats } }) => {
                this.setState({ progress: 100, stats })
                localStorage.setItem('usersStatsDetails', JSON.stringify({ stats }))
            })
            .catch(httpError);
    }

    drawStats() {
        const { stats } = this.state
        return stats.length > 0 ?
            stats.map(
                ({ user, customers, deals, rejects }) =>
                    <UserDetailCard key={Math.random()}
                        name={user}
                        customers={customers}
                        deals={deals}
                        rejects={rejects} />
            )
            :
            (<div>Данных нет</div>)
    }

    render() {
        const { show } = this.state
        return (
            <div className="bContent">
                <Progress style={{ boxShadow: 'none' }} percent={this.state.progress} color="#D29FCD" height="12" />
                <h1>Закрытые клиенты у менеджеров</h1>
                <div className="innerContent">
                    {this.drawStats()}
                </div>
            </div>
        )
    }
}

export default usersStatsDetails
