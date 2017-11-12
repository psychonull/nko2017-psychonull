import React, {Component} from 'react';
import axios from 'axios';
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
    status: 'ready',
    event: {}
  }

  onChange(change) {
    this.setState({event: Object.assign({}, this.state.event, change)})
  }

  onSubmit() {
    // TODO: Data validations
    this.setState({status: 'saving'})

    axios
      .post('/api/events', this.state.event)
      .then(res => this.setState({status: 'success'}))
      .catch(err => this.setState({status: 'error'}))
  }

  render() {
    if (this.state.status === 'success'){
      return (
        <div>
          EVENT CREATED!, go check your email
        </div>
      )
    }

    return (
      <div className="CreateEvent container is-fluid">
        <section className="hero is-dark is-small">
          <div className="hero-body">
            <div className="container level">
              <h1 className="title">
                New Event
              </h1>
              <h2 className="subtitle">
                [LOGO]
              </h2>
            </div>
          </div>
        </section>
        <div className="section CreateEvent-formSection">
          <div className="columns">
            <div className="column is-centered CreateEvent-form">
              <CreateEventForm {...this.state.event}
                saving={this.state.status === 'saving'}
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
