import React from 'react';
import './styles.css';

import TextWithLabel from './TextWithLabel'
import CallRecord from './CallRecord'

import { Tabs, Tab } from './Tabs'

const Calls = ({ items }) => items && items.length > 0 ?
    items.map(({ isCallback = false, date, record, duration: { waiting } }) => <CallRecord
        key={Math.random()}
        isCallback={isCallback}
        date={date}
        record={record}
        waiting={waiting}
    />)
    :
    <div>Звонков нет</div>;

const Profile = ({ items }) => items && items.length > 0 ?
    items.map(({ title, value }) => <TextWithLabel key={Math.random()} title={title} value={value} />)
    :
    <div>Профиль не заполнен</div>;

export default ({ customer, profile, onClose }) =>
    <section className="bUserProfile">
        <a className="bUserProfile__backLink" onClick={onClose}>
            ← Все клиенты
        </a>

        <h2 className="bUserProfile__title">{customer.name}</h2>
        <div className="bUserProfile__subtitle">{customer.info}</div>

        <TextWithLabel title="Номер" value={customer.phones.join(', ')} />
        <TextWithLabel title="Рекламный источник" value={customer.trunk.name} />
        <TextWithLabel title="Менеджер" value={customer.user.name} />
        <TextWithLabel title="Заметка" value={customer.notes} />

        <Tabs>
            <Tab label="Звонки">
                <Calls items={customer.calls} />
            </Tab>
            <Tab label="Профиль">
                <Profile items={profile} />
            </Tab>
        </Tabs>
    </section>;
