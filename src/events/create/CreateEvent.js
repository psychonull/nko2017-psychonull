import React, {Component} from 'react';
import axios from 'axios';
import CreateEventForm from './CreateEventForm';
import isEmpty from 'lodash/isEmpty'
import Joi from 'joi-browser'
import EventSchema from '../../schemas/event';
import {validate, createSchema} from '../../utils/validator'
import './CreateEvent.css';

let isValid = validate(
  createSchema({
    title: 'Title',
    when: 'When',
    maxAttendees: 'Max',
    body: 'Body',
    name: 'Your Name',
    email: 'Your Email'
  }, EventSchema(Joi).post)
)

class CreateEvent extends Component {
  state = {
    status: 'ready',
    errors: {},
    event: {}
  }

  onChange(change) {
    this.setState({event: Object.assign({}, this.state.event, change)})
  }

  onSubmit() {
    let errors = isValid(this.state.event)
    if (!isEmpty(errors)) {
      this.setState({errors})
      return
    }

    this.setState({status: 'saving', errors: {}})

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
                errors={this.state.errors}
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
