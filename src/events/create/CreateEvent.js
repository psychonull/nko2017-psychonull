import React, {Component} from 'react';
import CreateEventForm from './CreateEventForm';
import './CreateEvent.css';
/*
let testEvent = {
  email: 'pepe@gmail.com',
  when: '',
  title: 'Title',

  attendees: 'test text',
  body: 'pepe',
  maxAttendees: 5
}*/

class CreateEvent extends Component {
  state = {
    event: {}
  }

  onChange(change) {
    this.setState({event: Object.assign({}, this.state.event, change)})
  }

  onSubmit() {
    console.log(this.state)
  }

  render() {
    return (
      <div>
        <h1>Create Event</h1>
        <CreateEventForm {...this.state.event}
          onChange={this.onChange.bind(this)}
          onSubmit={this.onSubmit.bind(this)}/>
      </div>
    );
  }
}

export default CreateEvent;
