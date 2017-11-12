import React, {Component} from 'react';
import CreateEventForm from './CreateEventForm';
import './CreateEvent.css';
/*
let testEvent = {
  name: 'Pepe',
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
      <div className="CreateEvent container is-fluid">
        <section class="hero is-dark is-small">
          <div class="hero-body">
            <div class="container level">
              <h1 class="title">
                New Event
              </h1>
              <h2 class="subtitle">
                [LOGO]
              </h2>
            </div>
          </div>
        </section>
        <div className="section CreateEvent-formSection">
          <div className="columns">
            <div className="column is-centered CreateEvent-form">
              <CreateEventForm {...this.state.event}
                onChange={this.onChange.bind(this)}
                onSubmit={this.onSubmit.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEvent;
