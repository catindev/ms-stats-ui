import React from 'react'
import './styles.css'
import DatePicker from 'react-date-picker/build/entry.nostyle'

class Interval extends React.Component {
  constructor(props) {
    super(props);
    this.state = { start: '', end: 'interval', };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    const {name, value} = event.target
    let state = {}
    state[name] = value
    this.setState(state);
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.onInterval(this.state)
  }

  render() {
    return (
      <form className="bInterval" onSubmit={this.onSubmit}>
        <div className="formField">
          <label>Начало периода</label>
          <input type="date" name="start" onChange={this.onChange}/>          
        </div> 

        <div className="formField">
          <label>Конец периода</label>
          <input type="date" name="end" onChange={this.onChange}/>          
        </div>  

        <div className="formField">
          <button>Показать</button>          
        </div>          
      </form> )
  }
}

export default Interval

  // render() {
  //   return (
  //     <form className="bInterval" onSubmit={this.onSubmit}>
  //       <div className="formField">
  //         <label>Начало периода</label>
  //         <input type="date" name="start" onChange={this.onChange}/>          
  //       </div> 

  //       <div className="formField">
  //         <label>Конец периода</label>
  //         <input type="date" name="end" onChange={this.onChange}/>          
  //       </div>  

  //       <div className="formField">
  //         <label>Интервал</label>
  //         <select name="interval" onChange={this.onChange}>
  //             <option value="days">Дни</option>
  //             <option value="weeks">Недели</option>
  //             <option value="months">Месяцы</option>
  //         </select>            
  //       </div>

  //       <div className="formField">
  //         <button>Показать</button>          
  //       </div>          
  //     </form> )
  // }
