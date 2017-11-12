import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import Attendees, {getActiveAttendees, getStatuses} from './Attendees';

// TODO: Move the HERO section into a Layout component (same on CreateEvent)

let hasHappened = when => moment(when) < moment();
let getLink = eventId => <a href={`/events/${eventId}`}><b>{window.location.href}</b></a>

let renderWhen = when =>
  `${hasHappened(when) ? 'Happened' : 'Will happen'} ${moment(when).fromNow()} (${moment(when).format('DD/MM/YYYY HH:mm')})`;

let Event = ({
  eventId,
  title,
  body,
  when,
  maxAttendees,
  status,
  attendees,
  createdBy,
  createdAt,
  updatedAt
}) =>
  <div className="ViewEvent">
    <section className="hero is-dark is-small">
      <div className="hero-body">
        <div className="columns">
          <div className="column is-half">
            <h1 className="title">
              {title}
            </h1>
            <h2 className="subtitle">
              {renderWhen(when)}
            </h2>
          </div>
          <div className="column is-half">
            <div className="ViewEvent-metas">
              <p>Created by {createdBy.me ? <b>me</b> : createdBy.name} <span title={moment(createdAt).format('YYYY/MM/DD HH:mm')}>{moment(createdAt).fromNow()}</span></p>
              {/* Since it cannot be updated yet: <p>Last update {moment(updatedAt).format('YYYY/MM/DD HH:mm')}</p>*/}
            </div>
          </div>
        </div>
      </div>
    </section>
    <div className="section ViewEvent-content">
      <article class="message is-info">
        <div class="message-body" style={{textAlign: 'center'}}>
          Share this link {getLink(eventId)} to join this event
        </div>
      </article>
      <div className="columns">
        <div className="column is-half ViewEvent-section ViewEvent-body panel">
          <div className="header panel-heading">
            <h3 className="title">About this event</h3>
          </div>
          <div className="content panel-block">
            <ReactMarkdown source={body} />
          </div>
        </div>
        <div className="column is-half ViewEvent-section ViewEvent-attendees panel">
          <div className="header panel-heading">
            <h3 className="title">Attendees ({getActiveAttendees(attendees).length} / {maxAttendees})</h3>
          </div>
          <div className="panel-block">
            {
              status === 'PENDING'
                ? <p className="empty-attendance is-danger">This event is not confirmed, please check your inbox for a confirmation link</p>
                : getActiveAttendees(attendees).length > 0
                  ? <Attendees attendees={attendees} />
                  : <p className="empty-attendance">No attendees so far, click on the Join button to be the first one!</p>
            }
          </div>
        </div>
      </div>
    </div>
  </div>

Event.propTypes = {
  eventId: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  when: PropTypes.string,
  maxAttendees: PropTypes.number,
  attendees: PropTypes.array,
  status: PropTypes.string,
  createdBy: PropTypes.shape({
    name: PropTypes.string, // if no name should fullfil with [this]@email.com
    status: PropTypes.oneOf(getStatuses())
  }),
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
}

export default Event;
