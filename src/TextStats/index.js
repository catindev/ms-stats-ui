import React from 'react';
import './styles.css';

const setSize = size => ({ fontSize: size ? `${size}px` : '32px' })

export default ({ title, value, size }) => 
  <div className="textStats">
    <div className="textStats__title">{title}</div>
    <div className="textStats__value" style={setSize(size)}>{value}</div>
  </div>;
