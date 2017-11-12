import React, {Component} from 'react';
import ReactDatePicker from 'react-datetime';
import './DatePicker.css';

// This control is not being used
// TODO: Move the current implementation on CreateEventForm of DatePicker into here

class DatePicker extends Component {
  render() {
    return (
      <ReactDatePicker {...this.props}/>
    );
  }
}

export default DatePicker;
