import React from 'react'
import { NavLink } from 'react-router-dom'
import './styles.css'

export default ({ menu }) =>
  <div className="bSidebar">
    <ul className="bMainmenu">

      <li className="bMainmenu__title">Лиды</li>
      <li className="bMainmenu__item">
        <NavLink to="/leads" activeClassName="bMainmenu__item--active">
          Пропущенные
        </NavLink>
      </li>
      <li className="bMainmenu__item">
        <NavLink to="/leads-by-managers" activeClassName="bMainmenu__item--active">
          Необработанные
        </NavLink>
      </li>

      <li className="bMainmenu__title">Эффективность менеджеров</li>
      <li className="bMainmenu__item">
        <NavLink to="/users-stats" activeClassName="bMainmenu__item--active">
          Количество клиентов
        </NavLink>
      </li>
      <li className="bMainmenu__item">
        <NavLink to="/users-details" activeClassName="bMainmenu__item--active">
          Закрытые клиенты
        </NavLink>
      </li>

      <li className="bMainmenu__title">Воронка продаж</li>
      <li className="bMainmenu__item">
        <NavLink to="/progress" activeClassName="bMainmenu__item--active">
          Текущие сделки
        </NavLink>
      </li>
      <li className="bMainmenu__item">
        <NavLink to="/funnel" activeClassName="bMainmenu__item--active">
          Закрытые сделки
        </NavLink>
      </li>

      <li className="bMainmenu__title">Клиентская база</li>
      <li className="bMainmenu__item">
        <NavLink to="/customers-deal" activeClassName="bMainmenu__item--active">
          Сделки
        </NavLink>
      </li>
      <li className="bMainmenu__item">
        <NavLink to="/customers-reject" activeClassName="bMainmenu__item--active">
          Отказы
        </NavLink>
      </li>

      {/* фичи без раздела */}
      <li className="bMainmenu__title">Маркетинговые данные</li>
      <li className="bMainmenu__item">
        <NavLink to="/portrait" activeClassName="bMainmenu__item--active">
          Портрет клиента
        </NavLink>
      </li>

      <li className="bMainmenu__item">
        <NavLink to="/trunks" activeClassName="bMainmenu__item--active">
          Эффективность рекламных источников
        </NavLink>
      </li>

    </ul>
  </div>;
