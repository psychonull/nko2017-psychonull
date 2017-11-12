import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';

// TODO: Move the HERO section into a Layout component (same on CreateEvent)

let Event = ({
  title,
  body,
  when,
  maxAttendance,
  attendees,
  createdBy,
  createdAt,
  updatedAt
}) =>
  <div className="ViewEvent container is-fluid">
    <section className="hero is-dark is-small">
      <div className="hero-body">
        <div className="columns">
          <div className="column is-half">
            <h1 className="title">
              {title}
            </h1>
            <h2 className="subtitle">
              {moment(when).format('YYYY/MM/DD HH:mm')}
            </h2>
          </div>
          <div className="column is-half ViewEvent-metas">
            <p>Created by {createdBy.me ? 'ME' : createdBy.name} at {moment(createdAt).format('YYYY/MM/DD HH:mm')}</p>
            <p>Last update {moment(updatedAt).format('YYYY/MM/DD HH:mm')}</p>
          </div>
        </div>
      </div>
    </section>
    <div className="section ViewEvent-formSection">
      <div className="columns">
        <div className="column is-half content">
          <h3 className="title">About this event</h3>
          <ReactMarkdown source={body} />
        </div>
        <div className="column is-half">
          <h3 className="title">Attendees ({attendees.length} / {maxAttendance})</h3>
          {attendees.map(({name, status, me}) => <li>{name}{me ? ' (me)' : ''} - {status}</li>)}
        </div>
      </div>
    </div>
  </div>

let UserShape = {
  // id: PropTypes.string,
  // email: PropTypes.string,
  name: PropTypes.string, // if no name should fullfil with [this]@email.com
  status: PropTypes.oneOf(['PENDING']),
  // createdAt: PropTypes.string,
  // updatedAt: PropTypes.string,
  // deletedAt: PropTypes.string
}

Event.propTypes = {
  // id: PropTypes.number, >>>> code?
  title: PropTypes.string,
  body: PropTypes.string,
  when: PropTypes.string,
  maxAttendance: PropTypes.number,
  attendees: PropTypes.arrayOf(PropTypes.shape(UserShape)),
  createdBy: PropTypes.shape(UserShape),
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  // deletedAt: PropTypes.string,
  // createdById: PropTypes.number,
}

export default Event;
