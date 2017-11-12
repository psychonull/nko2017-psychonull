import React from 'react';
import PropTypes from 'prop-types'
import FaPreview from 'react-icons/lib/fa/eye';
import FaSource from 'react-icons/lib/fa/font';
import ReactMarkdown from 'react-markdown'
import './CreateEventForm.css';

import {FormControl, DateControl, createSubmit} from '../../controls/forms'
import User from '../../controls/User'
import _ from '../../language';

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
          <User {...{name, email, errors, onChange}}/>
          <div className="column is-4">
            <div className="CreateEventForm-create">
              <input className={`button is-primary is-large ${isSaving ? 'is-loading' : ''}`}
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
  maxAttendees: 10,
  onChange: () => {},
  onSubmit: () => {},
  onTogglePreview: () => {},
  errors: {}
}

export default CreateEventForm;
