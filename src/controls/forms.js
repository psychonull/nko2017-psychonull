import React from 'react';
import PropTypes from 'prop-types'
import FaAsterisk from 'react-icons/lib/fa/asterisk';

// TODO: move this into controls and import it from there
// import DatePicker from '../../controls/DatePicker'
import moment from 'moment'
import ReactDatePicker from 'react-datetime';
import './/DatePicker/DatePicker.css';

import _ from '../language'

export let parse = (type, value) => {
  switch(type) {
    case 'number': return Number(value) || 0;
    case 'datetime': return moment(value).isValid() ? value.toJSON() : '';
    default: return value;
  }
}

export let parseValue = (attr, type, cb) => e => cb({[attr]: parse(type, type === 'datetime' ? e : e.target.value)})

export let FormField = ({label, hint, error, children}) =>
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

export let FormInput = ({type, attr, error, onChange, ...props}) =>
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

export let FormControl = ({_, attr, hint, required, error, ...props}) =>
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

export let DateControl = ({_, attr, hint, required, error, onChange, ...props}) =>
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

export let createSubmit = submit => e => {
  e.preventDefault();
  submit();
}
