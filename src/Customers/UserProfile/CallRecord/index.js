import React from 'react';
import './styles.css';

function fwaiting(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const setSize = size => ({ fontSize: size ? `${size}px` : '22px' })

const Label = ({ isCallback, date }) =>
  <div className="bCallRecord__label">
    {isCallback ? '→ исходящий' : '← входящий'}, {date}
  </div>;

const Audio = ({ record }) =>
  <audio controls controlsList="nodownload" className="bCallRecord__audio">
    <source src={record} type="audio/mpeg" />
  </audio>;

const Missing = ({ waiting }) =>
  <div className="bCallRecord__missing">Пропущенный. Время ожидания {fwaiting(waiting)}</div>;

export default ({ isCallback, date, record, duration }) =>
  <div className="bCallRecord">
    <Label isCallback={isCallback} date={date} />
    {record ? <Audio record={record} /> : <Missing waiting={duration.waiting} />}
  </div>;
