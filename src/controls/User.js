import React from 'react'
import PropTypes from 'prop-types'
import FaAsterisk from 'react-icons/lib/fa/asterisk';
import FaEnvelope from 'react-icons/lib/fa/envelope';

import {FormInput} from './forms'
import _ from '../language';

let User = ({
  name,
  email,
  errors,
  onChange
}) =>
  <div className="User">
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

User.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  onChange: PropTypes.func,
  errors: PropTypes.object
}

User.defaultProps = {
  name: '',
  email: '',
  onChange: () => {},
  errors: {}
}

export default User
