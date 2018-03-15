import React from 'react'
import './styles.css'

import TextStats from '../../../TextStats'

export default ({ name, customers, deals, rejects }) =>
    <div className="bUserStatsCard">
        <h2>{name}</h2>
        <div className="bUserStatsCard__content">
            <div className="bUserStatsCard__allCustomers">{customers}</div>
            <div className="bUserStatsCard__details">
                <TextStats title="Отказы" value={rejects} />
                <TextStats title="Сделки" size="24" value={deals || 'Нет 😕'} />
            </div>
        </div>
    </div>