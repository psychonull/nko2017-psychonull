import React from 'react';
import PropTypes from 'prop-types'
import './CreateEventForm.css';

let _ = attr => ({
  email: 'Your Email',
  when: 'When',
  title: 'Title',
  body: 'Body',
  max_participants: 'Max.',
  create: 'Create'
})[attr]

let parse = (type, value) => {
  switch(type) {
    case 'number': return Number(value) || 0;
    default: return value;
  }
}

let parseValue = (attr, type, cb) => e => cb({[attr]: parse(type, e.target.value)})

let FormControl = ({_, noLabel, attr, type, onChange, ...props}) =>
  <div className="control">
    {!noLabel && <label>{_(attr)}</label>}
    <input {...props} type={type} onChange={parseValue(attr, type, onChange)}/>
  </div>

FormControl.propTypes = {
  _: PropTypes.func.isRequired,
  noLabel: PropTypes.bool,
  type: PropTypes.string,
  attr: PropTypes.string,
  onChange: PropTypes.func
}
FormControl.defaultProps = {
  _,
  type: 'text',
  onChange: () => {}
}

let createSubmit = submit => e => {
  e.preventDefault();
  submit();
}

let CreateEventForm = ({
  email,
  when,
  title,

  attendees,
  body,
  maxAttendees,

  onChange,
  onSubmit
}) =>
  <div className="CreateEventForm">
    <form onSubmit={createSubmit(onSubmit)}>
      <FormControl type="email" attr="email" value={email} onChange={onChange} />
      <FormControl attr="title" value={title} onChange={onChange} />
      <FormControl attr="when" value={when} onChange={onChange} />
      <FormControl type="number" attr="maxAttendees" value={maxAttendees} onChange={onChange} />

      <textarea defaultValue={_('descrition')} value={body} onChange={e => onChange({'body': e.target.value})}>
      </textarea>
      <input type="submit" value={_('create')}/>
    </form>
  </div>

CreateEventForm.propTypes = {
  email: PropTypes.string,
  when: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  maxAttendees: PropTypes.number,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
}
CreateEventForm.defaultProps = {
  email: '',
  when: '',
  title: '',
  body: '',
  maxAttendees: 0,
  onChange: () => {},
  onSubmit: () => {}
}

export default CreateEventForm;
