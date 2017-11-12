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

    // Event is not ready yet
    if (event.status !== 'CONFIRMED') return

    // No user authenticated to check
    if (!token) return this.setState({joinButton: true})

    // look for the user if is joined or not
    let myself = event.attendees.reduce((found, attendees) => attendees.me ? attendees : null, {})

    if (myself) {
      console.log(myself)
      if (myself.status === 'ACTIVE') return this.setState({cancelButton: true})
    }

    // if all fails show Join button
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
      .catch(errors => {
        // TODO: Catch errors with the event, like maxAttendees, Pending Event, etc
        console.log(errors)
        this.updateAttendee({status: 'error', errors})
      })
  }

  onLeave() {
    axios
      .delete(`/api/events/${this.props.eventId}/attendees`, {headers: {Authorization: this.props.token}})
      .then(res => this.setState(Object.assign(getDefaultState(), {joinButton: true})))
      .catch(errors => {
        // TODO: Catch errors with the event, like maxAttendees, Pending Event, etc
        console.log(errors)
        this.setState({status: 'error', errors})
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
                ? <button className="button" onClick={this.resetState.bind(this)}>Close</button>
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

    if (this.state.cancelModal) {
      let isCanceling = this.state.attendee.status === 'leaving'
      let hasCanceled = this.state.attendee.status === 'left'

      return (
        <Modal title="Leave Event"
          okButton={
            isCanceling
              ? <button className="button is-danger is-loading" disabled>Leave</button>
              : hasCanceled
                ? <button className="button" onClick={() => this.setState({cancelModal: false})}>Close</button>
                : <button className="button is-danger" onClick={this.onLeave.bind(this)}>Leave</button>
          }
          onClose={() => !isCanceling ? this.setState({cancelModal: false}) : null}>
          {
            hasCanceled
            ? <div>You are now out to this event, you can re-join later</div>
            : <div>You are about to leave this Event, are you sure?</div>
          }
        </Modal>
      )
    }

    if (this.state.cancelButton) return <button
      onClick={e => this.setState({cancelModal: true})}
      className="button is-danger is-large ActionButton-join">Leave</button>

    return this.state.joinButton && <button
      onClick={e => this.setState({joinModal: true})}
      className="button is-primary is-large ActionButton-join">Join</button>
  }
}

export default ActionButton;
