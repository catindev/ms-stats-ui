import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/ru';
import moment from 'moment'

import './styles.css'

import PubSub from '../PubSub'
const PeriodChannel = new PubSub('period');

const prevMonth = moment(new Date()).subtract(1, 'months').toDate()

const dateFormat = date => moment(date).format("D MMMM YYYY");
const dateFormatSubmit = date => moment(new Date(date)).format('YYYY-MM-DD');

function PeriodLabel({ start, end, onReset }) {
    start = dateFormat(start).split(' ')
    end = dateFormat(end).split(' ')

    if (start[2] === end[2]) start.splice(2, 1)
    else return (<span style={{ color: '#989898' }}>
        Период c {start.join(' ')} по {end.join(' ')}
        <a className="bPeriod__setupLink" onClick={onReset}>Выбрать другой</a>
    </span>)

    if (start[1] === end[1]) start.splice(1, 1)
    else return (<span style={{ color: '#989898' }}>
        Период c {start.join(' ')} по {end.join(' ')}
        <a className="bPeriod__setupLink" onClick={onReset}>Выбрать другой</a>
    </span>)

    return (<span style={{ color: '#989898' }}>
        Период c {start.join(' ')} по {end.join(' ')}
        <a className="bPeriod__setupLink" onClick={onReset}>Выбрать другой</a>
    </span>)
}

export default class Period extends React.Component {
    static defaultProps = { numberOfMonths: 1 };

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.resetState(), { animateClass: 'hidePeriod' });

        this.endDayClick = this.endDayClick.bind(this);
        this.startDayClick = this.startDayClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this.setState({ animateClass: 'showPeriod' }), 0)
    }

    resetState() {
        return {
            start: undefined,
            end: undefined,
        };
    }

    handleResetClick() {
        this.setState(this.resetState());
    }

    handleSubmitClick() {
        const { start, end } = this.state;
        const data = {
            start: dateFormatSubmit(start),
            end: dateFormatSubmit(end)
        }
        this.props.onInterval(data)
        PeriodChannel.publish(data)
    }

    endDayClick(day, { selected }) {
        this.setState({ end: selected ? undefined : day }, () => {
            const { start, end } = this.state;
            if (!start || !end) return;
            this.handleSubmitClick()
        });
    }

    startDayClick(day, { selected }) {
        this.setState({ start: selected ? undefined : day }, () => {
            const { start, end } = this.state;
            if (!start || !end) return;
            this.handleSubmitClick()
        });
    }

    render() {
        const { start, end, animateClass } = this.state;
        return (
            <div className={'bPeriodWrapper ' + animateClass}>
                <h4>
                    {(!start || !end) && 'Выберите даты начала и конца периода'}
                    {(start && end) && <PeriodLabel start={start} end={end} onReset={this.handleResetClick} />}
                </h4>
                <div className={start && end ? 'hidePeriod' : 'showPeriod'}>
                    <DayPicker
                        month={prevMonth}
                        localeUtils={MomentLocaleUtils}
                        locale="ru"
                        className="bPeriod bPeriod__delimeter"
                        disabledDays={{ before: this.state.start, after: this.state.end }}
                        selectedDays={this.state.start}
                        onDayClick={this.startDayClick}
                    />
                    <DayPicker
                        disabled
                        className="bPeriod"
                        localeUtils={MomentLocaleUtils}
                        locale="ru"
                        disabledDays={{ before: this.state.start, after: this.state.end }}
                        selectedDays={this.state.end}
                        onDayClick={this.endDayClick}
                    />
                </div>
            </div>
        );
    }
}