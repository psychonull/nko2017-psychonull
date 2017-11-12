import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import Modal from '../../controls/Modal'
import User from '../../controls/User'
import Joi from 'joi-browser'
import isEmpty from 'lodash/isEmpty'
import AttendeeSchema from '../../schemas/attendee';
import {validate, createSchema} from '../../utils/validator'
import './ActionButton.css';

let isValidAttendee = validate(
  createSchema({
    name: 'Your Name',
    email: 'Your Email'
  }, AttendeeSchema(Joi).post)
)

let getDefaultState = () => ({
  joinButton: false,
  cancelButton: false,
  joinModal: false,
  cancelModal: false,
  error: null,
  attendee: {
    name: '',
    email: '',
    states: 'ready',
    errors: {}
  }
})

class ActionButton extends Component {
  state = getDefaultState()

  resetState() {
    this.setState(getDefaultState())
  }

  componentDidMount() {
    let {token, event} = this.props;

    // It's in the past so no action can be done
    if (moment(event.when) < moment()) return

    // Event is not ready yet to be joined
    if (event.status !== 'CONFIRMED') return

    // No user authenticated to check
    if (!token) return this.setState({joinButton: true})

    // let isJoined =>
    this.setState({joinButton: true})
  }

  updateAttendee(changes) {
    this.setState({attendee: Object.assign({}, this.state.attendee, changes)})
  }

  onJoin() {
    let {name, email} = this.state.attendee
    let errors = isValidAttendee({name, email})
    if (!isEmpty(errors)) {
      this.updateAttendee({errors})
      return
    }

    axios
      .post(`/api/events/${this.props.eventId}/attendees`, {name, email})
      .then(res => {
        this.updateAttendee({status: 'joined'})
      })
      .catch(err => {
        // TODO: Catch errors with the event, like maxAttendees, Pending Event, etc
        console.log(err)
        this.updateAttendee({status: 'error', errors})
      })
  }

  render() {
    if (this.state.joinModal) {
      let isJoining = this.state.attendee.status === 'joining'
      let hasJoined = this.state.attendee.status === 'joined'

      return (
        <Modal title="Join Event"
          okButton={
            isJoining
              ? <button className="button is-primary is-loading" disabled>Join</button>
              : hasJoined
                ? <button className="button" onClick={this.resetState.bind(true)}>Close</button>
                : <button className="button is-primary" onClick={this.onJoin.bind(this)}>Join</button>
          }
          onClose={() => !isJoining ? this.resetState() : null}>
          {
            hasJoined
            ? <div>You are now joined to this event! <b>BUT</b> you need to confirm it so check your inbox for the magic link</div>
            : <User {...this.state.attendee} onChange={this.updateAttendee.bind(this)}/>
          }
        </Modal>
      )
    }

    return this.state.joinButton && <button
      onClick={e => this.setState({joinModal: true})}
      className="button is-primary is-large ActionButton-join">Join</button>
  }
}

export default ActionButton;
