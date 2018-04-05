import React from 'react';
import './styles.css';

function fwaiting(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const types = {
  'assigned': '👥',
  'reopen': '💫',
  'reject': '🚽',
  'deal': '💰',
  'note': '💬',
  'created': '🐣'
}

const getCommentText = ({ type, comment, amount, user, trunk, reason }) => {
  if (type === 'assigned') return 'Клиент назначен на менеджера'
  if (type === 'reopen') return 'Открыта новая сделка'
  if (type === 'reject') return 'Отказ от сделки. Причина — ' + (comment ? comment : reason)
  if (type === 'deal') return 'Успешная сделка. Сумма — ' + amount + '.' + (comment ? comment : '')
  if (type === 'note') return comment
  if (type === 'created') {
    return 'Клиент зарегистрирован ' + (user ?
      'менеджером' : 'автоматически по звонку на источник «' + trunk.name + '»'
    )
  }
}

const Label = ({ date, type, user }) =>
  <div className="bCustomerBreadcrumb__label">
    {date}&nbsp;
    <span className="bCustomerBreadcrumb__divider"></span>&nbsp;
    {user ? user.name : 'Майндсейлс'}&nbsp;&nbsp;{types[type]}
  </div>;

const Comment = params =>
  <div className="bCustomerBreadcrumb__comment">
    {getCommentText(params)}
  </div>;

export default ({ type, date, comment, amount, reason, user, trunk, previousStep }) =>
  <div className="bCustomerBreadcrumb">
    <Label type={type} date={date} user={user} />
    <Comment type={type} user={user} comment={comment}
      amount={amount} trunk={trunk} reason={reason} />
  </div>;
