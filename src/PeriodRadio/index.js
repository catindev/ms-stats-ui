import React from 'react'

export default class PeriodRadio extends React.Component {
    constructor(props) {
        super(props)
        this.state = { show: 'all' }
        this.clickAll = this.clickAll.bind(this)
        this.clickPeriod = this.clickPeriod.bind(this)
    }

    clickAll() {
        this.setState({ show: 'all' })
        this.props.onChange({ show: 'all' })
    }

    clickPeriod() {
        this.setState({ show: 'period' })
        this.props.onChange({ show: 'period' })
    }

    render() {
        const activeLinkStyles = { cursor: 'pointer', margin: '0 5px', padding: '5px 10px', display: 'inline-block', background: '#A9649E', color: '#fff', borderRadius: '4px' }
        const linkStyles = { cursor: 'pointer', margin: '0 5px', padding: '5px 0', display: 'inline-block', borderBottom: '2px solid rgba(169,100,158, .25)', color: '#A9649E' }
        const radioStyles = { fontSize: '16px', display: 'block', paddingTop: '1rem' }

        const { show } = this.state;
        return (
            <p style={radioStyles}>
                за
                <a style={show === 'all' ? activeLinkStyles : linkStyles} onClick={this.clickAll}>всё время</a>
                или
                <a style={show === 'period' ? activeLinkStyles : linkStyles} onClick={this.clickPeriod}>период</a>
            </p>
        )
    }
}
