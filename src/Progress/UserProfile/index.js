import React from 'react';
import './styles.css';

import TextWithLabel from './TextWithLabel'
import CallRecord from './CallRecord'
import Breadcrumb from './Breadcrumb'

import { Tabs, Tab } from './Tabs'

const Breadcrumbs = ({ items }) => items && items.length > 0 ?
    items.map(b => b.type === 'call' || b.type === 'callback' ?
        <CallRecord key={Math.random()} {...(b.call)} />
        :
        <Breadcrumb key={Math.random()} {...(b)} />
    )
    :
    <div>В истории пусто 👀</div>;

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
            <Tab label="История">
                <Breadcrumbs items={customer.breadcrumbs} />
            </Tab>
            <Tab label="Профиль">
                <Profile items={profile} />
            </Tab>
        </Tabs>
    </section>;
