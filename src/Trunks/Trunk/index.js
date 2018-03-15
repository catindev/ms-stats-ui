import React from 'react'
import './styles.css'

import TextStats from '../../TextStats'

export default ({ name, customers, deals, rejects, inProgress }) =>
    <div className="bTrunkCard">
        <h2>{name}</h2>
        <div className="bTrunkCard__content">
            <div className="bTrunkCard__allCustomers">{customers}</div>
            <div className="bTrunkCard__details">
                <TextStats title="Лиды и клиенты в работе" value={inProgress} />
                <TextStats title="Сделки" value={deals} />
                <TextStats title="Отказы" value={rejects} />
            </div>
        </div>
    </div>