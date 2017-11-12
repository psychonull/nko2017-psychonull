import React, {Component} from 'react';
import get from 'lodash/get';
import axios from 'axios';
import './ViewEvent.css';
import Event from './Event'

class ViewEvent extends Component {
  state = {
    status: 'loading',
    id: null,
    error: null,
    token: null,
    event: {}
  }

  componentDidMount() {
    let {id, token} = get(this.props, 'match.params', {});
    this.setState({token, id, status: 'loading'})

    if (token) {
      this.props.history.replace(`/events/${id}`)
    }

    axios
      .get(`/api/events/${id}`, token && {headers: {Authorization: token}})
      .then(res => this.setState({status: 'success', event: res.data}))
      .catch(error => this.setState({status: 'error', error: error.response}))
  }

  render() {
    switch(this.state.status) {
      case 'loading': return (<div>Loading Event ...</div>);
      case 'error' : {
        switch (this.state.error.status){
          case 401: return (<div>Your link or token are failing</div>);
          case 404: return (<div>Event Not Found</div>);
          default: return (<div>There was an error when fetching the Event</div>);
        }
      }
      default: return (<Event {...this.state.event} />);
    }
  }
}

export default ViewEvent;
