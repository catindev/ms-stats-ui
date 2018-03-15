import React from 'react';
import './styles.css';

export default ({ title, children }) =>
    <article className="bNodata">
        {/* <header className="bNodata__header">{title}</header> */}
        {/* <div className="bNodata__detail">{details}</div> */}
        {children}
    </article>;