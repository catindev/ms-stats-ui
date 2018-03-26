import React from 'react'
import Select from 'react-select'
import './select.css'
// import 'react-select/dist/react-select.css';

import axios from 'axios'
import Cookies from 'js-cookie'
import httpError from '../httpError'

const fakes = [
    { value: 'AL', label: 'Alabama', disabled: true },
    { value: 'AK', label: 'Alaska' },
    { value: 'AS', label: 'American Samoa' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
]

export default class ManagersFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: 'all', data: [],
            selectValue: "",
            disabled: true,
        }

        this.onUpdateValue = this.onUpdateValue.bind(this)
    }

    componentDidMount() {
        this.fetchInfo()
    }

    fetchInfo() {
        const { msid } = this.state
        let url = `http://papi.mindsales-crm.com/users?token=${Cookies.get('msid')}`

        axios.get(url)
            .then(({ data: { items } }) => {
                this.setState({
                    managers: items.map(({ name, _id }) => ({ value: _id, label: name })),
                    disabled: false
                })
            })
            .catch(httpError);
    }

    onUpdateValue(newValue) {
        this.setState({ selectValue: newValue });
        this.props.onChange({ value: newValue })
    }

    render() {
        return (
            <Select
                id="ManagersFilter"
                placeholder="Все менеджеры"
                onBlurResetsInput={false}
                onSelectResetsInput={false}
                options={this.state.managers}
                simpleValue
                clearable={true}
                name="managers-filter"
                disabled={this.state.disabled}
                value={this.state.selectValue}
                onChange={this.onUpdateValue}
                searchable={true}
            />
        )
    }
}
