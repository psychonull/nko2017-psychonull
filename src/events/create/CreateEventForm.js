import React from 'react';
import PropTypes from 'prop-types'
import FaAsterisk from 'react-icons/lib/fa/asterisk';
import FaEnvelope from 'react-icons/lib/fa/envelope';
import FaPreview from 'react-icons/lib/fa/eye';
import FaSource from 'react-icons/lib/fa/font';
import ReactMarkdown from 'react-markdown'
import './CreateEventForm.css';

// TODO: move this into controls and import it from there
// import DatePicker from '../../controls/DatePicker'
import moment from 'moment'
import ReactDatePicker from 'react-datetime';
import '../../controls/DatePicker/DatePicker.css';

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
    case 'datetime': return moment(value).isValid() ? value.toJSON() : '';
    default: return value;
  }
}

let parseValue = (attr, type, cb) => e => cb({[attr]: parse(type, type === 'datetime' ? e : e.target.value)})

let FormField = ({label, hint, error, children}) =>
  <div className="field">
    {label && <label className="label">{label}</label>}
    {children}
    {error && <p class="help is-danger">{error}</p>}
    {!error && hint && <p class="help">{hint}</p>}
  </div>
FormField.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.string
}

let FormInput = ({type, attr, error, onChange, ...props}) =>
  <input className={`input ${error ? 'is-danger' : ''}`} {...props}
    title={error} type={type} onChange={parseValue(attr, type, onChange)}/>
FormInput.propTypes = {
  type: PropTypes.string,
  attr: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func
}
FormInput.defaultProps = {
  type: 'text',
  onChange: () => {}
}

let FormControl = ({_, attr, hint, required, error, ...props}) =>
  <FormField label={_(`label_${attr}`)} hint={_(`hint_${attr}`)} error={error}>
    <div className={`control ${required ? 'has-icons-right' : ''}`}>
      <FormInput {...props} attr={attr} error={error} placeholder={_(`placeholder_${attr}`)}/>
      {required && <span className="icon is-small is-right has-text-danger"><FaAsterisk /></span>}
    </div>
  </FormField>
FormControl.propTypes = {
  _: PropTypes.func.isRequired,
  required: PropTypes.bool,
  attr: PropTypes.string,
  error: PropTypes.string,
}
FormControl.defaultProps = {
  _,
}

let DateControl = ({_, attr, hint, required, error, onChange, ...props}) =>
  <FormField label={_(`label_${attr}`)} hint={_(`hint_${attr}`)} error={error}>
    <div className={`control ${required ? 'has-icons-right' : ''}`}>
      <ReactDatePicker {...props} value={moment(props.value)} onChange={parseValue(attr, 'datetime', onChange)}/>
      {required && <span className="icon is-small is-right has-text-danger"><FaAsterisk /></span>}
    </div>
  </FormField>
DateControl.propTypes = {
  _: PropTypes.func.isRequired,
  required: PropTypes.bool,
  attr: PropTypes.string,
  error: PropTypes.string,
}
DateControl.defaultProps = {
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
  body,
  maxAttendees,

  errors,
  onChange,
  onSubmit,
  isSaving,
  preview,
  onTogglePreview
}) =>
  <div className="CreateEventForm column">
    <form onSubmit={createSubmit(onSubmit)}>
      <div className="columns">
        <div className="column is-6">
          <FormControl attr="title" value={title} onChange={onChange} error={errors.title} required/>
        </div>
        <div className="column is-4">
          <DateControl attr="when" value={when} onChange={onChange} error={errors.when} required/>
        </div>
        <div className="column is-2">
          <FormControl type="number" attr="maxAttendees" value={maxAttendees} error={errors.maxAttendees} onChange={onChange} />
        </div>
      </div>

      <div className="field CreateEventForm-body">
        <label className="label">{_('body')}</label>
        <div className="control">
          {preview
            ? <div className="content CreateEventForm-bodyPreview"><ReactMarkdown source={body} /></div>
            : <textarea className="textarea" value={body} placeholder={_('placeholder_body')} onChange={e => onChange({'body': e.target.value})}/>
          }
        </div>
        <button className="button CreateEventForm-togglePreview" onClick={onTogglePreview}>
          {preview ? <span className="icon"><FaSource/></span> : <span className="icon"><FaPreview/></span>}
        </button>
      </div>

      <div className="CreateEventForm-footer">
        <div className="columns is-vcentered is-centered">
          <div className="column is-8">
            <div className="field">
              <div className="control">
                <FormInput type="name" attr="name" value={name} placeholder={_('placeholder_name')}  error={errors.name} onChange={onChange} />
              </div>
            </div>
            <div className="field">
              <div className="control has-icons-left has-icons-right is-expanded">
                <FormInput type="email" attr="email" value={email} error={errors.email} placeholder={_('placeholder_email')} onChange={onChange} />
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
  onTogglePreview: PropTypes.func,
  isSaving: PropTypes.bool,
  errors: PropTypes.object,
  preview: PropTypes.bool
}
CreateEventForm.defaultProps = {
  name: '',
  email: '',
  when: '',
  title: '',
  body: '',
  maxAttendees: 0,
  onChange: () => {},
  onSubmit: () => {},
  onTogglePreview: () => {},
  errors: {}
}

export default CreateEventForm;
