import React from 'react';
import './styles.css';

export default ({ title, children }) =>
    <section className="bStep">
        <header className="bStep__header">{title}</header>
        {children}
    </section>;
