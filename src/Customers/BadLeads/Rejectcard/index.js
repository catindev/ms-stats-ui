import React from 'react';
import './styles.css';

export default ({ title, reason, details, onClick }) =>
    <article className="bRejectcard" onClick={onClick}>
        <header className="bRejectcard__header">{title}</header>
        <div className="bRejectcard__detail">
            {details}
        </div>
        <div className="bRejectcard__reason">Причина — {reason}</div>
    </article>;
