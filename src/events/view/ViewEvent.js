import React, {Component} from 'react';
import get from 'lodash/get';
import axios from 'axios';
import Event from './Event'
import NotFound from '../../layouts/NotFound'
import FullScreenMessage from '../../layouts/FullScreenMessage'
import ActionButton from './ActionButton'
import './ViewEvent.css';

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

    // Test Views over error statuses
    // return this.setState({status: 'error', error: {status: 500}})

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
          case 401: return <FullScreenMessage title="Uh Oh!" message="That link doesn't work ˚‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚" modifier="is-warning"/>
          case 404: return <NotFound title="Event not found!" message="There is no such Event around here, sorry" />;
          default: return <FullScreenMessage title="BOOM!" message="Something went wrong! (╯°□°）╯︵ ┻━┻" modifier="is-danger"/>
        }
      }
      default: return (
        <div>
          <Event {...this.state.event} />
          <ActionButton event={this.state.event} token={this.state.token} eventId={this.state.id}/>
        </div>
      );
    }
  }
}

export default ViewEvent;
