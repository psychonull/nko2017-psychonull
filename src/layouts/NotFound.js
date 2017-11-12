import React from 'react';
import FullScreenMessage from './FullScreenMessage'

let NotFound = ({title, message}) =>
  <FullScreenMessage title={title || 'Not Found'} modifier="is-danger"
    message={message || 'There is nothing in here ¯\\_(ツ)_/¯'} />

export default NotFound;
