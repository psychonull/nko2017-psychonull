import React from 'react';
import PropTypes from 'prop-types';

export let getActiveAttendees = attendees => attendees.filter(({status}) => status === 'ACTIVE')
export let getStatuses = () => ['PENDING', 'ACTIVE', 'DELETED']
export let Status = getStatuses().map(status => ({[status]: status}))

let Attendee = ({name, status, me}) =>
  <li className="Attendee">
    {name}{me ? ' (me)' : ''} - {status}
  </li>

Attendee.propTypes = {
  name: PropTypes.string, // if no name should fullfil with [this]@email.com
  status: PropTypes.oneOf(getStatuses()),
  me: PropTypes.bool
}

let Attendees = ({attendees}) =>
  <ul className="Attendees">
    {getActiveAttendees(attendees)
      .map((attendee, i) => <Attendee key={attendee.UserId || i} {...attendee} />)}
  </ul>

Attendees.propTypes = {
  attendees: PropTypes.arrayOf(PropTypes.shape(Attendee.propTypes))
}

export default Attendees;
