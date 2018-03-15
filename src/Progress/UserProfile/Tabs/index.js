import React from 'react';
import './styles.css';

const Tab = ({ active, children }) => active ? children : null;

class Tabs extends React.Component {
    constructor(props) {
        super(props)
        this.state = { active: props.active || 0 }
        this.click = this.click.bind(this)
    }

    click(active) {
        this.setState({ active })
    }

    render() {
        const tabNodes = this.props.children.map((child, index) => {
            return (
                <li key={Math.random()} onClick={e => this.click(index)}>
                    <a key={Math.random()} className={this.state.active === index ? 'active' : ''}>
                        {child.props.label}
                    </a>
                </li>
            )
        })

        const contentNodes = this.props.children
            .map((child, index) => this.state.active === index && (<div key={Math.random()} className="TabPane">{child.props.children}</div>))

        return (
            <div className="TabbedArea">
                <ul className="Tab clearfix">
                    {tabNodes}
                </ul>
                <section>
                    {contentNodes}
                </section>
            </div>
        )
    }
}

export { Tabs, Tab }