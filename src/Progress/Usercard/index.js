import React from 'react';
import './styles.css';

export default ({ title, details, onClick }) =>
    <article className="bUsercard" onClick={onClick}>
        <header className="bUsercard__header">{title}</header>
        <div className="bUsercard__detail">{details}</div>
    </article>;
