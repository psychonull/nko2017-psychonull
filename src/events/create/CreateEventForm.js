import React from 'react';
import PropTypes from 'prop-types'
import './CreateEventForm.css';
import FaEnvelope from 'react-icons/lib/fa/envelope';
import FaAsterisk from 'react-icons/lib/fa/asterisk';

let _ = attr => ({
  label_email: 'Your Email',
  label_when: 'When',
  label_title: 'Title',
  label_body: 'Body',
  label_maxAttendees: 'Max',

  placeholder_name: 'Your Name',
  placeholder_email: 'Your email address',
  placeholder_body: 'Enter any info about the event (You can use markdown here)',

  hint_email: 'This address is used to confirm the event creation and let you make later changes on it. It will be hidden to others',
  hint_when: '',
  hint_title: '',
  hint_body: '',
  hint_maxAttendees: '',

  create: 'Create'
})[attr]

let parse = (type, value) => {
  switch(type) {
    case 'number': return Number(value) || 0;
    default: return value;
  }
}

let parseValue = (attr, type, cb) => e => cb({[attr]: parse(type, e.target.value)})

let FormField = ({label, hint, children}) =>
  <div className="field">
    {label && <label className="label">{label}</label>}
    {children}
    {hint && <p class="help">{hint}</p>}
  </div>
FormField.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string
}

let FormInput = ({type, attr, onChange, ...props}) =>
  <input className="input" {...props} type={type} onChange={parseValue(attr, type, onChange)}/>
FormInput.propTypes = {
  type: PropTypes.string,
  attr: PropTypes.string,
  onChange: PropTypes.func
}
FormInput.defaultProps = {
  type: 'text',
  onChange: () => {}
}

let FormControl = ({_, attr, hint, required, ...props}) =>
  <FormField label={_(`label_${attr}`)} hint={_(`hint_${attr}`)}>
    <div className={`control ${required ? 'has-icons-right' : ''}`}>
      <FormInput {...props} attr={attr} placeholder={_(`placeholder_${attr}`)}/>
      {required && <span className="icon is-small is-right has-text-danger"><FaAsterisk /></span>}
    </div>
  </FormField>

FormControl.propTypes = {
  _: PropTypes.func.isRequired,
  required: PropTypes.bool,
  attr: PropTypes.string
}
FormControl.defaultProps = {
  _,
}

let createSubmit = submit => e => {
  e.preventDefault();
  submit();
}

let CreateEventForm = ({
  name,
  email,
  when,
  title,

  attendees,
  body,
  maxAttendees,

  onChange,
  onSubmit,
  isSaving
}) =>
  <div className="CreateEventForm column">
    <form onSubmit={createSubmit(onSubmit)}>
      <div className="columns">
        <div className="column is-7">
          <FormControl attr="title" value={title} onChange={onChange} required/>
        </div>
        <div className="column is-3">
          <FormControl attr="when" value={when} onChange={onChange} required/>
        </div>
        <div className="column is-2">
          <FormControl type="number" attr="maxAttendees" value={maxAttendees} onChange={onChange} />
        </div>
      </div>

      <div className="field">
        <label className="label">{_('body')}</label>
        <div className="control">
          <textarea className="textarea" value={body} placeholder={_('placeholder_body')} onChange={e => onChange({'body': e.target.value})}/>
        </div>
      </div>

      <div className="CreateEventForm-footer">
        <div className="columns is-vcentered is-centered">
          <div className="column is-8">
            <div className="field">
              <div className="control">
                <FormInput type="name" attr="name" value={name} placeholder={_('placeholder_name')} onChange={onChange} />
              </div>
            </div>
            <div className="field">
              <div className="control has-icons-left has-icons-right is-expanded">
                <FormInput type="email" attr="email" value={email} placeholder={_('placeholder_email')} onChange={onChange} />
                <span className="icon is-small is-left">
                  <FaEnvelope />
                </span>
                <span className="icon is-small is-right has-text-danger">
                  <FaAsterisk />
                </span>
                <p className="help">{_('hint_email')}</p>
              </div>
            </div>
          </div>
          <div className="column is-4">
            <div className="CreateEventForm-create">
              <input className={`button is-primary is-large ${isSaving ? 'loading' : ''}`}
                disabled={isSaving} type="submit" value={_('create')}/>
            </div>
          </div>
        </div>
      </div>

    </form>
  </div>

CreateEventForm.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  when: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  maxAttendees: PropTypes.number,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  isSaving: PropTypes.bool
}
CreateEventForm.defaultProps = {
  name: '',
  email: '',
  when: '',
  title: '',
  body: '',
  maxAttendees: 0,
  onChange: () => {},
  onSubmit: () => {}
}

export default CreateEventForm;
